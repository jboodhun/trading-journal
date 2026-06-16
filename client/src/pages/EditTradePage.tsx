import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { EditTradeProvider, EmptyState, PageHeader, TradeFormScreen } from 'components'
import { useJournal, useTrades } from 'hooks'
import { formatDate } from 'lib'

export function EditTradePage() {
  const { tradeId } = useParams()
  const { trades, isLoading } = useTrades()
  const trade = trades.find((t) => t.id === Number(tradeId))
  const { journal } = useJournal(trade?.journalId ?? 0)
  const navigate = useNavigate()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="page">
        <div className="loading">Loading trade…</div>
      </div>
    )
  }

  if (!trade) {
    return (
      <div className="page">
        <div className="card">
          <EmptyState title="Trade not found" hint="It may have been deleted.">
            <Link to="/trades" className="btn btn-ghost">
              <ArrowLeft size={15} />
              Back to trades
            </Link>
          </EmptyState>
        </div>
      </div>
    )
  }

  // Return to wherever the edit started (trades list or journal page).
  const backTo = (location.state as { from?: string } | null)?.from ?? `/journals/${trade.journalId}`

  return (
    <div className="page">
      <Link to={backTo} className="back-link">
        <ArrowLeft size={14} />
        Back
      </Link>
      <PageHeader
        title="Edit trade"
        subtitle={`${trade.symbol} on ${formatDate(trade.exitTime)}${journal ? ` · ${journal.name}` : ''}`}
      />
      <EditTradeProvider trade={trade} onDone={() => navigate(backTo)}>
        <TradeFormScreen cancelTo={backTo} />
      </EditTradeProvider>
    </div>
  )
}
