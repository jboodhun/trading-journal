import { Pencil, Trash2 } from 'lucide-react'
import clsx from 'clsx'
import { formatDate, formatMoney, formatPnl, formatTime, pnlClass } from 'lib'
import type { Trade } from 'types'

interface TradesTableProps {
  trades: Trade[]
  onEdit?: (trade: Trade) => void
  onDelete?: (trade: Trade) => void
}

export function TradesTable({ trades, onEdit, onDelete }: TradesTableProps) {
  const hasActions = Boolean(onEdit || onDelete)
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Symbol</th>
            <th>Side</th>
            <th>Setup</th>
            <th className="num">Qty</th>
            <th className="num">Entry</th>
            <th className="num">Exit</th>
            <th className="num">P&amp;L</th>
            {hasActions && <th />}
          </tr>
        </thead>
        <tbody>
          {trades.map((trade) => (
            <tr key={trade.id} title={trade.notes ?? undefined}>
              <td className="dim">
                {formatDate(trade.exitTime)} · {formatTime(trade.entryTime)}–{formatTime(trade.exitTime)}
              </td>
              <td className="sym">{trade.symbol}</td>
              <td>
                <span className={clsx('badge', trade.direction)}>{trade.direction}</span>
              </td>
              <td className="dim">{trade.setup ?? '—'}</td>
              <td className="num">{trade.quantity}</td>
              <td className="num dim">{formatMoney(trade.entryPrice)}</td>
              <td className="num dim">{formatMoney(trade.exitPrice)}</td>
              <td className={clsx('num', 'sym', pnlClass(trade.pnl))}>{formatPnl(trade.pnl)}</td>
              {hasActions && (
                <td className="num">
                  {onEdit && (
                    <button className="btn-icon" aria-label="Edit trade" onClick={() => onEdit(trade)}>
                      <Pencil size={15} />
                    </button>
                  )}
                  {onDelete && (
                    <button className="btn-icon danger" aria-label="Delete trade" onClick={() => onDelete(trade)}>
                      <Trash2 size={15} />
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
