import { Card } from 'components/ui'

export function CalendarPage() {
  return (
    <div className="page-stack">
      <header className="section-header">
        <div>
          <h1>Calendar</h1>
          <p>Static trading calendar view.</p>
        </div>
      </header>

      <Card.Root className="empty-state-card">
        <Card.Header>
          <h2>Trade Calendar</h2>
          <p>Calendar entries will appear here once journaling data is connected.</p>
        </Card.Header>
      </Card.Root>
    </div>
  )
}
