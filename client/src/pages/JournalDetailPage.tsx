import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Archive, ArchiveRestore, ArrowLeft, Pencil, Plus, Trash2 } from 'lucide-react'
import {
  DailyPnlChart,
  EditJournalDialog,
  EmptyState,
  EquityCurveChart,
  PageHeader,
  StatCard,
  TradesTable,
} from 'components'
import { useJournal, useJournalTrades, useTradeStats } from 'hooks'
import { formatMoney, formatPercent, formatPnl } from 'lib'
import { useDeleteJournalTradesMutation, useDeleteTradeMutation, useUpdateJournalMutation } from 'services'
import type { Trade } from 'types'

export function JournalDetailPage() {
  const { id } = useParams()
  const journalId = Number(id)
  const { journal, isLoading } = useJournal(journalId)
  const { trades } = useJournalTrades(journalId)
  const { summary, daily, equity } = useTradeStats(trades, journal?.startingBalance ?? 0)
  const [updateJournal] = useUpdateJournalMutation()
  const [deleteTrade] = useDeleteTradeMutation()
  const [deleteJournalTrades] = useDeleteJournalTradesMutation()
  const [editingJournal, setEditingJournal] = useState(false)
  const navigate = useNavigate()

  const editTrade = (trade: Trade) =>
    navigate(`/trades/${trade.id}/edit`, { state: { from: `/journals/${journalId}` } })

  if (isLoading) {
    return (
      <div className="page">
        <div className="loading">Loading journal…</div>
      </div>
    )
  }

  if (!journal) {
    return (
      <div className="page">
        <div className="card">
          <EmptyState title="Journal not found" hint="It may have been deleted.">
            <Link to="/journals" className="btn btn-ghost">
              <ArrowLeft size={15} />
              Back to journals
            </Link>
          </EmptyState>
        </div>
      </div>
    )
  }

  const toggleArchive = () => {
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

  const handleDeleteAllTrades = () => {
    const count = trades.length
    const warning = `Delete all ${count} trade${count === 1 ? '' : 's'} in "${journal.name}"? This cannot be undone.`
    if (window.confirm(warning)) {
      deleteJournalTrades(journal.id)
    }
  }

  const handleDeleteTrade = (trade: Trade) => {
    if (window.confirm(`Delete the ${trade.symbol} trade from ${trade.exitTime.slice(0, 10)}?`)) {
      deleteTrade(trade.id)
    }
  }

  return (
    <div className="page">
      <Link to="/journals" className="back-link">
        <ArrowLeft size={14} />
        All journals
      </Link>

      <PageHeader
        title={journal.archived ? `${journal.name} (archived)` : journal.name}
        subtitle={journal.description ?? 'No description'}
      >
        <span className="head-actions">
          <button className="btn btn-ghost" onClick={() => setEditingJournal(true)}>
            <Pencil size={15} />
            Edit
          </button>
          {trades.length > 0 && (
            <button className="btn btn-danger" onClick={handleDeleteAllTrades}>
              <Trash2 size={15} />
              Delete all trades
            </button>
          )}
          <button className="btn btn-ghost" onClick={toggleArchive}>
            {journal.archived ? <ArchiveRestore size={15} /> : <Archive size={15} />}
            {journal.archived ? 'Unarchive' : 'Archive'}
          </button>
          {!journal.archived && (
            <Link to={`/journals/${journal.id}/log`} className="btn btn-primary">
              <Plus size={16} />
              Log trade
            </Link>
          )}
        </span>
      </PageHeader>

      {trades.length === 0 ? (
        <div className="card">
          <EmptyState
            title="No trades in this journal yet"
            hint={journal.archived ? 'Unarchive the journal to start logging trades.' : 'Log your first trade to get started.'}
          />
        </div>
      ) : (
        <>
          <div className="stat-grid">
            <StatCard
              label="Balance"
              value={formatMoney(journal.currentBalance)}
              tone={summary.netPnl >= 0 ? 'pos' : 'neg'}
              sub={
                journal.startingBalance > 0
                  ? `Started ${formatMoney(journal.startingBalance)} · ${summary.netPnl >= 0 ? '+' : ''}${formatPercent(summary.netPnl / journal.startingBalance)}`
                  : `Started ${formatMoney(journal.startingBalance)}`
              }
            />
            <StatCard
              label="Net P&L"
              value={formatPnl(summary.netPnl)}
              tone={summary.netPnl >= 0 ? 'pos' : 'neg'}
              sub={`${summary.totalTrades} trades`}
            />
            <StatCard label="Win rate" value={formatPercent(summary.winRate)} sub={`${summary.wins}W · ${summary.losses}L`} />
            <StatCard
              label="Profit factor"
              value={summary.profitFactor === Infinity ? '∞' : summary.profitFactor.toFixed(2)}
              sub="Gross profit ÷ gross loss"
            />
            <StatCard label="Avg win" value={formatPnl(summary.avgWin)} tone="pos" sub={`Avg loss ${formatPnl(-summary.avgLoss)}`} />
          </div>

          <div className="chart-grid">
            <div className="card">
              <div className="card-title">Equity curve</div>
              <EquityCurveChart data={equity} />
            </div>
            <div className="card">
              <div className="card-title">Daily P&L</div>
              <DailyPnlChart data={daily} />
            </div>
          </div>

          <div>
            <div className="card-title">Trades</div>
            <TradesTable trades={trades} onEdit={editTrade} onDelete={handleDeleteTrade} />
          </div>
        </>
      )}

      {editingJournal && <EditJournalDialog journal={journal} onClose={() => setEditingJournal(false)} />}
    </div>
  )
}
