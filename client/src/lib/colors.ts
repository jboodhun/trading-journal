// Chart colors must be passed as SVG attributes (var() doesn't work there),
// so each theme gets a palette mirroring the tokens in index.css.
// Components pick the active one via the useChartColors hook.
export interface ChartColors {
  accent: string
  win: string
  loss: string
  grid: string
  axis: string
}

export const darkChartColors: ChartColors = {
  accent: '#7c5cfa',
  win: '#34d39b',
  loss: '#f56476',
  grid: '#262a3a',
  axis: '#5d6378',
}

export const lightChartColors: ChartColors = {
  accent: '#6d4df0',
  win: '#0c9f76',
  loss: '#dd4360',
  grid: '#e3e5ee',
  axis: '#9aa0b6',
}
