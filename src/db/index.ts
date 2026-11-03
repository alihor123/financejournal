import { drizzle } from 'drizzle-orm/expo-sqlite'
import { migrate } from 'drizzle-orm/expo-sqlite/migrator'
import { openDatabaseAsync } from 'expo-sqlite'
import migrations from './migrations/migrations'
import * as schema from './schema'

//Открытие базы и применение новых миграций
export async function openDatabase() {
  const sqlite = await openDatabaseAsync('financejournal.db')
  const db = drizzle(sqlite, { schema })

  await migrate(db, migrations)

  return db
}
