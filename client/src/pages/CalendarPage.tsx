import { EmptyState, PageHeader } from 'components'

export function CalendarPage() {
  return (
    <div className="page">
      <PageHeader title="Calendar" subtitle="Daily P&L at a glance" />

      <div className="card">
        <EmptyState title="Nothing to show yet" hint="The monthly P&L calendar appears once you start logging trades." />
      </div>
    </div>
  )
}
