import { useState } from 'react'
import type { FormEvent } from 'react'

import type { TradingJournal } from 'data/journal'
import { Button, Card } from 'components/ui'

type JournalFormValues = {
  name: string
  startingBalance: string
}

type FormErrors = Partial<Record<keyof JournalFormValues, string>>

type JournalFormModalProps = {
  journal?: TradingJournal
  onClose: () => void
  onCreate: (journal: TradingJournal) => void
  onUpdate?: (journal: TradingJournal) => void
}

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

export function JournalFormModal({ journal, onClose, onCreate, onUpdate }: JournalFormModalProps) {
  const isEditing = Boolean(journal)
  const [values, setValues] = useState<JournalFormValues>(getInitialFormValues(journal))
  const [errors, setErrors] = useState<FormErrors>({})

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors = validateJournalForm(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    const nextJournal: TradingJournal = {
      id: journal?.id ?? createJournalId(values.name),
      name: values.name.trim(),
      startingBalance: Number(values.startingBalance),
      status: journal?.status ?? 'active',
    }

    if (journal) {
      onUpdate?.(nextJournal)
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
