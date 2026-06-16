export type Direction = 'long' | 'short'

export interface Trade {
  id: number
  journalId: number
  symbol: string
  direction: Direction
  entryPrice: number
  exitPrice: number
  quantity: number
  fees: number
  entryTime: string
  exitTime: string
  setup: string | null
  notes: string | null
  pnl: number
  createdAt: string
}

export type TradeInput = Omit<Trade, 'id' | 'pnl' | 'createdAt'>
