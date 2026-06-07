import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

import express from 'express'
import { createServer as createViteServer } from 'vite'

import { createApp } from './app'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const isApiOnly = process.env.API_ONLY === 'true'
const port = Number(process.env.PORT ?? (isApiOnly ? 43117 : 5173))
const isProduction = process.env.NODE_ENV === 'production'

async function startServer() {
  const app = createApp()

  if (isApiOnly) {
    app.use((_request, response) => {
      response.status(404).json({ error: 'API route not found' })
    })
  } else if (isProduction) {
    const distPath = path.resolve(root, 'dist')

    app.use(express.static(distPath))
    app.use((request, response, next) => {
      if (request.method !== 'GET') {
        next()
        return
      }

      response.sendFile(path.resolve(distPath, 'index.html'))
    })
  } else {
    const vite = await createViteServer({
      appType: 'spa',
      root,
      server: {
        middlewareMode: true,
      },
    })

    app.use(vite.middlewares)
    app.use(async (request, response, next) => {
      if (request.method !== 'GET') {
        next()
        return
      }

      try {
        const templatePath = path.resolve(root, 'index.html')
        const template = fs.readFileSync(templatePath, 'utf8')
        const html = await vite.transformIndexHtml(request.originalUrl, template)

        response.status(200).set({ 'Content-Type': 'text/html' }).end(html)
      } catch (error) {
        vite.ssrFixStacktrace(error as Error)
        next(error)
      }
    })
  }

  app.listen(port, () => {
    process.stdout.write(`Trading Journal ${isApiOnly ? 'API' : 'server'} listening at http://localhost:${port}\n`)
  })
}

await startServer()
