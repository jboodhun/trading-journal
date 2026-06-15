import { Inbox } from 'lucide-react'

interface EmptyStateProps {
  title: string
  hint: string
  children?: React.ReactNode
}

export function EmptyState({ title, hint, children }: EmptyStateProps) {
  return (
    <div className="empty">
      <Inbox size={32} className="empty-icon" />
      <div className="empty-title">{title}</div>
      <div>{hint}</div>
      {children}
    </div>
  )
}
