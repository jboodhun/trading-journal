import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { format } from 'date-fns'
import { useChartColors } from 'hooks'
import { formatCompactMoney, type EquityPoint } from 'lib'
import { ChartTip } from './ChartTip'

const monthDay = (date: string) => format(new Date(`${date}T12:00:00`), 'MMM d')

export function EquityCurveChart({ data }: { data: EquityPoint[] }) {
  const chartColors = useChartColors()
  return (
    <div className="chart-box">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 6, right: 6, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chartColors.accent} stopOpacity={0.35} />
              <stop offset="100%" stopColor={chartColors.accent} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={chartColors.grid} strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={monthDay}
            stroke={chartColors.axis}
            tickLine={false}
            axisLine={false}
            fontSize={11}
            minTickGap={40}
          />
          <YAxis
            tickFormatter={formatCompactMoney}
            stroke={chartColors.axis}
            tickLine={false}
            axisLine={false}
            fontSize={11}
            width={56}
          />
          <Tooltip content={<ChartTip labelOf={monthDay} />} cursor={{ stroke: chartColors.axis }} />
          <Area
            isAnimationActive={false}
            type="monotone"
            dataKey="equity"
            stroke={chartColors.accent}
            strokeWidth={2}
            fill="url(#equityFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
