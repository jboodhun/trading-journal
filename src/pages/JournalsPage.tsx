import { useState } from 'react'

import type { TradingJournal } from 'data/journal'
import { getStoredJournals, storeJournals } from 'services/journalStorage'
import { EmptySection } from 'components/empty-section'
import { ArchiveIcon, BookIcon, EditIcon, TrashIcon } from 'components/icons'
import { JournalFormModal } from 'components/journals'
import { Badge, Button, Card } from 'components/ui'

type JournalDialog =
  | { type: 'create' }
  | { type: 'edit'; journal: TradingJournal }
  | { type: 'delete'; journal: TradingJournal }
  | null

const currencyFormatter = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
  style: 'currency',
})

function DeleteJournalModal({
  journal,
  onClose,
  onConfirm,
}: {
  journal: TradingJournal
  onClose: () => void
  onConfirm: (journalId: string) => void
}) {
  return (
    <div aria-modal="true" className="modal-backdrop" role="dialog">
      <Card.Root className="modal-card">
        <Card.Header>
          <h2>Delete Journal</h2>
          <p>This removes the journal from the current client session.</p>
        </Card.Header>
        <Card.Content>
          <p className="confirm-copy">
            Delete <strong>{journal.name}</strong>?
          </p>
          <div className="modal-actions">
            <Button onClick={onClose} variant="secondary">
              Cancel
            </Button>
            <Button
              className="button-danger"
              onClick={() => {
                onConfirm(journal.id)
                onClose()
              }}
            >
              Delete
            </Button>
          </div>
        </Card.Content>
      </Card.Root>
    </div>
  )
}

function JournalOnboardingEmpty({ onCreate }: { onCreate: () => void }) {
  return (
    <EmptySection.Root>
      <EmptySection.Icon>
        <BookIcon />
      </EmptySection.Icon>
      <EmptySection.Header>
        <EmptySection.Title>Create your first trading journal</EmptySection.Title>
        <EmptySection.Description>
          Journals keep your trades, starting balance, and review workflow organized by account, market, strategy, or
          backtesting plan.
        </EmptySection.Description>
      </EmptySection.Header>
      <EmptySection.Actions>
        <Button className="empty-section-cta" onClick={onCreate}>
          Create Journal
        </Button>
      </EmptySection.Actions>
      <EmptySection.Suggestions>
        <EmptySection.Suggestion>
          <strong>Demo Journal</strong>
          <span>Track practice trades before risking live capital.</span>
        </EmptySection.Suggestion>
        <EmptySection.Suggestion>
          <strong>BackTesting Journal</strong>
          <span>Separate strategy testing from live execution.</span>
        </EmptySection.Suggestion>
        <EmptySection.Suggestion>
          <strong>Broker Journal</strong>
          <span>Keep each funded or broker account cleanly organized.</span>
        </EmptySection.Suggestion>
      </EmptySection.Suggestions>
    </EmptySection.Root>
  )
}

function JournalCard({
  journal,
  onArchive,
  onDelete,
  onEdit,
}: {
  journal: TradingJournal
  onArchive: (journalId: string) => void
  onDelete: (journal: TradingJournal) => void
  onEdit: (journal: TradingJournal) => void
}) {
  return (
    <Card.Root className="journal-card">
      <div className="journal-card-header">
        <div>
          <h2>{journal.name}</h2>
          <p>Starting Balance</p>
        </div>
        <Badge tone={journal.status === 'active' ? 'green' : 'slate'}>{journal.status}</Badge>
      </div>

      <p className="journal-balance">{currencyFormatter.format(journal.startingBalance)}</p>

      <div className="journal-card-actions">
        <button aria-label={`Edit ${journal.name}`} onClick={() => onEdit(journal)} type="button">
          <EditIcon />
        </button>
        <button
          aria-label={`${journal.status === 'active' ? 'Archive' : 'Restore'} ${journal.name}`}
          onClick={() => onArchive(journal.id)}
          type="button"
        >
          <ArchiveIcon />
        </button>
        <button aria-label={`Delete ${journal.name}`} onClick={() => onDelete(journal)} type="button">
          <TrashIcon />
        </button>
      </div>
    </Card.Root>
  )
}

export function JournalsPage() {
  const [journals, setJournals] = useState<TradingJournal[]>(getStoredJournals)
  const [dialog, setDialog] = useState<JournalDialog>(null)

  function updateJournals(updater: (current: TradingJournal[]) => TradingJournal[]) {
    setJournals((current) => {
      const nextJournals = updater(current)
      storeJournals(nextJournals)

      return nextJournals
    })
  }

  function handleArchive(journalId: string) {
    updateJournals((current) =>
      current.map((journal) =>
        journal.id === journalId
          ? { ...journal, status: journal.status === 'active' ? 'archived' : 'active' }
          : journal,
      ),
    )
  }

  return (
    <div className="page-stack">
      <header className="section-header">
        <div>
          <h1>Journals</h1>
          <p>Create, edit, archive, and manage trading journals.</p>
        </div>
        <Button onClick={() => setDialog({ type: 'create' })}>+ Add Journal</Button>
      </header>

      {journals.length === 0 ? (
        <JournalOnboardingEmpty onCreate={() => setDialog({ type: 'create' })} />
      ) : (
        <section className="journal-card-grid" aria-label="Trading journals">
          {journals.map((journal) => (
            <JournalCard
              journal={journal}
              key={journal.id}
              onArchive={handleArchive}
              onDelete={(nextJournal) => setDialog({ type: 'delete', journal: nextJournal })}
              onEdit={(nextJournal) => setDialog({ type: 'edit', journal: nextJournal })}
            />
          ))}
        </section>
      )}

      {dialog?.type === 'create' || dialog?.type === 'edit' ? (
        <JournalFormModal
          journal={dialog.type === 'edit' ? dialog.journal : undefined}
          onClose={() => setDialog(null)}
          onCreate={(journal) => updateJournals((current) => [journal, ...current])}
          onUpdate={(journal) =>
            updateJournals((current) =>
              current.map((currentJournal) => (currentJournal.id === journal.id ? journal : currentJournal)),
            )
          }
        />
      ) : null}

      {dialog?.type === 'delete' ? (
        <DeleteJournalModal
          journal={dialog.journal}
          onClose={() => setDialog(null)}
          onConfirm={(journalId) => updateJournals((current) => current.filter((journal) => journal.id !== journalId))}
        />
      ) : null}
    </div>
  )
}
