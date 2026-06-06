import { metrics } from 'data/journal'
import { BookIcon, ClockIcon, WalletIcon } from 'components/icons'
import { Card } from 'components/ui'

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
  return (
    <div className="page-stack">
      <header className="page-header">
        <div className="page-title-icon">
          <BookIcon />
        </div>
        <div>
          <h1>Demo Journal - Q1 2025</h1>
          <p>Performance analytics and trade statistics</p>
        </div>
      </header>

      <section className="metrics-grid" aria-label="Trading performance metrics">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>
    </div>
  )
}
