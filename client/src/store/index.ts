import { configureStore } from '@reduxjs/toolkit'
import { api } from 'services'
import { filtersSlice } from './filtersSlice'
import { themeSlice, type Theme } from './themeSlice'

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    filters: filtersSlice.reducer,
    theme: themeSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
})

let appliedTheme: Theme | null = null
function applyTheme(theme: Theme) {
  if (theme === appliedTheme) return
  appliedTheme = theme
  document.documentElement.dataset.theme = theme
  localStorage.setItem('theme', theme)
}

applyTheme(store.getState().theme)
store.subscribe(() => applyTheme(store.getState().theme))

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export { setQuery, setDirection, setSetup, setJournalFilter, clearFilters } from './filtersSlice'
export type { FiltersState } from './filtersSlice'
export { toggleTheme } from './themeSlice'
export type { Theme } from './themeSlice'
