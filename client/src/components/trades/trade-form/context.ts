import { createContext, use } from 'react'
import { isoToLocalInput, localInputToIso } from 'lib'
import type { Direction, Trade, TradeInput } from 'types'

export interface TradeFormState {
  symbol: string
  direction: Direction
  entryPrice: string
  exitPrice: string
  quantity: string
  fees: string
  entryTime: string
  exitTime: string
  setup: string
  notes: string
}

export interface TradeFormActions {
  update: (updater: (state: TradeFormState) => TradeFormState) => void
  submit: () => void
}

export interface TradeFormMeta {
  saving: boolean
  error: string | null
  submitLabel: string
}

export interface TradeFormContextValue {
  state: TradeFormState
  actions: TradeFormActions
  meta: TradeFormMeta
}

export const TradeFormContext = createContext<TradeFormContextValue | null>(null)

export function useTradeFormContext(): TradeFormContextValue {
  const value = use(TradeFormContext)
  if (!value) throw new Error('TradeForm parts must be rendered inside a TradeForm provider')
  return value
}

export function emptyTradeFormState(): TradeFormState {
  const now = isoToLocalInput(new Date().toISOString())
  return {
    symbol: '',
    direction: 'long',
    entryPrice: '',
    exitPrice: '',
    quantity: '',
    fees: '0',
    entryTime: now,
    exitTime: now,
    setup: '',
    notes: '',
  }
}

export function tradeToFormState(trade: Trade): TradeFormState {
  return {
    symbol: trade.symbol,
    direction: trade.direction,
    entryPrice: String(trade.entryPrice),
    exitPrice: String(trade.exitPrice),
    quantity: String(trade.quantity),
    fees: String(trade.fees),
    entryTime: isoToLocalInput(trade.entryTime),
    exitTime: isoToLocalInput(trade.exitTime),
    setup: trade.setup ?? '',
    notes: trade.notes ?? '',
  }
}

/** Live stats computed from the draft, for the summary preview. */
export interface DraftStats {
  gross: number
  fees: number
  net: number
  returnPct: number | null
  durationMin: number | null
}

export function draftStats(state: TradeFormState): DraftStats | null {
  const entry = Number(state.entryPrice)
  const exit = Number(state.exitPrice)
  const quantity = Number(state.quantity)
  const fees = Number(state.fees || 0)
  if (!(entry > 0) || !(exit > 0) || !(quantity > 0) || !Number.isFinite(fees)) return null

  const sign = state.direction === 'long' ? 1 : -1
  const gross = (exit - entry) * quantity * sign
  const cost = entry * quantity

  let durationMin: number | null = null
  if (state.entryTime && state.exitTime) {
    const ms = new Date(state.exitTime).getTime() - new Date(state.entryTime).getTime()
    if (Number.isFinite(ms) && ms >= 0) durationMin = Math.round(ms / 60_000)
  }

  return {
    gross,
    fees,
    net: gross - fees,
    returnPct: cost > 0 ? (gross - fees) / cost : null,
    durationMin,
  }
}

/** The form's payload; the provider supplies the journalId. */
export type TradeFormPayload = Omit<TradeInput, 'journalId'>

/** Validates the form and converts it to an API payload, or returns an error message. */
export function formStateToInput(state: TradeFormState): TradeFormPayload | string {
  if (!state.symbol.trim()) return 'Symbol is required'

  const entryPrice = Number(state.entryPrice)
  const exitPrice = Number(state.exitPrice)
  const quantity = Number(state.quantity)
  const fees = Number(state.fees || 0)
  if (!Number.isFinite(entryPrice) || entryPrice <= 0) return 'Entry price must be a positive number'
  if (!Number.isFinite(exitPrice) || exitPrice <= 0) return 'Exit price must be a positive number'
  if (!Number.isFinite(quantity) || quantity <= 0) return 'Quantity must be a positive number'
  if (!Number.isFinite(fees) || fees < 0) return 'Fees must be zero or more'

  if (!state.entryTime || !state.exitTime) return 'Entry and exit times are required'
  const entryTime = localInputToIso(state.entryTime)
  const exitTime = localInputToIso(state.exitTime)
  if (exitTime < entryTime) return 'Exit time cannot be before entry time'

  return {
    symbol: state.symbol.trim().toUpperCase(),
    direction: state.direction,
    entryPrice,
    exitPrice,
    quantity,
    fees,
    entryTime,
    exitTime,
    setup: state.setup.trim() || null,
    notes: state.notes.trim() || null,
  }
}
