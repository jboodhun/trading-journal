import { useMemo } from 'react'
import { dailyPnl, equityCurve, summarize } from 'lib'
import type { Trade } from 'types'

export function useTradeStats(trades: Trade[], startingBalance = 0) {
  return useMemo(
    () => ({
      summary: summarize(trades),
      daily: dailyPnl(trades),
      equity: equityCurve(trades, startingBalance),
    }),
    [trades, startingBalance],
  )
}
