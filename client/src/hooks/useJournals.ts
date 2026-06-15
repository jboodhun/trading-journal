import { useGetJournalsQuery } from 'services'
import type { Journal } from 'types'

const noJournals: Journal[] = []

export function useJournals() {
  const { data, isLoading, isError } = useGetJournalsQuery()
  return { journals: data ?? noJournals, isLoading, isError }
}

export function useJournal(id: number) {
  const { journals, isLoading, isError } = useJournals()
  return { journal: journals.find((j) => j.id === id), isLoading, isError }
}
