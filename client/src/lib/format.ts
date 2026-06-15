import { format } from 'date-fns'

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export function formatMoney(value: number): string {
  return money.format(value)
}

const compact = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
})

export function formatCompactMoney(value: number): string {
  return compact.format(value)
}

export function formatPnl(value: number): string {
  const formatted = money.format(Math.abs(value))
  return value < 0 ? `-${formatted}` : formatted
}

export function pnlClass(value: number): string {
  return value >= 0 ? 'pnl-pos' : 'pnl-neg'
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`
}

export function formatDate(iso: string): string {
  return format(new Date(iso), 'MMM d, yyyy')
}

export function formatTime(iso: string): string {
  return format(new Date(iso), 'HH:mm')
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (hours < 24) return rest ? `${hours}h ${rest}m` : `${hours}h`
  const days = Math.floor(hours / 24)
  return `${days}d ${hours % 24}h`
}

export function dayKey(iso: string): string {
  return format(new Date(iso), 'yyyy-MM-dd')
}

export function isoToLocalInput(iso: string): string {
  return format(new Date(iso), "yyyy-MM-dd'T'HH:mm")
}

export function localInputToIso(local: string): string {
  return new Date(local).toISOString()
}
