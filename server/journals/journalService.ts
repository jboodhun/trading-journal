import crypto from 'node:crypto'

import { getDatabase } from '../db/database'

export type JournalStatus = 'active' | 'archived'

export type Journal = {
  id: string
  name: string
  startingBalance: number
  status: JournalStatus
  createdAt: string
  updatedAt: string
}

type JournalRow = {
  id: string
  name: string
  starting_balance: number
  status: JournalStatus
  created_at: string
  updated_at: string
}

export type JournalInput = {
  name: string
  startingBalance: number
  status?: JournalStatus
}

type ValidatedJournalInput = {
  name: string
  startingBalance: number
  status: JournalStatus
}

export class JournalValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'JournalValidationError'
  }
}

function rowToJournal(row: JournalRow): Journal {
  return {
    id: row.id,
    name: row.name,
    startingBalance: row.starting_balance,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function isJournalStatus(value: unknown): value is JournalStatus {
  return value === 'active' || value === 'archived'
}

export function validateJournalInput(input: Partial<JournalInput>): ValidatedJournalInput {
  const name = typeof input.name === 'string' ? input.name.trim() : ''
  const startingBalance = Number(input.startingBalance)
  const status = input.status ?? 'active'

  if (!name) {
    throw new JournalValidationError('Journal name is required.')
  }

  if (!Number.isFinite(startingBalance) || startingBalance < 0) {
    throw new JournalValidationError('Starting balance must be a valid non-negative number.')
  }

  if (!isJournalStatus(status)) {
    throw new JournalValidationError('Journal status must be active or archived.')
  }

  return {
    name,
    startingBalance,
    status,
  }
}

export function listJournals() {
  const rows = getDatabase()
    .prepare(
      `
        SELECT id, name, starting_balance, status, created_at, updated_at
        FROM journals
        ORDER BY datetime(created_at) DESC
      `,
    )
    .all() as JournalRow[]

  return rows.map(rowToJournal)
}

export function createJournal(input: Partial<JournalInput>) {
  const journal = validateJournalInput(input)
  const id = crypto.randomUUID()
  const now = new Date().toISOString()

  getDatabase()
    .prepare(
      `
        INSERT INTO journals (id, name, starting_balance, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
    )
    .run(id, journal.name, journal.startingBalance, journal.status, now, now)

  return getJournalById(id)
}

export function getJournalById(id: string) {
  const row = getDatabase()
    .prepare(
      `
        SELECT id, name, starting_balance, status, created_at, updated_at
        FROM journals
        WHERE id = ?
      `,
    )
    .get(id) as JournalRow | undefined

  return row ? rowToJournal(row) : null
}

export function updateJournal(id: string, input: Partial<JournalInput>) {
  const journal = validateJournalInput(input)
  const now = new Date().toISOString()
  const result = getDatabase()
    .prepare(
      `
        UPDATE journals
        SET name = ?, starting_balance = ?, status = ?, updated_at = ?
        WHERE id = ?
      `,
    )
    .run(journal.name, journal.startingBalance, journal.status, now, id)

  if (result.changes === 0) {
    return null
  }

  return getJournalById(id)
}

export function deleteJournal(id: string) {
  const result = getDatabase().prepare('DELETE FROM journals WHERE id = ?').run(id)

  return result.changes > 0
}
