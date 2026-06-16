import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { CreateTradeProvider, EmptyState, PageHeader, TradeFormScreen } from 'components'
import { useJournal } from 'hooks'

export function LogTradePage() {
  const { id } = useParams()
  const journalId = Number(id)
  const { journal, isLoading } = useJournal(journalId)
  const navigate = useNavigate()
  const journalUrl = `/journals/${journalId}`

  if (isLoading) {
    return (
      <div className="page">
        <div className="loading">Loading journal…</div>
      </div>
    )
  }

  if (!journal || journal.archived) {
    return (
      <div className="page">
        <div className="card">
          <EmptyState
            title={journal ? 'This journal is archived' : 'Journal not found'}
            hint={journal ? 'Unarchive it to log new trades.' : 'It may have been deleted.'}
          >
            <Link to={journal ? journalUrl : '/journals'} className="btn btn-ghost">
              <ArrowLeft size={15} />
              {journal ? `Back to ${journal.name}` : 'Back to journals'}
            </Link>
          </EmptyState>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <Link to={journalUrl} className="back-link">
        <ArrowLeft size={14} />
        {journal.name}
      </Link>
      <PageHeader title="Log a trade" subtitle={`Recording into ${journal.name}`} />
      <CreateTradeProvider journalId={journalId} onDone={() => navigate(journalUrl)}>
        <TradeFormScreen cancelTo={journalUrl} />
      </CreateTradeProvider>
    </div>
  )
}
