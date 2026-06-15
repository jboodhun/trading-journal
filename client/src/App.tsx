import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppLayout } from 'components'
import { AnalyticsPage, CalendarPage, DashboardPage, JournalsPage, TradesPage } from 'pages'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/journals" element={<JournalsPage />} />
          <Route path="/trades" element={<TradesPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
