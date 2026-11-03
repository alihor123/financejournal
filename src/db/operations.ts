import type { Operation } from '@/components/OperationCard'
import type { FilterForm } from '@/components/Filters'
import { and, count, desc, eq, gte, lt, sum } from 'drizzle-orm'
import type { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite'
import type * as schema from './schema'
import { openDatabase } from './index'
import { operationsTable } from './schema'

type Database = ExpoSQLiteDatabase<typeof schema>

export const pageSize = 20

//Получение страницы с фильтрацией по категории и включённому периоду
function selectOperations(db: Database, filters: FilterForm, offset: number) {
  const conditions = []

  if (filters.category) conditions.push(eq(operationsTable.category, filters.category))
  if (filters.dateFrom) conditions.push(gte(operationsTable.date, filters.dateFrom))

  if (filters.dateTo) {
    const nextDay = new Date(filters.dateTo)
    nextDay.setDate(nextDay.getDate() + 1)
    conditions.push(lt(operationsTable.date, nextDay))
  }

  return db.select().from(operationsTable)
    .where(and(...conditions))
    .orderBy(desc(operationsTable.date), desc(operationsTable.id))
    .limit(pageSize).offset(offset).all()
}

//Итоги по всему журналу независимо от фильтров и загруженной страницы
function selectTotals(db: Database) {
  const income = Number(db.select({ amount: sum(operationsTable.amount) }).from(operationsTable)
    .where(eq(operationsTable.type, 'income')).get()?.amount || 0)
  const expense = Number(db.select({ amount: sum(operationsTable.amount) }).from(operationsTable)
    .where(eq(operationsTable.type, 'expense')).get()?.amount || 0)
  const adjustment = Number(db.select({ amount: sum(operationsTable.amount) }).from(operationsTable)
    .where(eq(operationsTable.type, 'adjustment')).get()?.amount || 0)
  const total = db.select({ count: count() }).from(operationsTable).get()

  return { income, expense, balance: income - expense + adjustment, count: total?.count || 0 }
}

//Загрузка первой страницы и общих итогов
export async function getJournal(filters: FilterForm) {
  const db = await openDatabase()
  return { operations: selectOperations(db, filters, 0), totals: selectTotals(db) }
}

//Загрузка очередной страницы журнала
export async function getOperations(filters: FilterForm, offset: number) {
  const db = await openDatabase()
  return selectOperations(db, filters, offset)
}

//Сохранение новой операции с расчётом дельты изменения баланса
export async function insertOperation(operation: Operation) {
  const db = await openDatabase()

  db.transaction(tx => {
    const data = { ...operation }

    if (data.type === 'adjustment') {
      data.amount -= selectTotals(tx).balance
      data.category = 'Изменение баланса'
    }

    tx.insert(operationsTable).values(data).run()
  })
}

//Обновление операции и пересчёт дельты относительно полного баланса
export async function updateOperation(operation: Operation) {
  const db = await openDatabase()

  db.transaction(tx => {
    const previousOperation = tx.select().from(operationsTable).where(eq(operationsTable.id, operation.id)).get()
    if (!previousOperation) throw new Error('Операция не найдена')

    const data = { ...operation }

    if (data.type === 'adjustment') {
      const previousAmount = previousOperation.type === 'expense' ? -previousOperation.amount : previousOperation.amount
      data.amount -= selectTotals(tx).balance - previousAmount
      data.category = 'Изменение баланса'
    }

    tx.update(operationsTable).set(data).where(eq(operationsTable.id, data.id)).run()
  })
}

//Удаление операции по ID
export async function removeOperation(id: string) {
  const db = await openDatabase()
  db.delete(operationsTable).where(eq(operationsTable.id, id)).run()
}
