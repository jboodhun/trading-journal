import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { format } from 'date-fns'
import { useChartColors } from 'hooks'
import { formatCompactMoney, type DayPnl } from 'lib'
import { ChartTip } from './ChartTip'

const monthDay = (date: string) => format(new Date(`${date}T12:00:00`), 'MMM d')

export function DailyPnlChart({ data }: { data: DayPnl[] }) {
  const chartColors = useChartColors()
  return (
    <div className="chart-box">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 6, right: 6, bottom: 0, left: 0 }}>
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
          <Tooltip content={<ChartTip labelOf={monthDay} />} cursor={{ fill: chartColors.grid, opacity: 0.4 }} />
          <ReferenceLine y={0} stroke={chartColors.axis} />
          <Bar dataKey="pnl" radius={[3, 3, 0, 0]} isAnimationActive={false}>
            {data.map((day) => (
              <Cell key={day.date} fill={day.pnl >= 0 ? chartColors.win : chartColors.loss} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
