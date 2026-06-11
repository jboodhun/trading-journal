import type { ReactNode } from 'react'

import type { ThemeMode } from 'app/App'
import { Breadcrumb } from 'components/common'
import { FolderIcon, SettingsIcon, ShieldCheckIcon, SunIcon, UsersIcon } from 'components/icons'

type SettingsPageProps = {
  theme: ThemeMode
  onThemeChange: (theme: ThemeMode) => void
}

type SettingsSection = {
  title: string
  description: string
  icon: ReactNode
  disabled?: boolean
  onClick?: () => void
}

export function SettingsPage({ theme, onThemeChange }: SettingsPageProps) {
  const settingsSections: SettingsSection[] = [
    {
      title: 'Appearance',
      description: `Workspace theme is currently set to ${theme}. Toggle between light and dark review modes.`,
      icon: <SunIcon />,
      onClick: () => onThemeChange(theme === 'dark' ? 'light' : 'dark'),
    },
    {
      title: 'Journal Defaults',
      description: 'Configure default currency, risk per trade, review cadence, and journal preferences.',
      icon: <FolderIcon />,
      disabled: true,
    },
    {
      title: 'Account Settings',
      description: 'Manage profile details, account preferences, and future authentication settings.',
      icon: <UsersIcon />,
      disabled: true,
    },
    {
      title: 'Data & Storage',
      description: 'Review SQLite storage, export options, and future backup preferences.',
      icon: <SettingsIcon />,
      disabled: true,
    },
    {
      title: 'Risk Policies',
      description: 'Define position sizing rules, max daily loss limits, and journaling guardrails.',
      icon: <ShieldCheckIcon />,
      disabled: true,
    },
  ]

  return (
    <div className="admin-page">
      <Breadcrumb items={[{ label: 'Administration', active: true }]} />
      <div className="admin-page-header">
        <div className="admin-heading">
          <h1>Administration</h1>
          <p>Manage workspace configuration and trading journal settings</p>
        </div>
      </div>

      <div className="admin-card-grid">
        {settingsSections.map((section) => (
          <button
            className={`admin-card ${section.disabled ? 'is-disabled' : ''}`}
            disabled={section.disabled}
            key={section.title}
            onClick={section.onClick}
            type="button"
          >
            <div className={`admin-card-icon ${section.disabled ? 'is-muted' : ''}`}>{section.icon}</div>
            <h2>{section.title}</h2>
            <p>{section.description}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
