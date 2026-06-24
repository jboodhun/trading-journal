import { Input } from 'components/ui'

interface JournalFormFieldsProps {
  name: string
  description: string
  startingBalance: string
  onName: (value: string) => void
  onDescription: (value: string) => void
  onStartingBalance: (value: string) => void
}

export function JournalFormFields({
  name,
  description,
  startingBalance,
  onName,
  onDescription,
  onStartingBalance,
}: JournalFormFieldsProps) {
  return (
    <>
      <Input
        label="Name"
        placeholder="Demo journal, Backtest — breakouts…"
        value={name}
        onChange={onName}
        autoFocus
      />
      <Input
        label="Starting balance"
        type="number"
        step="any"
        min="0"
        placeholder="10000"
        value={startingBalance}
        onChange={onStartingBalance}
      />
      <label className="field">
        <span className="field-label">Description</span>
        <textarea
          className="input"
          placeholder="What is this journal for?"
          value={description}
          onChange={(event) => onDescription(event.target.value)}
        />
      </label>
    </>
  )
}
