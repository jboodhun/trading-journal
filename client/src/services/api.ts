import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Journal, JournalInput, Trade, TradeInput } from 'types'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Trades', 'Journals'],
  endpoints: (build) => ({
    getTrades: build.query<Trade[], void>({
      query: () => 'trades',
      providesTags: ['Trades'],
    }),
    addTrade: build.mutation<Trade, TradeInput>({
      query: (body) => ({ url: 'trades', method: 'POST', body }),
      invalidatesTags: ['Trades', 'Journals'],
    }),
    updateTrade: build.mutation<Trade, { id: number; input: TradeInput }>({
      query: ({ id, input }) => ({ url: `trades/${id}`, method: 'PUT', body: input }),
      invalidatesTags: ['Trades', 'Journals'],
    }),
    deleteTrade: build.mutation<void, number>({
      query: (id) => ({ url: `trades/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Trades', 'Journals'],
    }),
    getJournals: build.query<Journal[], void>({
      query: () => 'journals',
      providesTags: ['Journals'],
    }),
    addJournal: build.mutation<Journal, JournalInput>({
      query: (body) => ({ url: 'journals', method: 'POST', body }),
      invalidatesTags: ['Journals'],
    }),
    updateJournal: build.mutation<Journal, { id: number; input: JournalInput }>({
      query: ({ id, input }) => ({ url: `journals/${id}`, method: 'PUT', body: input }),
      invalidatesTags: ['Journals'],
    }),
    deleteJournal: build.mutation<void, number>({
      query: (id) => ({ url: `journals/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Journals', 'Trades'],
    }),
    deleteJournalTrades: build.mutation<void, number>({
      query: (id) => ({ url: `journals/${id}/trades`, method: 'DELETE' }),
      invalidatesTags: ['Journals', 'Trades'],
    }),
  }),
})

export const {
  useGetTradesQuery,
  useAddTradeMutation,
  useUpdateTradeMutation,
  useDeleteTradeMutation,
  useGetJournalsQuery,
  useAddJournalMutation,
  useUpdateJournalMutation,
  useDeleteJournalMutation,
  useDeleteJournalTradesMutation,
} = api

export function apiErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'data' in error) {
    const data = (error as { data: unknown }).data
    if (typeof data === 'object' && data !== null && 'error' in data) {
      return String((data as { error: unknown }).error)
    }
  }
  return 'Something went wrong. Is the server running?'
}
