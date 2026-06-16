import { formatPnl, pnlClass } from 'lib'

interface ChartTipProps {
  active?: boolean
  label?: string | number
  payload?: ReadonlyArray<{ value?: number | string; payload?: { name?: string } }>
  labelOf?: (raw: string) => string
}

/** Shared recharts tooltip showing a money value coloured by sign. */
export function ChartTip({ active, label, payload, labelOf }: ChartTipProps) {
  if (!active || !payload?.length) return null
  const value = Number(payload[0].value ?? 0)
  const raw = String(label ?? payload[0].payload?.name ?? '')
  return (
    <div className="chart-tip">
      <div className="chart-tip-label">{labelOf ? labelOf(raw) : raw}</div>
      <div className={`chart-tip-value ${pnlClass(value)}`}>{formatPnl(value)}</div>
    </div>
  )
}
