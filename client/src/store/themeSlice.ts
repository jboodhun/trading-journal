import { createSlice } from '@reduxjs/toolkit'

export type Theme = 'dark' | 'light'

const initialState: Theme = localStorage.getItem('theme') === 'light' ? 'light' : 'dark'

export const themeSlice = createSlice({
  name: 'theme',
  initialState: initialState as Theme,
  reducers: {
    toggleTheme(state) {
      return state === 'dark' ? 'light' : 'dark'
    },
  },
})

export const { toggleTheme } = themeSlice.actions
