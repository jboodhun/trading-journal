import express from 'express'
import type { Express } from 'express'

const journals = [
  { id: 'journal-demo-q1', name: 'Demo Journal - Q1 2025', startingBalance: 10000, status: 'active' },
  { id: 'journal-backtesting', name: 'BackTesting Journal', startingBalance: 25000, status: 'active' },
  { id: 'journal-indices', name: 'Indices Journal', startingBalance: 15000, status: 'active' },
  { id: 'journal-forex', name: 'Forex Journal', startingBalance: 5000, status: 'archived' },
]

export function createApp(): Express {
  const app = express()

  app.use(express.json())

  app.get('/api/health', (_request, response) => {
    response.json({
      ok: true,
      service: 'trading-journal-api',
    })
  })

  app.get('/api/journals', (_request, response) => {
    response.json({ journals })
  })

  return app
}
