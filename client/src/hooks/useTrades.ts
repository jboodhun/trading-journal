import { useMemo } from 'react'
import { useGetTradesQuery } from 'services'
import type { Trade } from 'types'
import { useAppSelector } from './store'

const noTrades: Trade[] = []

export function useTrades() {
  const { data, isLoading, isError } = useGetTradesQuery()
  return { trades: data ?? noTrades, isLoading, isError }
}

/** Trades narrowed by the global filter bar (Trades page). */
export function useFilteredTrades() {
  const { trades, isLoading, isError } = useTrades()
  const filters = useAppSelector((state) => state.filters)

  const filtered = useMemo(() => {
    const query = filters.query.trim().toUpperCase()
    return trades.filter((trade) => {
      if (query && !trade.symbol.includes(query)) return false
      if (filters.direction !== 'all' && trade.direction !== filters.direction) return false
      if (filters.setup !== 'all' && trade.setup !== filters.setup) return false
      if (filters.journalId !== 'all' && trade.journalId !== filters.journalId) return false
      return true
    })
  }, [trades, filters])

  return { trades: filtered, isLoading, isError }
}

/** Distinct setup tags present in the journal, for filter/autocomplete options. */
export function useSetups(): string[] {
  const { trades } = useTrades()
  return useMemo(
    () => [...new Set(trades.map((t) => t.setup).filter((s): s is string => s !== null))].sort(),
    [trades],
  )
}
