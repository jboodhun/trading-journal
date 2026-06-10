import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { DatabaseSync } from 'node:sqlite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '../..')
const defaultDatabasePath = path.resolve(root, 'server/data/trading-journal.sqlite')

let database: DatabaseSync | null = null

export function getDatabasePath() {
  const configuredPath = process.env.DATABASE_URL

  if (!configuredPath) {
    return defaultDatabasePath
  }

  if (configuredPath.startsWith('file:')) {
    return configuredPath.replace(/^file:/, '')
  }

  return configuredPath
}

export function getDatabase() {
  if (database) {
    return database
  }

  const databasePath = getDatabasePath()
  fs.mkdirSync(path.dirname(databasePath), { recursive: true })
  database = new DatabaseSync(databasePath)

  return database
}

export function initializeDatabase() {
  const schemaPath = path.resolve(__dirname, 'schema.sql')
  const schema = fs.readFileSync(schemaPath, 'utf8')

  getDatabase().exec(schema)
}
