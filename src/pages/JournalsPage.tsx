import { useState } from 'react'
import type { FormEvent } from 'react'

import type { TradingJournal } from 'data/journal'
import { getStoredJournals, storeJournals } from 'services/journalStorage'
import { EmptySection } from 'components/empty-section'
import { ArchiveIcon, BookIcon, EditIcon, TrashIcon } from 'components/icons'
import { Badge, Button, Card } from 'components/ui'

type JournalFormValues = {
  name: string
  startingBalance: string
}

type FormErrors = Partial<Record<keyof JournalFormValues, string>>

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

function getInitialFormValues(journal?: TradingJournal): JournalFormValues {
  return {
    name: journal?.name ?? '',
    startingBalance: journal ? String(journal.startingBalance) : '',
  }
}

function validateJournalForm(values: JournalFormValues) {
  const errors: FormErrors = {}
  const parsedBalance = Number(values.startingBalance)

  if (!values.name.trim()) {
    errors.name = 'Name is required.'
  }

  if (!values.startingBalance.trim()) {
    errors.startingBalance = 'Starting balance is required.'
  } else if (!Number.isFinite(parsedBalance) || parsedBalance < 0) {
    errors.startingBalance = 'Enter a valid decimal value.'
  }

  return errors
}

function createJournalId(name: string) {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  return `journal-${slug || 'untitled'}-${Date.now()}`
}

function JournalFormModal({
  dialog,
  onClose,
  onCreate,
  onUpdate,
}: {
  dialog: Exclude<JournalDialog, { type: 'delete' } | null>
  onClose: () => void
  onCreate: (journal: TradingJournal) => void
  onUpdate: (journal: TradingJournal) => void
}) {
  const isEditing = dialog.type === 'edit'
  const [values, setValues] = useState<JournalFormValues>(getInitialFormValues(isEditing ? dialog.journal : undefined))
  const [errors, setErrors] = useState<FormErrors>({})

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors = validateJournalForm(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    const nextJournal: TradingJournal = {
      id: isEditing ? dialog.journal.id : createJournalId(values.name),
      name: values.name.trim(),
      startingBalance: Number(values.startingBalance),
      status: isEditing ? dialog.journal.status : 'active',
    }

    if (isEditing) {
      onUpdate(nextJournal)
    } else {
      onCreate(nextJournal)
    }

    onClose()
  }

  return (
    <div aria-modal="true" className="modal-backdrop" role="dialog">
      <Card.Root className="modal-card">
        <Card.Header>
          <h2>{isEditing ? 'Edit Journal' : 'New Journal'}</h2>
          <p>{isEditing ? 'Update the journal details.' : 'Create a journal for trading activity.'}</p>
        </Card.Header>
        <Card.Content>
          <form className="journal-form" onSubmit={handleSubmit}>
            <label>
              <span>Name</span>
              <input
                aria-invalid={Boolean(errors.name)}
                onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))}
                placeholder="Demo Journal"
                value={values.name}
              />
              {errors.name ? <small>{errors.name}</small> : null}
            </label>

            <label>
              <span>Starting Balance</span>
              <input
                aria-invalid={Boolean(errors.startingBalance)}
                inputMode="decimal"
                onChange={(event) => setValues((current) => ({ ...current, startingBalance: event.target.value }))}
                placeholder="10000.00"
                value={values.startingBalance}
              />
              {errors.startingBalance ? <small>{errors.startingBalance}</small> : null}
            </label>

            <div className="modal-actions">
              <Button onClick={onClose} variant="secondary">
                Cancel
              </Button>
              <Button type="submit">{isEditing ? 'Save Journal' : 'Add Journal'}</Button>
            </div>
          </form>
        </Card.Content>
      </Card.Root>
    </div>
  )
}

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
          dialog={dialog}
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
