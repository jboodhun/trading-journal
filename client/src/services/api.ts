import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Journal, JournalInput } from 'types'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Journals'],
  endpoints: (build) => ({
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
      invalidatesTags: ['Journals'],
    }),
  }),
})

export const {
  useGetJournalsQuery,
  useAddJournalMutation,
  useUpdateJournalMutation,
  useDeleteJournalMutation,
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
