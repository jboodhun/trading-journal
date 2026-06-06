import { useEffect, useState } from 'react'

import { AppShell } from 'layouts/AppShell'
import { DashboardPage } from 'pages/DashboardPage'
import { JournalsPage } from 'pages/JournalsPage'
import { SettingsPage } from 'pages/SettingsPage'

export type AppView = 'dashboard' | 'journals' | 'settings'
export type ThemeMode = 'light' | 'dark'

export function App() {
  const [activeView, setActiveView] = useState<AppView>('dashboard')
  const [theme, setTheme] = useState<ThemeMode>('light')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  return (
    <AppShell.Provider
      activeView={activeView}
      onViewChange={setActiveView}
      theme={theme}
      onThemeChange={setTheme}
    >
      <AppShell.Frame>
        <AppShell.Sidebar />
        <AppShell.Main>
          {activeView === 'dashboard' ? <DashboardPage /> : null}
          {activeView === 'journals' ? <JournalsPage /> : null}
          {activeView === 'settings' ? <SettingsPage onThemeChange={setTheme} theme={theme} /> : null}
        </AppShell.Main>
      </AppShell.Frame>
    </AppShell.Provider>
  )
}
