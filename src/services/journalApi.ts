import type { TradingJournal } from 'data/journal'

export type JournalPayload = {
  name: string
  startingBalance: number
  status?: TradingJournal['status']
}

type JournalsResponse = {
  journals: TradingJournal[]
}

type JournalResponse = {
  journal: TradingJournal
}

async function parseApiResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    if (response.status === 204) {
      return undefined as T
    }

    return response.json() as Promise<T>
  }

  const body = (await response.json().catch(() => null)) as { error?: string } | null

  throw new Error(body?.error ?? 'Something went wrong. Please try again.')
}

export async function getJournals() {
  const response = await fetch('/api/journals')
  const body = await parseApiResponse<JournalsResponse>(response)

  return body.journals
}

export async function createJournal(payload: JournalPayload) {
  const response = await fetch('/api/journals', {
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })
  const body = await parseApiResponse<JournalResponse>(response)

  return body.journal
}

export async function updateJournal(journalId: string, payload: JournalPayload) {
  const response = await fetch(`/api/journals/${journalId}`, {
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'PUT',
  })
  const body = await parseApiResponse<JournalResponse>(response)

  return body.journal
}

export async function deleteJournal(journalId: string) {
  const response = await fetch(`/api/journals/${journalId}`, {
    method: 'DELETE',
  })

  await parseApiResponse<void>(response)
}
