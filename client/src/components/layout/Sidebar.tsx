import { NavLink } from 'react-router-dom'
import { BookOpen, CalendarDays, CandlestickChart, ChartNoAxesColumn, LayoutDashboard, NotebookPen } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/journals', label: 'Journals', icon: BookOpen },
  { to: '/trades', label: 'Trades', icon: NotebookPen },
  { to: '/calendar', label: 'Calendar', icon: CalendarDays },
  { to: '/analytics', label: 'Analytics', icon: ChartNoAxesColumn },
]

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">
          <CandlestickChart size={18} />
        </span>
        Trading Journal
      </div>
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink key={to} to={to} className="nav-link" end={to === '/'}>
          <Icon size={17} />
          {label}
        </NavLink>
      ))}
      <ThemeToggle />
    </aside>
  )
}
