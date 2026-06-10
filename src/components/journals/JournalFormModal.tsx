import { useState } from 'react'
import type { FormEvent } from 'react'

import type { TradingJournal } from 'data/journal'
import { Button, Card } from 'components/ui'

type JournalFormValues = {
  name: string
  startingBalance: string
}

type FormErrors = Partial<Record<keyof JournalFormValues, string>>
type JournalFormSubmission = {
  name: string
  startingBalance: number
  status: TradingJournal['status']
}

type JournalFormModalProps = {
  journal?: TradingJournal
  onClose: () => void
  onCreate: (journal: JournalFormSubmission) => Promise<void> | void
  onUpdate?: (journal: JournalFormSubmission) => Promise<void> | void
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

export function JournalFormModal({ journal, onClose, onCreate, onUpdate }: JournalFormModalProps) {
  const isEditing = Boolean(journal)
  const [values, setValues] = useState<JournalFormValues>(getInitialFormValues(journal))
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors = validateJournalForm(values)
    setErrors(nextErrors)
    setSubmitError('')

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    const nextJournal: JournalFormSubmission = {
      name: values.name.trim(),
      startingBalance: Number(values.startingBalance),
      status: journal?.status ?? 'active',
    }

    try {
      setIsSubmitting(true)

      if (journal) {
        await onUpdate?.(nextJournal)
      } else {
        await onCreate(nextJournal)
      }

      onClose()
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to save journal. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
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

            {submitError ? <p className="form-error">{submitError}</p> : null}

            <div className="modal-actions">
              <Button disabled={isSubmitting} onClick={onClose} variant="secondary">
                Cancel
              </Button>
              <Button disabled={isSubmitting} type="submit">
                {isSubmitting ? 'Saving...' : isEditing ? 'Save Journal' : 'Add Journal'}
              </Button>
            </div>
          </form>
        </Card.Content>
      </Card.Root>
    </div>
  )
}
