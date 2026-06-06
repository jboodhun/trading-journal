import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'

import type { ThemeMode } from 'app/App'
import { Button, Card } from 'components/ui'

type SettingsContextValue = {
  theme: ThemeMode
  onThemeChange: (theme: ThemeMode) => void
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

function useSettings() {
  const context = useContext(SettingsContext)

  if (!context) {
    throw new Error('Settings components must be rendered inside Settings.Provider')
  }

  return context
}

function Provider({ children, theme, onThemeChange }: SettingsContextValue & { children: ReactNode }) {
  return <SettingsContext value={{ theme, onThemeChange }}>{children}</SettingsContext>
}

function ThemePanel() {
  const { theme, onThemeChange } = useSettings()

  return (
    <Card.Root className="settings-panel">
      <Card.Header>
        <h2>Appearance</h2>
        <p>Choose the workspace theme for trading reviews.</p>
      </Card.Header>
      <Card.Content className="settings-actions">
        <Button variant={theme === 'light' ? 'primary' : 'secondary'} onClick={() => onThemeChange('light')}>
          Light
        </Button>
        <Button variant={theme === 'dark' ? 'primary' : 'secondary'} onClick={() => onThemeChange('dark')}>
          Dark
        </Button>
      </Card.Content>
    </Card.Root>
  )
}

function PreferencesPanel() {
  return (
    <Card.Root className="settings-panel">
      <Card.Header>
        <h2>Journal Defaults</h2>
        <p>Static placeholders for future account, broker, and risk settings.</p>
      </Card.Header>
      <Card.Content className="settings-list">
        <div>
          <span>Base currency</span>
          <strong>USD</strong>
        </div>
        <div>
          <span>Default risk per trade</span>
          <strong>1.0%</strong>
        </div>
        <div>
          <span>Review cadence</span>
          <strong>Weekly</strong>
        </div>
      </Card.Content>
    </Card.Root>
  )
}

export function SettingsPage({ theme, onThemeChange }: SettingsContextValue) {
  return (
    <Settings.Provider theme={theme} onThemeChange={onThemeChange}>
      <div className="page-stack">
        <header className="section-header">
          <div>
            <h1>Settings</h1>
            <p>Basic workspace preferences for the static client.</p>
          </div>
        </header>
        <div className="settings-grid">
          <Settings.ThemePanel />
          <Settings.PreferencesPanel />
        </div>
      </div>
    </Settings.Provider>
  )
}

const Settings = {
  Provider,
  ThemePanel,
  PreferencesPanel,
}
