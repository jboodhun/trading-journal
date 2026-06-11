import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'

import { AppShell } from 'layouts/AppShell'
import { CalendarPage } from 'pages/CalendarPage'
import { DashboardPage } from 'pages/DashboardPage'
import { JournalsPage } from 'pages/JournalsPage'
import { SettingsPage } from 'pages/SettingsPage'

export type AppView = 'dashboard' | 'journals' | 'calendar' | 'settings'
export type ThemeMode = 'light' | 'dark'

const viewPaths: Record<AppView, string> = {
  dashboard: '/dashboard',
  journals: '/journals',
  calendar: '/calendar',
  settings: '/settings',
}

function getActiveView(pathname: string): AppView {
  if (pathname.startsWith('/journals')) {
    return 'journals'
  }

  if (pathname.startsWith('/calendar')) {
    return 'calendar'
  }

  if (pathname.startsWith('/settings')) {
    return 'settings'
  }

  return 'dashboard'
}

export function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const [theme, setTheme] = useState<ThemeMode>('light')
  const activeView = getActiveView(location.pathname)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <AppShell.Provider
      activeView={activeView}
      onViewChange={(view) => navigate(viewPaths[view])}
      theme={theme}
      onThemeChange={setTheme}
    >
      <AppShell.Frame>
        <AppShell.Sidebar />
        <AppShell.Main>
          <Routes>
            <Route element={<Navigate replace to="/dashboard" />} path="/" />
            <Route element={<DashboardPage />} path="/dashboard" />
            <Route element={<JournalsPage />} path="/journals" />
            <Route element={<CalendarPage />} path="/calendar" />
            <Route element={<SettingsPage onThemeChange={setTheme} theme={theme} />} path="/settings" />
            <Route element={<Navigate replace to="/dashboard" />} path="*" />
          </Routes>
        </AppShell.Main>
      </AppShell.Frame>
    </AppShell.Provider>
  )
}
