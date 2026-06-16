import { Router } from 'express'
import { db } from './db.ts'

export const tradesRouter = Router()

interface TradeInput {
  journalId: number
  symbol: string
  direction: 'long' | 'short'
  entryPrice: number
  exitPrice: number
  quantity: number
  fees: number
  entryTime: string
  exitTime: string
  setup: string | null
  notes: string | null
}

interface TradeRow {
  id: number
  journal_id: number
  symbol: string
  direction: string
  entry_price: number
  exit_price: number
  quantity: number
  fees: number
  entry_time: string
  exit_time: string
  setup: string | null
  notes: string | null
  pnl: number
  created_at: string
}

const toApi = (row: TradeRow) => ({
  id: row.id,
  journalId: row.journal_id,
  symbol: row.symbol,
  direction: row.direction,
  entryPrice: row.entry_price,
  exitPrice: row.exit_price,
  quantity: row.quantity,
  fees: row.fees,
  entryTime: row.entry_time,
  exitTime: row.exit_time,
  setup: row.setup,
  notes: row.notes,
  pnl: row.pnl,
  createdAt: row.created_at,
})

export function computePnl(input: TradeInput): number {
  const sign = input.direction === 'long' ? 1 : -1
  const gross = (input.exitPrice - input.entryPrice) * input.quantity * sign
  return Math.round((gross - input.fees) * 100) / 100
}

function parseInput(body: unknown): TradeInput | string {
  if (typeof body !== 'object' || body === null) return 'Invalid request body'
  const b = body as Record<string, unknown>

  const journalId = Number(b.journalId)
  if (!Number.isInteger(journalId) || journalId <= 0) return 'A journal is required'

  const symbol = typeof b.symbol === 'string' ? b.symbol.trim().toUpperCase() : ''
  if (!symbol) return 'Symbol is required'
  if (b.direction !== 'long' && b.direction !== 'short') return 'Direction must be long or short'

  const numbers: Record<string, number> = {}
  for (const field of ['entryPrice', 'exitPrice', 'quantity', 'fees'] as const) {
    const value = field === 'fees' && b[field] === undefined ? 0 : Number(b[field])
    if (!Number.isFinite(value)) return `${field} must be a number`
    numbers[field] = value
  }
  if (numbers.entryPrice <= 0 || numbers.exitPrice <= 0) return 'Prices must be positive'
  if (numbers.quantity <= 0) return 'Quantity must be positive'
  if (numbers.fees < 0) return 'Fees cannot be negative'

  const entryTime = typeof b.entryTime === 'string' ? b.entryTime : ''
  const exitTime = typeof b.exitTime === 'string' ? b.exitTime : ''
  if (Number.isNaN(Date.parse(entryTime))) return 'entryTime must be a valid date'
  if (Number.isNaN(Date.parse(exitTime))) return 'exitTime must be a valid date'
  if (Date.parse(exitTime) < Date.parse(entryTime)) return 'Exit time cannot be before entry time'

  return {
    journalId,
    symbol,
    direction: b.direction,
    entryPrice: numbers.entryPrice,
    exitPrice: numbers.exitPrice,
    quantity: numbers.quantity,
    fees: numbers.fees,
    entryTime: new Date(entryTime).toISOString(),
    exitTime: new Date(exitTime).toISOString(),
    setup: typeof b.setup === 'string' && b.setup.trim() ? b.setup.trim() : null,
    notes: typeof b.notes === 'string' && b.notes.trim() ? b.notes.trim() : null,
  }
}

tradesRouter.get('/', (_req, res) => {
  const rows = db.prepare('SELECT * FROM trades ORDER BY exit_time DESC, id DESC').all() as unknown as TradeRow[]
  res.json(rows.map(toApi))
})

function journalStatus(journalId: number): 'missing' | 'archived' | 'ok' {
  const journal = db.prepare('SELECT archived FROM journals WHERE id = ?').get(journalId) as
    | { archived: number }
    | undefined
  if (!journal) return 'missing'
  return journal.archived === 1 ? 'archived' : 'ok'
}

tradesRouter.post('/', (req, res) => {
  const input = parseInput(req.body)
  if (typeof input === 'string') {
    res.status(400).json({ error: input })
    return
  }
  const status = journalStatus(input.journalId)
  if (status !== 'ok') {
    res.status(400).json({ error: status === 'missing' ? 'Journal not found' : 'Journal is archived — unarchive it to log trades' })
    return
  }
  const result = db
    .prepare(
      `INSERT INTO trades (journal_id, symbol, direction, entry_price, exit_price, quantity, fees, entry_time, exit_time, setup, notes, pnl)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      input.journalId,
      input.symbol,
      input.direction,
      input.entryPrice,
      input.exitPrice,
      input.quantity,
      input.fees,
      input.entryTime,
      input.exitTime,
      input.setup,
      input.notes,
      computePnl(input),
    )
  const row = db.prepare('SELECT * FROM trades WHERE id = ?').get(result.lastInsertRowid as number) as unknown as TradeRow
  res.status(201).json(toApi(row))
})

tradesRouter.put('/:id', (req, res) => {
  const id = Number(req.params.id)
  const existing = db.prepare('SELECT id FROM trades WHERE id = ?').get(id)
  if (!existing) {
    res.status(404).json({ error: 'Trade not found' })
    return
  }
  const input = parseInput(req.body)
  if (typeof input === 'string') {
    res.status(400).json({ error: input })
    return
  }
  if (journalStatus(input.journalId) === 'missing') {
    res.status(400).json({ error: 'Journal not found' })
    return
  }
  db.prepare(
    `UPDATE trades SET journal_id = ?, symbol = ?, direction = ?, entry_price = ?, exit_price = ?, quantity = ?, fees = ?,
       entry_time = ?, exit_time = ?, setup = ?, notes = ?, pnl = ?
     WHERE id = ?`,
  ).run(
    input.journalId,
    input.symbol,
    input.direction,
    input.entryPrice,
    input.exitPrice,
    input.quantity,
    input.fees,
    input.entryTime,
    input.exitTime,
    input.setup,
    input.notes,
    computePnl(input),
    id,
  )
  const row = db.prepare('SELECT * FROM trades WHERE id = ?').get(id) as unknown as TradeRow
  res.json(toApi(row))
})

tradesRouter.delete('/:id', (req, res) => {
  const result = db.prepare('DELETE FROM trades WHERE id = ?').run(Number(req.params.id))
  if (result.changes === 0) {
    res.status(404).json({ error: 'Trade not found' })
    return
  }
  res.status(204).end()
})
