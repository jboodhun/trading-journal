import { Moon, Sun } from 'lucide-react'
import { useAppDispatch, useAppSelector } from 'hooks'
import { toggleTheme } from 'store'

export function ThemeToggle() {
  const dispatch = useAppDispatch()
  const theme = useAppSelector((state) => state.theme)
  return (
    <button className="nav-link theme-toggle" onClick={() => dispatch(toggleTheme())}>
      {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
      {theme === 'dark' ? 'Light mode' : 'Dark mode'}
    </button>
  )
}
