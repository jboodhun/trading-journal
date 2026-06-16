import clsx from 'clsx'

interface StatCardProps {
  label: string
  value: string
  sub?: string
  tone?: 'pos' | 'neg'
}

export function StatCard({ label, value, sub, tone }: StatCardProps) {
  return (
    <div className="card">
      <div className="stat-label">{label}</div>
      <div className={clsx('stat-value', tone === 'pos' && 'pnl-pos', tone === 'neg' && 'pnl-neg')}>{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  )
}
