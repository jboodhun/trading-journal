/* eslint-disable react-refresh/only-export-components */
import clsx from 'clsx'
import { useSetups } from 'hooks'
import { formatDuration, formatMoney, formatPercent, formatPnl, pnlClass } from 'lib'
import type { Direction } from 'types'
import { draftStats, useTradeFormContext, type TradeFormState } from './context'

type TextField = Exclude<keyof TradeFormState, 'direction'>

function Frame({ children }: { children: React.ReactNode }) {
  const { actions } = useTradeFormContext()
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        actions.submit()
      }}
    >
      {children}
    </form>
  )
}

function ErrorNote() {
  const { meta } = useTradeFormContext()
  if (!meta.error) return null
  return <div className="form-error wide">{meta.error}</div>
}

interface InputFieldProps {
  label: string
  field: TextField
  type?: string
  placeholder?: string
  list?: string
  autoFocus?: boolean
}

function InputField({ label, field, type = 'text', placeholder, list, autoFocus }: InputFieldProps) {
  const { state, actions } = useTradeFormContext()
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <input
        className="input"
        type={type}
        step={type === 'number' ? 'any' : undefined}
        placeholder={placeholder}
        list={list}
        autoFocus={autoFocus}
        value={state[field]}
        onChange={(event) => actions.update((s) => ({ ...s, [field]: event.target.value }))}
      />
    </label>
  )
}

function SymbolField() {
  return <InputField label="Symbol" field="symbol" placeholder="AAPL" autoFocus />
}

function DirectionField() {
  const { state, actions } = useTradeFormContext()
  const choose = (direction: Direction) => actions.update((s) => ({ ...s, direction }))
  return (
    <div className="field">
      <span className="field-label">Side</span>
      <div className="segment">
        <button type="button" className="segment-btn long" data-on={state.direction === 'long'} onClick={() => choose('long')}>
          Long
        </button>
        <button type="button" className="segment-btn short" data-on={state.direction === 'short'} onClick={() => choose('short')}>
          Short
        </button>
      </div>
    </div>
  )
}

function EntryPriceField() {
  return <InputField label="Entry price" field="entryPrice" type="number" placeholder="0.00" />
}

function ExitPriceField() {
  return <InputField label="Exit price" field="exitPrice" type="number" placeholder="0.00" />
}

function QuantityField() {
  return <InputField label="Quantity" field="quantity" type="number" placeholder="100" />
}

function FeesField() {
  return <InputField label="Fees" field="fees" type="number" placeholder="0.00" />
}

function EntryTimeField() {
  return <InputField label="Entry time" field="entryTime" type="datetime-local" />
}

function ExitTimeField() {
  return <InputField label="Exit time" field="exitTime" type="datetime-local" />
}

function SetupField() {
  const setups = useSetups()
  return (
    <>
      <InputField label="Setup" field="setup" placeholder="Breakout, Pullback…" list="setup-options" />
      <datalist id="setup-options">
        {setups.map((setup) => (
          <option key={setup} value={setup} />
        ))}
      </datalist>
    </>
  )
}

function NotesField() {
  const { state, actions } = useTradeFormContext()
  return (
    <label className="field wide">
      <span className="field-label">Notes</span>
      <textarea
        className="input"
        placeholder="What was the plan? What did you learn?"
        value={state.notes}
        onChange={(event) => actions.update((s) => ({ ...s, notes: event.target.value }))}
      />
    </label>
  )
}

function SubmitButton() {
  const { meta } = useTradeFormContext()
  return (
    <button type="submit" className="btn btn-primary" disabled={meta.saving}>
      {meta.saving ? 'Saving…' : meta.submitLabel}
    </button>
  )
}

/** Live preview of the trade being entered. Works anywhere inside the provider. */
function Summary() {
  const { state } = useTradeFormContext()
  const stats = draftStats(state)
  return (
    <aside className="card trade-summary">
      <div className="card-title">Trade summary</div>
      <div className="summary-head">
        <span className="summary-symbol">{state.symbol.trim().toUpperCase() || '—'}</span>
        <span className={clsx('badge', state.direction)}>{state.direction}</span>
      </div>
      {stats ? (
        <>
          <div className={clsx('summary-pnl', pnlClass(stats.net))}>{formatPnl(stats.net)}</div>
          <div className="summary-pnl-label">Net P&L</div>
          <div className="summary-rows">
            <div className="summary-row">
              <span>Gross P&L</span>
              <span className={pnlClass(stats.gross)}>{formatPnl(stats.gross)}</span>
            </div>
            <div className="summary-row">
              <span>Fees</span>
              <span>{formatMoney(stats.fees)}</span>
            </div>
            {stats.returnPct !== null && (
              <div className="summary-row">
                <span>Return</span>
                <span className={pnlClass(stats.returnPct)}>
                  {stats.returnPct >= 0 ? '+' : ''}
                  {formatPercent(stats.returnPct)}
                </span>
              </div>
            )}
            {stats.durationMin !== null && (
              <div className="summary-row">
                <span>Duration</span>
                <span>{formatDuration(stats.durationMin)}</span>
              </div>
            )}
          </div>
        </>
      ) : (
        <p className="summary-empty">Fill in the entry price, exit price and quantity to preview your P&L.</p>
      )}
    </aside>
  )
}

export const TradeForm = {
  Frame,
  ErrorNote,
  Symbol: SymbolField,
  Direction: DirectionField,
  EntryPrice: EntryPriceField,
  ExitPrice: ExitPriceField,
  Quantity: QuantityField,
  Fees: FeesField,
  EntryTime: EntryTimeField,
  ExitTime: ExitTimeField,
  Setup: SetupField,
  Notes: NotesField,
  Submit: SubmitButton,
  Summary,
}
