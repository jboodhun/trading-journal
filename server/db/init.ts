import { initializeDatabase, getDatabasePath } from './database'

initializeDatabase()

process.stdout.write(`SQLite database ready at ${getDatabasePath()}\n`)
