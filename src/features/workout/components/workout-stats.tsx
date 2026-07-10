import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { StatCard } from '@/components/common/stat-card'
import { Flame, Timer, TrendingUp } from 'lucide-react'
import type { WorkoutSummary } from '@/types/statistics'

export function WorkoutStats({ summary }: { summary: WorkoutSummary }) {
  const chartData = Object.entries(summary.categoryCounts)
    .filter(([, count]) => count > 0)
    .map(([category, count]) => ({ category, count }))

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard
          label="Completion (30d)"
          value={`${summary.completionPct}%`}
          icon={TrendingUp}
          accentClassName="bg-primary/10 text-primary"
        />
        <StatCard
          label="Total minutes"
          value={summary.totalMinutes}
          icon={Timer}
          accentClassName="bg-accent/15 text-accent"
        />
        <StatCard
          label="Avg. duration"
          value={`${summary.averageDurationMinutes} min`}
          icon={Flame}
          accentClassName="bg-warning/15 text-warning"
        />
      </div>

      {chartData.length > 0 ? (
        <div className="glass-panel h-56 rounded-2xl p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
              <XAxis dataKey="category" tickLine={false} axisLine={false} className="text-xs capitalize" />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={24} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: '1px solid var(--border)', background: 'var(--popover)' }}
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]} fill="var(--color-chart-1)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : null}
    </div>
  )
}
