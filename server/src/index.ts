import express from 'express'
import { tradesRouter } from './trades.ts'
import { journalsRouter } from './journals.ts'

const app = express()
const PORT = 3017

app.use(express.json())
app.use('/api/trades', tradesRouter)
app.use('/api/journals', journalsRouter)

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`)
})
