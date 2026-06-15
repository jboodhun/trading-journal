import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import { EmptyState, PageHeader } from 'components'

export function DashboardPage() {
  return (
    <div className="page">
      <PageHeader title="Dashboard" subtitle="Your performance across all journals">
        <Link to="/journals" className="btn btn-primary">
          <BookOpen size={16} />
          Open journals
        </Link>
      </PageHeader>

      <div className="card">
        <EmptyState
          title="No data yet"
          hint="Performance stats and charts appear once trade logging lands. For now, set up your journals."
        >
          <Link to="/journals" className="btn btn-primary">
            Go to journals
          </Link>
        </EmptyState>
      </div>
    </div>
  )
}
