import express from 'express'
import type { Express } from 'express'

import { initializeDatabase } from './db/database'
import {
  createJournal,
  deleteJournal,
  getJournalById,
  JournalValidationError,
  listJournals,
  updateJournal,
} from './journals/journalService'

export function createApp(): Express {
  const app = express()

  initializeDatabase()
  app.use(express.json())

  app.get('/api/health', (_request, response) => {
    response.json({
      ok: true,
      service: 'trading-journal-api',
    })
  })

  app.get('/api/journals', (_request, response) => {
    response.json({ journals: listJournals() })
  })

  app.get('/api/journals/:id', (request, response) => {
    const journal = getJournalById(request.params.id)

    if (!journal) {
      response.status(404).json({ error: 'Journal not found.' })
      return
    }

    response.json({ journal })
  })

  app.post('/api/journals', (request, response) => {
    try {
      const journal = createJournal(request.body)

      response.status(201).json({ journal })
    } catch (error) {
      if (error instanceof JournalValidationError) {
        response.status(400).json({ error: error.message })
        return
      }

      throw error
    }
  })

  app.put('/api/journals/:id', (request, response) => {
    try {
      const journal = updateJournal(request.params.id, request.body)

      if (!journal) {
        response.status(404).json({ error: 'Journal not found.' })
        return
      }

      response.json({ journal })
    } catch (error) {
      if (error instanceof JournalValidationError) {
        response.status(400).json({ error: error.message })
        return
      }

      throw error
    }
  })

  app.delete('/api/journals/:id', (request, response) => {
    if (!deleteJournal(request.params.id)) {
      response.status(404).json({ error: 'Journal not found.' })
      return
    }

    response.status(204).send()
  })

  return app
}
