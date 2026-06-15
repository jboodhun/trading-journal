import { EmptyState, PageHeader } from 'components'

export function TradesPage() {
  return (
    <div className="page">
      <PageHeader title="Trades" subtitle="Every trade across your journals" />

      <div className="card">
        <EmptyState title="No trades yet" hint="Trade logging is coming soon — this is where your trade log will live." />
      </div>
    </div>
  )
}
