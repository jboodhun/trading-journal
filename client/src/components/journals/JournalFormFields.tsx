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
      <label className="field">
        <span className="field-label">Name</span>
        <input
          className="input"
          placeholder="Demo journal, Backtest — breakouts…"
          value={name}
          onChange={(event) => onName(event.target.value)}
          autoFocus
        />
      </label>
      <label className="field">
        <span className="field-label">Starting balance</span>
        <input
          className="input"
          type="number"
          step="any"
          min="0"
          placeholder="10000"
          value={startingBalance}
          onChange={(event) => onStartingBalance(event.target.value)}
        />
      </label>
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
