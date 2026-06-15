import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface FiltersState {
  query: string
  direction: 'all' | 'long' | 'short'
  setup: string
  journalId: number | 'all'
}

const initialState: FiltersState = {
  query: '',
  direction: 'all',
  setup: 'all',
  journalId: 'all',
}

export const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload
    },
    setDirection(state, action: PayloadAction<FiltersState['direction']>) {
      state.direction = action.payload
    },
    setSetup(state, action: PayloadAction<string>) {
      state.setup = action.payload
    },
    setJournalFilter(state, action: PayloadAction<FiltersState['journalId']>) {
      state.journalId = action.payload
    },
    clearFilters() {
      return initialState
    },
  },
})

export const { setQuery, setDirection, setSetup, setJournalFilter, clearFilters } = filtersSlice.actions
