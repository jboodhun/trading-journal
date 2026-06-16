import { darkChartColors, lightChartColors, type ChartColors } from 'lib'
import { useAppSelector } from './store'

export function useChartColors(): ChartColors {
  const theme = useAppSelector((state) => state.theme)
  return theme === 'light' ? lightChartColors : darkChartColors
}
