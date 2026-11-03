import { drizzle } from 'drizzle-orm/expo-sqlite'
import { openDatabaseAsync } from 'expo-sqlite'
import * as schema from './schema'

//Асинхронное открытие локальной базы и подключение ORM
export async function openDatabase() {
  const sqlite = await openDatabaseAsync('financejournal.db')
  return drizzle(sqlite, { schema })
}
