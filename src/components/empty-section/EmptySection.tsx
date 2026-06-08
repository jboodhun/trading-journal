/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from 'react'

type EmptySectionProps = {
  children: ReactNode
}

type EmptySectionActionProps = {
  children: ReactNode
}

function Root({ children }: EmptySectionProps) {
  return <section className="empty-section">{children}</section>
}

function Icon({ children }: EmptySectionProps) {
  return <div className="empty-section-icon">{children}</div>
}

function Header({ children }: EmptySectionProps) {
  return <div className="empty-section-header">{children}</div>
}

function Title({ children }: EmptySectionProps) {
  return <h2>{children}</h2>
}

function Description({ children }: EmptySectionProps) {
  return <p>{children}</p>
}

function Actions({ children }: EmptySectionActionProps) {
  return <div className="empty-section-actions">{children}</div>
}

function Suggestions({ children }: EmptySectionProps) {
  return <div className="empty-section-suggestions">{children}</div>
}

function Suggestion({ children }: EmptySectionProps) {
  return <div className="empty-section-suggestion">{children}</div>
}

export const EmptySection = {
  Root,
  Icon,
  Header,
  Title,
  Description,
  Actions,
  Suggestions,
  Suggestion,
}
