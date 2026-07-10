import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { WeightStat } from '@/types/statistics'
import type { WeightUnit } from '@/types/common'
import { kgToDisplay, weightUnitLabel } from '@/services/units'
import { formatShortDate } from '@/services/date'
import { EmptyState } from '@/components/common/empty-state'
import { Scale } from 'lucide-react'

interface WeightChartProps {
  series: WeightStat[]
  unit: WeightUnit
  goalWeightKg?: number
}

export function WeightChart({ series, unit, goalWeightKg }: WeightChartProps) {
  if (series.length === 0) {
    return (
      <EmptyState
        icon={Scale}
        title="Aún no hay registros de peso"
        description="Registra tu peso para ver aquí tu línea de tendencia."
      />
    )
  }

  const chartData = series.map((entry) => ({
    date: formatShortDate(entry.date),
    weight: kgToDisplay(entry.weightKg, unit),
    movingAverage: entry.movingAverageKg ? kgToDisplay(entry.movingAverageKg, unit) : undefined,
  }))

  return (
    <div className="glass-panel h-72 rounded-2xl p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
          <XAxis dataKey="date" tickLine={false} axisLine={false} minTickGap={24} className="text-xs" />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={40}
            domain={['auto', 'auto']}
            unit={weightUnitLabel(unit)}
            className="text-xs"
          />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: '1px solid var(--border)', background: 'var(--popover)' }}
          />
          {goalWeightKg ? (
            <ReferenceLine
              y={kgToDisplay(goalWeightKg, unit)}
              stroke="var(--color-success)"
              strokeDasharray="4 4"
              label={{ value: 'Meta', position: 'insideTopRight', fill: 'var(--color-success)', fontSize: 11 }}
            />
          ) : null}
          <Line
            type="monotone"
            dataKey="weight"
            stroke="var(--color-chart-1)"
            strokeWidth={2}
            dot={false}
            name="Peso"
          />
          <Line
            type="monotone"
            dataKey="movingAverage"
            stroke="var(--color-chart-2)"
            strokeWidth={2}
            strokeDasharray="5 3"
            dot={false}
            name="Prom. 7 días"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
