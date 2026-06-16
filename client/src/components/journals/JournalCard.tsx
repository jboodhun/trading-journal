import { Link, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { Archive, ArchiveRestore, Pencil, Trash2 } from 'lucide-react'
import { formatDate, formatMoney, formatPnl, pnlClass } from 'lib'
import type { Journal } from 'types'

interface JournalCardProps {
  journal: Journal
  onEdit: (journal: Journal) => void
  onToggleArchive: (journal: Journal) => void
  onDelete: (journal: Journal) => void
}

export function JournalCard({ journal, onEdit, onToggleArchive, onDelete }: JournalCardProps) {
  const navigate = useNavigate()
  return (
    <div
      className={clsx('card journal-card', journal.archived && 'archived')}
      onClick={() => navigate(`/journals/${journal.id}`)}
    >
      <div className="journal-head">
        <Link to={`/journals/${journal.id}`} className="journal-name">
          {journal.name}
        </Link>
        {journal.archived && <span className="badge muted">Archived</span>}
      </div>
      <p className="journal-desc">{journal.description ?? 'No description'}</p>
      <div className="journal-balances">
        <div className="journal-balance">
          <span className="journal-balance-label">Starting balance</span>
          <span className="journal-balance-value">{formatMoney(journal.startingBalance)}</span>
        </div>
        <div className="journal-balance">
          <span className="journal-balance-label">Current balance</span>
          <span className={`journal-balance-value ${pnlClass(journal.netPnl)}`}>
            {formatMoney(journal.currentBalance)}
          </span>
        </div>
      </div>
      <div className="journal-meta">
        <span>
          <strong className={pnlClass(journal.netPnl)}>{formatPnl(journal.netPnl)}</strong> net P&L
        </span>
        <span>
          <strong>{journal.tradeCount}</strong> {journal.tradeCount === 1 ? 'trade' : 'trades'}
        </span>
      </div>
      <div className="journal-actions">
        <span className="journal-date">Created {formatDate(journal.createdAt)}</span>
        <span onClick={(event) => event.stopPropagation()}>
          <button className="btn-icon" aria-label="Edit journal" onClick={() => onEdit(journal)}>
            <Pencil size={15} />
          </button>
          <button
            className="btn-icon"
            aria-label={journal.archived ? 'Unarchive journal' : 'Archive journal'}
            onClick={() => onToggleArchive(journal)}
          >
            {journal.archived ? <ArchiveRestore size={15} /> : <Archive size={15} />}
          </button>
          <button className="btn-icon danger" aria-label="Delete journal" onClick={() => onDelete(journal)}>
            <Trash2 size={15} />
          </button>
        </span>
      </div>
    </div>
  )
}
