import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { EmptyState } from '@/components/common/empty-state'
import { BarChart3 } from 'lucide-react'
import type { DailyRecord } from '@/types/daily-record'
import { computeAdherence } from '@/services/adherence'
import { formatShortDate } from '@/services/date'

export function WeeklySummaryChart({ records }: { records: DailyRecord[] }) {
  if (records.length === 0) {
    return <EmptyState icon={BarChart3} title="No data yet this week" description="Log a meal to see your weekly trend." />
  }

  const chartData = records.map((record) => ({
    date: formatShortDate(record.date),
    adherence: computeAdherence(record.date, record.meals).adherencePct,
  }))

  return (
    <div className="glass-panel h-56 rounded-2xl p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
          <XAxis dataKey="date" tickLine={false} axisLine={false} className="text-xs" />
          <YAxis domain={[0, 100]} tickLine={false} axisLine={false} width={32} unit="%" className="text-xs" />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: '1px solid var(--border)', background: 'var(--popover)' }}
            formatter={(value) => [`${value}%`, 'Adherence']}
          />
          <Bar dataKey="adherence" radius={[8, 8, 0, 0]} fill="var(--color-chart-1)" maxBarSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
