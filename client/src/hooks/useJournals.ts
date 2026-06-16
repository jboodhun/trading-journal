import { useMemo } from 'react'
import { useGetJournalsQuery } from 'services'
import type { Journal } from 'types'
import { useTrades } from './useTrades'

const noJournals: Journal[] = []

export function useJournals() {
  const { data, isLoading, isError } = useGetJournalsQuery()
  return { journals: data ?? noJournals, isLoading, isError }
}

export function useJournal(id: number) {
  const { journals, isLoading, isError } = useJournals()
  return { journal: journals.find((j) => j.id === id), isLoading, isError }
}

/** Trades belonging to one journal, newest first (same order as the API). */
export function useJournalTrades(journalId: number) {
  const { trades, isLoading, isError } = useTrades()
  const journalTrades = useMemo(
    () => trades.filter((trade) => trade.journalId === journalId),
    [trades, journalId],
  )
  return { trades: journalTrades, isLoading, isError }
}
