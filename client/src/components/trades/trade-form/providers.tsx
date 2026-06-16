import { useState } from 'react'
import { apiErrorMessage, useAddTradeMutation, useUpdateTradeMutation } from 'services'
import type { Trade } from 'types'
import {
  TradeFormContext,
  emptyTradeFormState,
  formStateToInput,
  tradeToFormState,
  type TradeFormState,
} from './context'

interface CreateTradeProviderProps {
  journalId: number
  onDone: () => void
  children: React.ReactNode
}

/** Provides a blank form that POSTs a new trade into the given journal on submit. */
export function CreateTradeProvider({ journalId, onDone, children }: CreateTradeProviderProps) {
  const [state, setState] = useState(emptyTradeFormState)
  const [error, setError] = useState<string | null>(null)
  const [addTrade, { isLoading }] = useAddTradeMutation()

  const submit = async () => {
    const input = formStateToInput(state)
    if (typeof input === 'string') {
      setError(input)
      return
    }
    try {
      await addTrade({ ...input, journalId }).unwrap()
      onDone()
    } catch (err) {
      setError(apiErrorMessage(err))
    }
  }

  return (
    <TradeFormContext
      value={{
        state,
        actions: { update: setState, submit },
        meta: { saving: isLoading, error, submitLabel: 'Log trade' },
      }}
    >
      {children}
    </TradeFormContext>
  )
}

interface EditTradeProviderProps {
  trade: Trade
  onDone: () => void
  children: React.ReactNode
}

/** Provides a form pre-filled from an existing trade that PUTs on submit. */
export function EditTradeProvider({ trade, onDone, children }: EditTradeProviderProps) {
  const [state, setState] = useState<TradeFormState>(() => tradeToFormState(trade))
  const [error, setError] = useState<string | null>(null)
  const [updateTrade, { isLoading }] = useUpdateTradeMutation()

  const submit = async () => {
    const input = formStateToInput(state)
    if (typeof input === 'string') {
      setError(input)
      return
    }
    try {
      await updateTrade({ id: trade.id, input: { ...input, journalId: trade.journalId } }).unwrap()
      onDone()
    } catch (err) {
      setError(apiErrorMessage(err))
    }
  }

  return (
    <TradeFormContext
      value={{
        state,
        actions: { update: setState, submit },
        meta: { saving: isLoading, error, submitLabel: 'Save changes' },
      }}
    >
      {children}
    </TradeFormContext>
  )
}
