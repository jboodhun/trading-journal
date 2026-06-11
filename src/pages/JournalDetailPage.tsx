import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import type { TradingJournal } from 'data/journal'
import * as journalApi from 'services/journalApi'
import { Breadcrumb } from 'components/common'
import { EmptySection } from 'components/empty-section'
import { BookIcon, PlusIcon } from 'components/icons'
import { Button, Card } from 'components/ui'

const tradeColumns = ['Date', 'Symbol', 'Side', 'Entry', 'Exit', 'Size', 'P&L', 'Notes', 'Actions']

function AddTradePlaceholderModal({ onClose }: { onClose: () => void }) {
  return (
    <div aria-modal="true" className="modal-backdrop" role="dialog">
      <Card.Root className="modal-card">
        <Card.Header>
          <h2>Add Trade</h2>
          <p>Trade creation will be implemented in the trade management ticket.</p>
        </Card.Header>
        <Card.Content>
          <div className="modal-actions">
            <Button onClick={onClose}>Close</Button>
          </div>
        </Card.Content>
      </Card.Root>
    </div>
  )
}

function JournalNotFound() {
  return (
    <EmptySection.Root>
      <EmptySection.Icon>
        <BookIcon />
      </EmptySection.Icon>
      <EmptySection.Header>
        <EmptySection.Title>Journal not found</EmptySection.Title>
        <EmptySection.Description>
          This journal may have been deleted or the URL may be incorrect. Return to Journals to choose another
          workspace.
        </EmptySection.Description>
      </EmptySection.Header>
      <EmptySection.Actions>
        <Button onClick={() => window.history.back()} variant="secondary">
          Go Back
        </Button>
      </EmptySection.Actions>
    </EmptySection.Root>
  )
}

function EmptyTrades({ onAddTrade }: { onAddTrade: () => void }) {
  return (
    <EmptySection.Root>
      <EmptySection.Icon>
        <BookIcon />
      </EmptySection.Icon>
      <EmptySection.Header>
        <EmptySection.Title>No trades recorded yet</EmptySection.Title>
        <EmptySection.Description>
          Add the first trade for this journal to begin building the trade history that powers reviews, analytics, and
          future dashboard insights.
        </EmptySection.Description>
      </EmptySection.Header>
      <EmptySection.Actions>
        <Button onClick={onAddTrade}>
          <PlusIcon />
          Add Trade
        </Button>
      </EmptySection.Actions>
    </EmptySection.Root>
  )
}

function TradesTable() {
  return (
    <Card.Root className="table-card">
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              {tradeColumns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody />
        </table>
      </div>
    </Card.Root>
  )
}

export function JournalDetailPage() {
  const { journalId } = useParams()
  const [journal, setJournal] = useState<TradingJournal | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isAddTradeOpen, setIsAddTradeOpen] = useState(false)
  const trades: unknown[] = []

  useEffect(() => {
    async function loadJournal() {
      if (!journalId) {
        setError('Journal not found.')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError('')
        setJournal(await journalApi.getJournal(journalId))
      } catch (nextError) {
        setJournal(null)
        setError(nextError instanceof Error ? nextError.message : 'Unable to load journal.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadJournal()
  }, [journalId])

  if (isLoading) {
    return (
      <div className="page-stack">
        <Breadcrumb items={[{ label: 'Journals', href: '/journals' }, { label: 'Loading', active: true }]} />
        <Card.Root className="state-card">
          <Card.Content>
            <p>Loading journal...</p>
          </Card.Content>
        </Card.Root>
      </div>
    )
  }

  if (error || !journal) {
    return (
      <div className="page-stack">
        <Breadcrumb items={[{ label: 'Journals', href: '/journals' }, { label: 'Not found', active: true }]} />
        <JournalNotFound />
      </div>
    )
  }

  return (
    <div className="page-stack">
      <Breadcrumb items={[{ label: 'Journals', href: '/journals' }, { label: journal.name, active: true }]} />
      <header className="detail-action-header">
        <Button onClick={() => setIsAddTradeOpen(true)}>
          <PlusIcon />
          Add Trade
        </Button>
      </header>

      <section className="trades-section" aria-label="Journal trades">
        <TradesTable />
        {trades.length === 0 ? <EmptyTrades onAddTrade={() => setIsAddTradeOpen(true)} /> : null}
      </section>

      {isAddTradeOpen ? <AddTradePlaceholderModal onClose={() => setIsAddTradeOpen(false)} /> : null}
    </div>
  )
}
