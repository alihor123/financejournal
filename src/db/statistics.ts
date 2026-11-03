import { and, asc, eq, gt, gte, lt, or, sql, sum } from 'drizzle-orm'
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

const incomeCondition = or(
  eq(operationsTable.type, 'income'),
  and(eq(operationsTable.type, 'adjustment'), gt(operationsTable.amount, 0))
)

const expenseCondition = or(
  eq(operationsTable.type, 'expense'),
  and(eq(operationsTable.type, 'adjustment'), lt(operationsTable.amount, 0))
)

//Границы периода включают весь последний день
function getPeriodConditions(period: StatisticsPeriod) {
  const start = new Date(period.dateFrom)
  start.setHours(0, 0, 0, 0)
  const end = new Date(period.dateTo)
  end.setHours(0, 0, 0, 0)
  end.setDate(end.getDate() + 1)

  return and(
    gte(operationsTable.date, start),
    lt(operationsTable.date, end)
  )
}

//Доходы и расходы с учётом корректировок соответствующего знака
export async function getStatistics(period: StatisticsPeriod) {
  const db = await openDatabase()
  const income = Number(db.select({ amount: sum(operationsTable.amount) }).from(operationsTable)
    .where(and(getPeriodConditions(period), incomeCondition)).get()?.amount || 0)
  const expenses = db.select({ amount: sum(operationsTable.amount) }).from(operationsTable)
    .where(and(getPeriodConditions(period), expenseCondition)).groupBy(operationsTable.type).all()
  const expense = expenses.reduce((result, row) => result + Math.abs(Number(row.amount || 0)), 0)

  return { income, expense }
}

//Группировка по местному календарному дню с разделением корректировок
export async function getDailyStatistics(period: StatisticsPeriod) {
  const db = await openDatabase()
  const day = sql<string>`date(${operationsTable.date} / 1000, 'unixepoch', 'localtime')`
  const incomes = db.select({ date: day, amount: sum(operationsTable.amount) }).from(operationsTable)
    .where(and(getPeriodConditions(period), incomeCondition)).groupBy(day).orderBy(asc(day)).all()
  const expenses = db.select({ date: day, amount: sum(operationsTable.amount) }).from(operationsTable)
    .where(and(getPeriodConditions(period), expenseCondition))
    .groupBy(day, operationsTable.type).orderBy(asc(day)).all()
  const days: Record<string, DailyStatistics> = {}

  for (const row of incomes) {
    days[row.date] = { date: row.date, income: Number(row.amount || 0), expense: 0 }
  }

  for (const row of expenses) {
    if (!days[row.date]) days[row.date] = { date: row.date, income: 0, expense: 0 }
    days[row.date].expense += Math.abs(Number(row.amount || 0))
  }

  return Object.values(days).sort((a, b) => a.date.localeCompare(b.date))
}

//Расходы по категориям, включая уменьшение баланса
export async function getCategoryStatistics(period: StatisticsPeriod) {
  const db = await openDatabase()
  const rows = db.select({ name: operationsTable.category, amount: sum(operationsTable.amount) }).from(operationsTable)
    .where(and(getPeriodConditions(period), expenseCondition))
    .groupBy(operationsTable.category, operationsTable.type).all()
  const categories: Record<string, number> = {}

  for (const row of rows) {
    categories[row.name] = (categories[row.name] || 0) + Math.abs(Number(row.amount || 0))
  }

  return Object.entries(categories).map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount || a.name.localeCompare(b.name, 'ru'))
}
