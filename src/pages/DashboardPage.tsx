import { useEffect, useState } from 'react'

import { metrics } from 'data/journal'
import type { TradingJournal } from 'data/journal'
import * as journalApi from 'services/journalApi'
import { Breadcrumb } from 'components/common'
import { EmptySection } from 'components/empty-section'
import { BookIcon, ClockIcon, WalletIcon } from 'components/icons'
import { JournalFormModal } from 'components/journals'
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
  const [journals, setJournals] = useState<TradingJournal[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const hasJournals = journals.length > 0

  async function loadJournals() {
    try {
      setIsLoading(true)
      setError('')
      setJournals(await journalApi.getJournals())
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Unable to load journals.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadJournals()
  }, [])

  async function handleCreateJournal(journal: journalApi.JournalPayload) {
    const nextJournal = await journalApi.createJournal(journal)

    setJournals((current) => [nextJournal, ...current])
  }

  return (
    <div className="page-stack">
      <Breadcrumb items={[{ label: 'Dashboard', active: true }]} />
      <header className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Track journal performance and trading activity.</p>
        </div>
      </header>

      {isLoading ? (
        <Card.Root className="state-card">
          <Card.Content>
            <p>Loading dashboard...</p>
          </Card.Content>
        </Card.Root>
      ) : error ? (
        <Card.Root className="state-card state-card-error">
          <Card.Content>
            <h2>Unable to load dashboard</h2>
            <p>{error}</p>
            <Button onClick={() => void loadJournals()} variant="secondary">
              Retry
            </Button>
          </Card.Content>
        </Card.Root>
      ) : hasJournals ? (
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
            <Button className="empty-section-cta" onClick={() => setIsCreateModalOpen(true)}>
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

      {isCreateModalOpen ? (
        <JournalFormModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateJournal}
        />
      ) : null}
    </div>
  )
}
