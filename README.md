# Trading Journal

A personal Trading Journal App built with React, Express, ShadCN, Tailwind CSS to track and analyse trading performance, metrics, and backtests.

## Why I Built This App

I built this trading journal to turn trading performance into something measurable, reviewable, and easy to improve and scale over time.

I tried a lot of trading tools (paid and free), but often got frustrated with limited features and limited ability to customize.

A lot of trading tools focus on execution or charts, but the real edge often comes from understanding behavior: which setups work, when discipline breaks down, how risk changes under pressure, and whether a strategy is actually profitable after enough trades.

This project is designed as a product-led engineering showcase, combining my day-to-day professional experience in:

- Product thinking
- User Experience (UX)
- Building scalable software 
- Front end and Backend architecture
- Simple API design and implementation
- Data modeling
- Continuous Delivery (CD)
- End-to-end product development

combined with my interest in trading systems.

The App starts with a clean onboarding flow and journal structure, then grows into trade capture, analytics, and more.

## Stack

React 19 · TypeScript · Vite · Redux Toolkit (RTK Query) · Tailwind CSS 4 · Base UI · Recharts · Express 5 · SQLite (`node:sqlite`)

Structured as an npm-workspaces monorepo (`client/` + `server/`).

## 🚀 Features

- Create, edit, archive, and delete trading journals (persisted in SQLite)
- Light / dark theme

Trade logging, analytics, and the P&L calendar are built incrementally as tickets — those pages currently show empty-state shells.

## 🧰 Requirements

- Node 22+ (the server uses the built-in `node:sqlite`, no native build step)

## ⚙️ Installation and Setup

1. Clone the repository
2. Navigate into the project folder
3. Run `npm install`
4. Run `npm run dev`

That one command starts everything:

- **API server** (Express 5 + SQLite) on `http://localhost:3017` — the database is created automatically at `server/data/journal.db`.
- **Client** (Vite + React 19) on `http://localhost:5188` — `/api` is proxied to the server.

## Other commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Start server + client together |
| `npm run typecheck` | Typecheck both workspaces |
| `npm run build` | Production build of the client |
| `npm run lint` | Lint the repo |





