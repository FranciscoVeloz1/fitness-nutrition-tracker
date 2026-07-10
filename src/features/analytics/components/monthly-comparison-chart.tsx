import { useMemo } from 'react'
import { format } from 'date-fns'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { DailyRecord } from '@/types/daily-record'
import { computeAdherence } from '@/services/adherence'
import { parseDateKey } from '@/services/date'
import { EmptyState } from '@/components/common/empty-state'
import { CalendarRange } from 'lucide-react'

export function MonthlyComparisonChart({ records }: { records: DailyRecord[] }) {
  const chartData = useMemo(() => {
    const byMonth = new Map<string, { adherenceSum: number; adherenceCount: number; workoutDays: number; totalDays: number }>()

    for (const record of records) {
      const monthKey = format(parseDateKey(record.date), 'MMM yyyy')
      const bucket = byMonth.get(monthKey) ?? { adherenceSum: 0, adherenceCount: 0, workoutDays: 0, totalDays: 0 }
      bucket.adherenceSum += computeAdherence(record.date, record.meals).adherencePct
      bucket.adherenceCount += 1
      bucket.totalDays += 1
      if (record.workout?.completed) {
        bucket.workoutDays += 1
      }
      byMonth.set(monthKey, bucket)
    }

    return Array.from(byMonth.entries()).map(([month, bucket]) => ({
      month,
      adherence: bucket.adherenceCount === 0 ? 0 : Math.round(bucket.adherenceSum / bucket.adherenceCount),
      workoutCompletion: bucket.totalDays === 0 ? 0 : Math.round((bucket.workoutDays / bucket.totalDays) * 100),
    }))
  }, [records])

  if (chartData.length === 0) {
    return <EmptyState icon={CalendarRange} title="Not enough history yet" description="Come back after a few weeks of logging." />
  }

  return (
    <div className="glass-panel h-64 rounded-2xl p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
          <YAxis domain={[0, 100]} tickLine={false} axisLine={false} width={32} unit="%" className="text-xs" />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: '1px solid var(--border)', background: 'var(--popover)' }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="adherence" name="Diet adherence" radius={[8, 8, 0, 0]} fill="var(--color-chart-1)" />
          <Bar dataKey="workoutCompletion" name="Workout completion" radius={[8, 8, 0, 0]} fill="var(--color-chart-2)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
