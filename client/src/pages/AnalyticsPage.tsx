import { EmptyState, PageHeader } from 'components'

export function AnalyticsPage() {
  return (
    <div className="page">
      <PageHeader title="Analytics" subtitle="Breakdowns by symbol, setup, side, and weekday" />

      <div className="card">
        <EmptyState title="No analytics yet" hint="Performance breakdowns appear once you have trades to analyse." />
      </div>
    </div>
  )
}
