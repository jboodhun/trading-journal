import type { Trade } from 'types'
import { dayKey } from './format'

export interface Summary {
  netPnl: number
  totalTrades: number
  wins: number
  losses: number
  winRate: number
  profitFactor: number
  avgWin: number
  avgLoss: number
  largestWin: number
  largestLoss: number
  expectancy: number
}

export function summarize(trades: Trade[]): Summary {
  const wins = trades.filter((t) => t.pnl > 0)
  const losses = trades.filter((t) => t.pnl < 0)
  const grossProfit = wins.reduce((s, t) => s + t.pnl, 0)
  const grossLoss = Math.abs(losses.reduce((s, t) => s + t.pnl, 0))
  const netPnl = trades.reduce((s, t) => s + t.pnl, 0)

  return {
    netPnl,
    totalTrades: trades.length,
    wins: wins.length,
    losses: losses.length,
    winRate: trades.length ? wins.length / trades.length : 0,
    profitFactor: grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? Infinity : 0,
    avgWin: wins.length ? grossProfit / wins.length : 0,
    avgLoss: losses.length ? grossLoss / losses.length : 0,
    largestWin: wins.length ? Math.max(...wins.map((t) => t.pnl)) : 0,
    largestLoss: losses.length ? Math.min(...losses.map((t) => t.pnl)) : 0,
    expectancy: trades.length ? netPnl / trades.length : 0,
  }
}

export interface DayPnl {
  date: string
  pnl: number
  count: number
}

export function dailyPnl(trades: Trade[]): DayPnl[] {
  const byDay = new Map<string, DayPnl>()
  for (const trade of trades) {
    const date = dayKey(trade.exitTime)
    const entry = byDay.get(date) ?? { date, pnl: 0, count: 0 }
    entry.pnl += trade.pnl
    entry.count += 1
    byDay.set(date, entry)
  }
  return [...byDay.values()].sort((a, b) => a.date.localeCompare(b.date))
}

export interface EquityPoint {
  date: string
  equity: number
}

export function equityCurve(trades: Trade[], startingBalance = 0): EquityPoint[] {
  let equity = startingBalance
  return dailyPnl(trades).map((day) => {
    equity += day.pnl
    return { date: day.date, equity: Math.round(equity * 100) / 100 }
  })
}

export interface GroupPnl {
  name: string
  pnl: number
  count: number
  winRate: number
}

export function groupPnl(trades: Trade[], keyOf: (t: Trade) => string): GroupPnl[] {
  const groups = new Map<string, { pnl: number; count: number; wins: number }>()
  for (const trade of trades) {
    const key = keyOf(trade)
    const group = groups.get(key) ?? { pnl: 0, count: 0, wins: 0 }
    group.pnl += trade.pnl
    group.count += 1
    if (trade.pnl > 0) group.wins += 1
    groups.set(key, group)
  }
  return [...groups.entries()]
    .map(([name, g]) => ({ name, pnl: Math.round(g.pnl * 100) / 100, count: g.count, winRate: g.wins / g.count }))
    .sort((a, b) => b.pnl - a.pnl)
}

export const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as const

export function weekdayName(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { weekday: 'short' })
}
