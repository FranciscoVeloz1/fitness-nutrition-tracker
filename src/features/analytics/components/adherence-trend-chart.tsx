import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { DailyRecord } from '@/types/daily-record'
import { computeAdherence } from '@/services/adherence'
import { formatShortDate } from '@/services/date'
import { EmptyState } from '@/components/common/empty-state'
import { LineChart as LineChartIcon } from 'lucide-react'

export function AdherenceTrendChart({ records }: { records: DailyRecord[] }) {
  if (records.length === 0) {
    return <EmptyState icon={LineChartIcon} title="No adherence data yet" description="Log meals to see your trend." />
  }

  const chartData = records.map((record) => ({
    date: formatShortDate(record.date),
    adherence: computeAdherence(record.date, record.meals).adherencePct,
  }))

  return (
    <div className="glass-panel h-64 rounded-2xl p-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="adherenceFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.4} />
              <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
          <XAxis dataKey="date" tickLine={false} axisLine={false} minTickGap={32} className="text-xs" />
          <YAxis domain={[0, 100]} tickLine={false} axisLine={false} width={32} unit="%" className="text-xs" />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: '1px solid var(--border)', background: 'var(--popover)' }}
            formatter={(value) => [`${value}%`, 'Adherence']}
          />
          <Area
            type="monotone"
            dataKey="adherence"
            stroke="var(--color-chart-1)"
            strokeWidth={2}
            fill="url(#adherenceFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
