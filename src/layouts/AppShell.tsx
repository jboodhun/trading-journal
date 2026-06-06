/* eslint-disable react-refresh/only-export-components */
import { createContext, use } from 'react'
import type { ReactNode } from 'react'

import type { AppView, ThemeMode } from 'app/App'
import { CalendarIcon, ChartIcon, GridIcon, MoonIcon, SettingsIcon, SparkIcon, SunIcon } from 'components/icons'
import { Button } from 'components/ui'

type AppShellContextValue = {
  activeView: AppView
  onViewChange: (view: AppView) => void
  theme: ThemeMode
  onThemeChange: (theme: ThemeMode) => void
}

type AppShellProviderProps = AppShellContextValue & {
  children: ReactNode
}

type NavItem = {
  label: string
  view?: AppView
  icon: ReactNode
}

const AppShellContext = createContext<AppShellContextValue | null>(null)

const navItems: NavItem[] = [
  { label: 'Dashboard', view: 'dashboard', icon: <ChartIcon /> },
  { label: 'Journals', view: 'journals', icon: <GridIcon /> },
  { label: 'Calendar', icon: <CalendarIcon /> },
]

function useAppShell() {
  const context = use(AppShellContext)

  if (!context) {
    throw new Error('AppShell components must be rendered inside AppShell.Provider')
  }

  return context
}

function Provider({ children, activeView, onViewChange, theme, onThemeChange }: AppShellProviderProps) {
  return (
    <AppShellContext value={{ activeView, onViewChange, theme, onThemeChange }}>
      {children}
    </AppShellContext>
  )
}

function Frame({ children }: { children: ReactNode }) {
  return <div className="app-shell">{children}</div>
}

function Sidebar() {
  const { activeView, onViewChange, theme, onThemeChange } = useAppShell()

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <SparkIcon />
        </div>
        <div>
          <p className="brand-name">Trade Journal</p>
        </div>
      </div>

      <div className="sidebar-actions">
        <Button className="full-width" onClick={() => onViewChange('journals')}>
          + Add Trade
        </Button>
      </div>

      <nav className="nav-section" aria-label="Primary navigation">
        <p className="nav-heading">Navigation</p>
        {navItems.map((item) => (
          <button
            className={`nav-item ${item.view === activeView ? 'is-active' : ''}`}
            disabled={!item.view}
            key={item.label}
            onClick={() => {
              if (item.view) {
                onViewChange(item.view)
              }
            }}
            type="button"
          >
            {item.icon}
            <span>{item.label}</span>
            {item.view === activeView ? <span className="nav-chevron">›</span> : null}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button
          className="theme-toggle"
          onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
          type="button"
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <button className="theme-toggle" onClick={() => onViewChange('settings')} type="button">
          <SettingsIcon />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  )
}

function Main({ children }: { children: ReactNode }) {
  return <main className="main-content">{children}</main>
}

export const AppShell = {
  Provider,
  Frame,
  Sidebar,
  Main,
}
