import { useState } from 'react'
import { Modal } from 'components/ui'
import { apiErrorMessage, useUpdateJournalMutation } from 'services'
import type { Journal } from 'types'
import { JournalFormFields } from './JournalFormFields'

interface EditJournalDialogProps {
  journal: Journal
  onClose: () => void
}

export function EditJournalDialog({ journal, onClose }: EditJournalDialogProps) {
  const [name, setName] = useState(journal.name)
  const [description, setDescription] = useState(journal.description ?? '')
  const [startingBalance, setStartingBalance] = useState(String(journal.startingBalance))
  const [error, setError] = useState<string | null>(null)
  const [updateJournal, { isLoading }] = useUpdateJournalMutation()

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!name.trim()) {
      setError('Journal name is required')
      return
    }
    const balance = Number(startingBalance)
    if (startingBalance.trim() === '' || !Number.isFinite(balance) || balance < 0) {
      setError('Starting balance must be zero or more')
      return
    }
    try {
      await updateJournal({
        id: journal.id,
        input: {
          name: name.trim(),
          description: description.trim() || null,
          startingBalance: balance,
          archived: journal.archived,
        },
      }).unwrap()
      onClose()
    } catch (err) {
      setError(apiErrorMessage(err))
    }
  }

  return (
    <Modal.Root open onOpenChange={(open) => !open && onClose()}>
      <Modal.Content title={`Edit ${journal.name}`}>
        <form onSubmit={submit}>
          {error && <div className="form-error">{error}</div>}
          <div className="form-stack">
            <JournalFormFields
              name={name}
              description={description}
              startingBalance={startingBalance}
              onName={setName}
              onDescription={setDescription}
              onStartingBalance={setStartingBalance}
            />
          </div>
          <div className="modal-actions">
            <Modal.Close className="btn btn-ghost">Cancel</Modal.Close>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </Modal.Content>
    </Modal.Root>
  )
}
