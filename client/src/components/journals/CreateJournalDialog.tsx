import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Modal } from 'components/ui'
import { apiErrorMessage, useAddJournalMutation } from 'services'
import { JournalFormFields } from './JournalFormFields'

export function CreateJournalDialog() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [startingBalance, setStartingBalance] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [addJournal, { isLoading }] = useAddJournalMutation()

  const openDialog = () => {
    setName('')
    setDescription('')
    setStartingBalance('')
    setError(null)
    setOpen(true)
  }

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
      await addJournal({
        name: name.trim(),
        description: description.trim() || null,
        startingBalance: balance,
      }).unwrap()
      setOpen(false)
    } catch (err) {
      setError(apiErrorMessage(err))
    }
  }

  return (
    <>
      <button className="btn btn-primary" onClick={openDialog}>
        <Plus size={16} />
        New journal
      </button>
      <Modal.Root open={open} onOpenChange={setOpen}>
        <Modal.Content title="Create a journal">
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
                {isLoading ? 'Creating…' : 'Create journal'}
              </button>
            </div>
          </form>
        </Modal.Content>
      </Modal.Root>
    </>
  )
}
