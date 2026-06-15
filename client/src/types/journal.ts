export interface Journal {
  id: number
  name: string
  description: string | null
  startingBalance: number
  currentBalance: number
  archived: boolean
  createdAt: string
  tradeCount: number
  netPnl: number
}

export interface JournalInput {
  name: string
  description: string | null
  startingBalance: number
  archived?: boolean
}
