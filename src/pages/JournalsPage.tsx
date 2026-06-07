import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'

import { tradingJournals } from 'data/journal'
import type { TradingJournal } from 'data/journal'
import { ArchiveIcon, EditIcon, TrashIcon } from 'components/icons'
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
  const [journals, setJournals] = useState<TradingJournal[]>(tradingJournals)
  const [dialog, setDialog] = useState<JournalDialog>(null)
  const activeCount = useMemo(() => journals.filter((journal) => journal.status === 'active').length, [journals])

  function handleArchive(journalId: string) {
    setJournals((current) =>
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

      <section className="journal-summary">
        <Card.Root>
          <p className="summary-label">Total Journals</p>
          <strong>{journals.length}</strong>
        </Card.Root>
        <Card.Root>
          <p className="summary-label">Active</p>
          <strong>{activeCount}</strong>
        </Card.Root>
        <Card.Root>
          <p className="summary-label">Archived</p>
          <strong>{journals.length - activeCount}</strong>
        </Card.Root>
      </section>

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

      {dialog?.type === 'create' || dialog?.type === 'edit' ? (
        <JournalFormModal
          dialog={dialog}
          onClose={() => setDialog(null)}
          onCreate={(journal) => setJournals((current) => [journal, ...current])}
          onUpdate={(journal) =>
            setJournals((current) => current.map((currentJournal) => (currentJournal.id === journal.id ? journal : currentJournal)))
          }
        />
      ) : null}

      {dialog?.type === 'delete' ? (
        <DeleteJournalModal
          journal={dialog.journal}
          onClose={() => setDialog(null)}
          onConfirm={(journalId) => setJournals((current) => current.filter((journal) => journal.id !== journalId))}
        />
      ) : null}
    </div>
  )
}
