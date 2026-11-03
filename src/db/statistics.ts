import { and, asc, desc, eq, gte, lt, or, sql, sum } from 'drizzle-orm'
import { openDatabase } from './index'
import { operationsTable } from './schema'

export type StatisticsPeriod = {
  dateFrom: Date
  dateTo: Date
}

export type DailyStatistics = {
  date: string
  income: number
  expense: number
}

export type CategoryStatistics = {
  name: string
  amount: number
}

export type StatisticsData = {
  totals: { income: number, expense: number }
  days: DailyStatistics[]
  categories: CategoryStatistics[]
}

//Границы периода включают весь последний день, корректировки исключены
function getPeriodConditions(period: StatisticsPeriod) {
  const start = new Date(period.dateFrom)
  start.setHours(0, 0, 0, 0)
  const end = new Date(period.dateTo)
  end.setHours(0, 0, 0, 0)
  end.setDate(end.getDate() + 1)

  return and(
    gte(operationsTable.date, start),
    lt(operationsTable.date, end),
    or(eq(operationsTable.type, 'income'), eq(operationsTable.type, 'expense'))
  )
}

//Доходы и расходы за выбранный период
export async function getStatistics(period: StatisticsPeriod) {
  const db = await openDatabase()
  const rows = db.select({ type: operationsTable.type, amount: sum(operationsTable.amount) })
    .from(operationsTable).where(getPeriodConditions(period)).groupBy(operationsTable.type).all()
  const totals = { income: 0, expense: 0 }

  for (const row of rows) {
    if (row.type === 'income') totals.income = Number(row.amount || 0)
    if (row.type === 'expense') totals.expense = Number(row.amount || 0)
  }

  return totals
}

//Группировка по календарному дню в часовом поясе устройства
export async function getDailyStatistics(period: StatisticsPeriod) {
  const db = await openDatabase()
  const day = sql<string>`date(${operationsTable.date} / 1000, 'unixepoch', 'localtime')`
  const rows = db.select({ date: day, type: operationsTable.type, amount: sum(operationsTable.amount) })
    .from(operationsTable).where(getPeriodConditions(period))
    .groupBy(day, operationsTable.type).orderBy(asc(day)).all()
  const days: Record<string, DailyStatistics> = {}

  for (const row of rows) {
    if (!days[row.date]) days[row.date] = { date: row.date, income: 0, expense: 0 }
    if (row.type === 'income') days[row.date].income = Number(row.amount || 0)
    if (row.type === 'expense') days[row.date].expense = Number(row.amount || 0)
  }

  return Object.values(days)
}

//Расходы по категориям от большей суммы к меньшей
export async function getCategoryStatistics(period: StatisticsPeriod) {
  const db = await openDatabase()
  const amount = sum(operationsTable.amount)
  const rows = db.select({ name: operationsTable.category, amount }).from(operationsTable)
    .where(and(getPeriodConditions(period), eq(operationsTable.type, 'expense')))
    .groupBy(operationsTable.category).orderBy(desc(amount), asc(operationsTable.category)).all()

  return rows.map(row => ({ name: row.name, amount: Number(row.amount || 0) }))
}
