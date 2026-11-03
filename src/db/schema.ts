import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

//Таблица операций финансового журнала
export const operationsTable = sqliteTable('operations', {
  id: text('id').primaryKey(),
  type: text('type', { enum: ['income', 'expense', 'adjustment'] }).notNull(),
  amount: integer('amount').notNull(),
  category: text('category').notNull(),
  date: integer('date', { mode: 'timestamp_ms' }).notNull(),
  description: text('description').notNull()
})
