import type { TradingJournal } from 'data/journal'

const journalsStorageKey = 'trading-journal:journals'

export function getStoredJournals(): TradingJournal[] {
  if (typeof window === 'undefined') {
    return []
  }

  const value = window.localStorage.getItem(journalsStorageKey)

  if (!value) {
    return []
  }

  try {
    return JSON.parse(value) as TradingJournal[]
  } catch {
    return []
  }
}

export function storeJournals(journals: TradingJournal[]) {
  window.localStorage.setItem(journalsStorageKey, JSON.stringify(journals))
}
