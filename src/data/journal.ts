export type Trade = {
  id: string
  date: string
  symbol: string
  setup: string
  side: 'Long' | 'Short'
  result: 'Win' | 'Loss' | 'Break-even'
  pnl: number
  riskReward: number
  emotion: string
}

export type TradingJournal = {
  id: string
  name: string
  startingBalance: number
  status: 'active' | 'archived'
}

export type Metric = {
  label: string
  value: string
  helper: string
  icon: 'wallet' | 'growth' | 'rate' | 'duration'
  tone?: 'profit' | 'danger' | 'neutral'
}

export const metrics: Metric[] = [
  { label: 'Net P&L', value: '$3,379.02', helper: 'Started at $10,000.00', icon: 'wallet', tone: 'profit' },
  { label: 'Account Balance', value: '$13,379.02', helper: '+33.79% on capital', icon: 'growth', tone: 'neutral' },
  { label: 'Win Rate', value: '66.0%', helper: '66W · 13BE · 21L', icon: 'rate', tone: 'neutral' },
  { label: 'Avg Duration', value: '1h 29m', helper: '100 trades total', icon: 'duration', tone: 'neutral' },
]

export const tradingJournals: TradingJournal[] = [
  { id: 'journal-demo-q1', name: 'Demo Journal - Q1 2025', startingBalance: 10000, status: 'active' },
  { id: 'journal-backtesting', name: 'BackTesting Journal', startingBalance: 25000, status: 'active' },
  { id: 'journal-indices', name: 'Indices Journal', startingBalance: 15000, status: 'active' },
  { id: 'journal-forex', name: 'Forex Journal', startingBalance: 5000, status: 'archived' },
]

export const trades: Trade[] = [
  { id: 'TRD-1042', date: '2025-02-28', symbol: 'NQ', setup: 'Opening range breakout', side: 'Long', result: 'Win', pnl: 415.5, riskReward: 2.8, emotion: 'Focused' },
  { id: 'TRD-1041', date: '2025-02-27', symbol: 'ES', setup: 'VWAP reclaim', side: 'Long', result: 'Win', pnl: 282.25, riskReward: 2.1, emotion: 'Calm' },
  { id: 'TRD-1040', date: '2025-02-26', symbol: 'CL', setup: 'Failed continuation', side: 'Short', result: 'Loss', pnl: -120, riskReward: -1, emotion: 'Impatient' },
  { id: 'TRD-1039', date: '2025-02-25', symbol: 'GC', setup: 'Liquidity sweep', side: 'Long', result: 'Break-even', pnl: 0, riskReward: 0, emotion: 'Neutral' },
  { id: 'TRD-1038', date: '2025-02-24', symbol: 'NQ', setup: 'Trend pullback', side: 'Long', result: 'Win', pnl: 356, riskReward: 2.4, emotion: 'Confident' },
  { id: 'TRD-1037', date: '2025-02-21', symbol: 'ES', setup: 'Range rejection', side: 'Short', result: 'Win', pnl: 194.75, riskReward: 1.6, emotion: 'Patient' },
]
