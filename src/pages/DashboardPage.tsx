import { useNavigate } from 'react-router-dom'

import { metrics } from 'data/journal'
import { getStoredJournals } from 'services/journalStorage'
import { EmptySection } from 'components/empty-section'
import { BookIcon, ClockIcon, WalletIcon } from 'components/icons'
import { Button, Card } from 'components/ui'

const metricIcons = {
  wallet: <WalletIcon />,
  growth: <ChartGlyph />,
  rate: <RingGlyph />,
  duration: <ClockIcon />,
}

function ChartGlyph() {
  return <span className="metric-glyph">↗</span>
}

function RingGlyph() {
  return <span className="win-ring" aria-hidden="true" />
}

function MetricCard({ icon, label, value, helper, tone = 'neutral' }: (typeof metrics)[number]) {
  return (
    <Card.Root className="metric-card">
      <div className="metric-copy">
        <p className="metric-label">{label}</p>
        <p className={`metric-value tone-${tone}`}>{value}</p>
        <p className={`metric-helper ${tone === 'profit' ? 'tone-profit' : ''}`}>{helper}</p>
      </div>
      <div className={`metric-icon metric-icon-${icon}`}>{metricIcons[icon]}</div>
    </Card.Root>
  )
}

export function DashboardPage() {
  const navigate = useNavigate()
  const hasJournals = getStoredJournals().length > 0

  return (
    <div className="page-stack">
      <header className="page-header">
        <div className="page-title-icon">
          <BookIcon />
        </div>
        <div>
          <h1>Dashboard</h1>
        </div>
      </header>

      {hasJournals ? (
        <section className="metrics-grid" aria-label="Trading performance metrics">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </section>
      ) : (
        <EmptySection.Root>
          <EmptySection.Icon>
            <BookIcon />
          </EmptySection.Icon>
          <EmptySection.Header>
            <EmptySection.Title>Create a journal to unlock your dashboard</EmptySection.Title>
            <EmptySection.Description>
              Dashboard analytics start from journal data. Create your first journal to establish a starting balance,
              organize trading activity, and prepare the workspace for trade tracking.
            </EmptySection.Description>
          </EmptySection.Header>
          <EmptySection.Actions>
            <Button className="empty-section-cta" onClick={() => navigate('/journals')}>
              Create Journal
            </Button>
          </EmptySection.Actions>
          <EmptySection.Suggestions>
            <EmptySection.Suggestion>
              <strong>Demo Journal</strong>
              <span>Track practice trades before risking live capital.</span>
            </EmptySection.Suggestion>
            <EmptySection.Suggestion>
              <strong>BackTesting Journal</strong>
              <span>Separate strategy testing from live execution.</span>
            </EmptySection.Suggestion>
            <EmptySection.Suggestion>
              <strong>Broker Journal</strong>
              <span>Keep each funded or broker account cleanly organized.</span>
            </EmptySection.Suggestion>
          </EmptySection.Suggestions>
        </EmptySection.Root>
      )}
    </div>
  )
}
