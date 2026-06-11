import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import type { TradingJournal } from 'data/journal'
import * as journalApi from 'services/journalApi'
import { Breadcrumb } from 'components/common'
import { EmptySection } from 'components/empty-section'
import { ArchiveIcon, BookIcon, EditIcon, PlusIcon, TrashIcon } from 'components/icons'
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
          <p>This removes the journal from your saved journals.</p>
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
  onOpen,
}: {
  journal: TradingJournal
  onArchive: (journalId: string) => void
  onDelete: (journal: TradingJournal) => void
  onEdit: (journal: TradingJournal) => void
  onOpen: (journalId: string) => void
}) {
  return (
    <Card.Root
      className="journal-card journal-card-clickable"
      onClick={() => onOpen(journal.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen(journal.id)
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="journal-card-header">
        <div>
          <h2>{journal.name}</h2>
          <p>Starting Balance</p>
        </div>
        <Badge tone={journal.status === 'active' ? 'green' : 'slate'}>{journal.status}</Badge>
      </div>

      <p className="journal-balance">{currencyFormatter.format(journal.startingBalance)}</p>

      <div className="journal-card-actions">
        <button
          aria-label={`Edit ${journal.name}`}
          onClick={(event) => {
            event.stopPropagation()
            onEdit(journal)
          }}
          type="button"
        >
          <EditIcon />
        </button>
        <button
          aria-label={`${journal.status === 'active' ? 'Archive' : 'Restore'} ${journal.name}`}
          onClick={(event) => {
            event.stopPropagation()
            onArchive(journal.id)
          }}
          type="button"
        >
          <ArchiveIcon />
        </button>
        <button
          aria-label={`Delete ${journal.name}`}
          onClick={(event) => {
            event.stopPropagation()
            onDelete(journal)
          }}
          type="button"
        >
          <TrashIcon />
        </button>
      </div>
    </Card.Root>
  )
}

export function JournalsPage() {
  const navigate = useNavigate()
  const [journals, setJournals] = useState<TradingJournal[]>([])
  const [dialog, setDialog] = useState<JournalDialog>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadJournals() {
    try {
      setIsLoading(true)
      setError('')
      setJournals(await journalApi.getJournals())
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Unable to load journals.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadJournals()
  }, [])

  async function handleCreateJournal(journal: journalApi.JournalPayload) {
    const nextJournal = await journalApi.createJournal(journal)

    setJournals((current) => [nextJournal, ...current])
  }

  async function handleUpdateJournal(journalId: string, journal: journalApi.JournalPayload) {
    const nextJournal = await journalApi.updateJournal(journalId, journal)

    setJournals((current) =>
      current.map((currentJournal) => (currentJournal.id === nextJournal.id ? nextJournal : currentJournal)),
    )
  }

  async function handleArchive(journalId: string) {
    const journal = journals.find((currentJournal) => currentJournal.id === journalId)

    if (!journal) {
      return
    }

    const status = journal.status === 'active' ? 'archived' : 'active'

    await handleUpdateJournal(journalId, { ...journal, status })
  }

  async function handleDeleteJournal(journalId: string) {
    await journalApi.deleteJournal(journalId)
    setJournals((current) => current.filter((journal) => journal.id !== journalId))
  }

  return (
    <div className="page-stack">
      <Breadcrumb items={[{ label: 'Journals', active: true }]} />
      <header className="section-header">
        <div>
          <h1>Journals</h1>
          <p>Create, edit, archive, and manage trading journals.</p>
        </div>
        <Button onClick={() => setDialog({ type: 'create' })}>
          <PlusIcon />
          Add Journal
        </Button>
      </header>

      {isLoading ? (
        <Card.Root className="state-card">
          <Card.Content>
            <p>Loading journals...</p>
          </Card.Content>
        </Card.Root>
      ) : error ? (
        <Card.Root className="state-card state-card-error">
          <Card.Content>
            <h2>Unable to load journals</h2>
            <p>{error}</p>
            <Button onClick={() => void loadJournals()} variant="secondary">
              Retry
            </Button>
          </Card.Content>
        </Card.Root>
      ) : journals.length === 0 ? (
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
              onOpen={(journalId) => navigate(`/journals/${journalId}`)}
            />
          ))}
        </section>
      )}

      {dialog?.type === 'create' || dialog?.type === 'edit' ? (
        <JournalFormModal
          journal={dialog.type === 'edit' ? dialog.journal : undefined}
          onClose={() => setDialog(null)}
          onCreate={handleCreateJournal}
          onUpdate={(journal) =>
            dialog.type === 'edit' ? handleUpdateJournal(dialog.journal.id, journal) : Promise.resolve()
          }
        />
      ) : null}

      {dialog?.type === 'delete' ? (
        <DeleteJournalModal
          journal={dialog.journal}
          onClose={() => setDialog(null)}
          onConfirm={(journalId) => void handleDeleteJournal(journalId)}
        />
      ) : null}
    </div>
  )
}
