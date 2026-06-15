import { Router } from 'express'
import { db } from './db.ts'

export const journalsRouter = Router()

interface JournalRow {
  id: number
  name: string
  description: string | null
  starting_balance: number
  archived: number
  created_at: string
}

// Trade stats are zeroed until the trades feature lands — the API shape stays
// forward-compatible with the full journal model (tradeCount, netPnl, currentBalance).
const toApi = (row: JournalRow) => ({
  id: row.id,
  name: row.name,
  description: row.description,
  startingBalance: row.starting_balance,
  currentBalance: row.starting_balance,
  archived: row.archived === 1,
  createdAt: row.created_at,
  tradeCount: 0,
  netPnl: 0,
})

function getJournal(id: number): JournalRow | undefined {
  return db.prepare('SELECT * FROM journals WHERE id = ?').get(id) as unknown as
    | JournalRow
    | undefined
}

function parseInput(
  body: unknown,
): { name: string; description: string | null; startingBalance: number } | string {
  if (typeof body !== 'object' || body === null) return 'Invalid request body'
  const b = body as Record<string, unknown>
  const name = typeof b.name === 'string' ? b.name.trim() : ''
  if (!name) return 'Journal name is required'
  if (name.length > 80) return 'Journal name must be 80 characters or fewer'
  const startingBalance = Number(b.startingBalance)
  if (!Number.isFinite(startingBalance) || startingBalance < 0) {
    return 'Starting balance must be zero or more'
  }
  const description =
    typeof b.description === 'string' && b.description.trim() ? b.description.trim() : null
  return { name, description, startingBalance: Math.round(startingBalance * 100) / 100 }
}

journalsRouter.get('/', (_req, res) => {
  const rows = db
    .prepare('SELECT * FROM journals ORDER BY archived ASC, created_at ASC')
    .all() as unknown as JournalRow[]
  res.json(rows.map(toApi))
})

journalsRouter.post('/', (req, res) => {
  const input = parseInput(req.body)
  if (typeof input === 'string') {
    res.status(400).json({ error: input })
    return
  }
  const result = db
    .prepare('INSERT INTO journals (name, description, starting_balance) VALUES (?, ?, ?)')
    .run(input.name, input.description, input.startingBalance)
  res.status(201).json(toApi(getJournal(result.lastInsertRowid as number)!))
})

journalsRouter.put('/:id', (req, res) => {
  const id = Number(req.params.id)
  if (!getJournal(id)) {
    res.status(404).json({ error: 'Journal not found' })
    return
  }
  const input = parseInput(req.body)
  if (typeof input === 'string') {
    res.status(400).json({ error: input })
    return
  }
  const archived = (req.body as Record<string, unknown>).archived === true ? 1 : 0
  db.prepare(
    'UPDATE journals SET name = ?, description = ?, starting_balance = ?, archived = ? WHERE id = ?',
  ).run(input.name, input.description, input.startingBalance, archived, id)
  res.json(toApi(getJournal(id)!))
})

journalsRouter.delete('/:id', (req, res) => {
  const id = Number(req.params.id)
  if (!getJournal(id)) {
    res.status(404).json({ error: 'Journal not found' })
    return
  }
  db.prepare('DELETE FROM journals WHERE id = ?').run(id)
  res.status(204).end()
})
