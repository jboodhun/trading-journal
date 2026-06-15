import { useState } from 'react'
import { CreateJournalDialog, EditJournalDialog, EmptyState, JournalCard, PageHeader } from 'components'
import { useJournals } from 'hooks'
import { useDeleteJournalMutation, useUpdateJournalMutation } from 'services'
import type { Journal } from 'types'

export function JournalsPage() {
  const { journals, isLoading } = useJournals()
  const [updateJournal] = useUpdateJournalMutation()
  const [deleteJournal] = useDeleteJournalMutation()
  const [editing, setEditing] = useState<Journal | null>(null)

  const active = journals.filter((j) => !j.archived)
  const archived = journals.filter((j) => j.archived)

  const toggleArchive = (journal: Journal) => {
    updateJournal({
      id: journal.id,
      input: {
        name: journal.name,
        description: journal.description,
        startingBalance: journal.startingBalance,
        archived: !journal.archived,
      },
    })
  }

  const handleDelete = (journal: Journal) => {
    const warning =
      journal.tradeCount > 0
        ? `Delete "${journal.name}" and its ${journal.tradeCount} trades? This cannot be undone.`
        : `Delete "${journal.name}"?`
    if (window.confirm(warning)) {
      deleteJournal(journal.id)
    }
  }

  return (
    <div className="page">
      <PageHeader title="Journals" subtitle="Separate books for live trading, demo accounts, backtests…">
        <CreateJournalDialog />
      </PageHeader>

      {isLoading ? (
        <div className="loading">Loading journals…</div>
      ) : journals.length === 0 ? (
        <div className="card">
          <EmptyState title="No journals yet" hint="Create your first journal to start logging trades." />
        </div>
      ) : (
        <>
          <div className="journal-grid">
            {active.map((journal) => (
              <JournalCard
                key={journal.id}
                journal={journal}
                onEdit={setEditing}
                onToggleArchive={toggleArchive}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {archived.length > 0 && (
            <>
              <div className="section-title">Archived</div>
              <div className="journal-grid">
                {archived.map((journal) => (
                  <JournalCard
                    key={journal.id}
                    journal={journal}
                    onEdit={setEditing}
                    onToggleArchive={toggleArchive}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {editing && <EditJournalDialog journal={editing} onClose={() => setEditing(null)} />}
    </div>
  )
}
