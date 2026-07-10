import { ArrowDown, ArrowUp, Minus, Target, TrendingUp, TrendingDown } from 'lucide-react'
import { StatCard } from '@/components/common/stat-card'
import type { WeightSummary } from '@/types/statistics'
import type { WeightUnit } from '@/types/common'
import { kgToDisplay, weightUnitLabel } from '@/services/units'

export function WeightSummaryCards({ summary, unit }: { summary: WeightSummary; unit: WeightUnit }) {
  const label = weightUnitLabel(unit)
  const delta = summary.deltaKg
  const deltaDisplay = delta !== undefined ? kgToDisplay(Math.abs(delta), unit) : undefined

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <StatCard
        label="Current"
        value={summary.latestKg !== undefined ? `${kgToDisplay(summary.latestKg, unit)} ${label}` : '—'}
        icon={delta === undefined || delta === 0 ? Minus : delta > 0 ? ArrowUp : ArrowDown}
        trend={
          delta !== undefined
            ? {
                direction: delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat',
                label: delta === 0 ? 'No change' : `${deltaDisplay} ${label} vs. last entry`,
                tone: delta === 0 ? 'neutral' : delta < 0 ? 'positive' : 'negative',
              }
            : undefined
        }
      />
      <StatCard
        label="Highest"
        value={summary.highestKg !== undefined ? `${kgToDisplay(summary.highestKg, unit)} ${label}` : '—'}
        icon={TrendingUp}
        accentClassName="bg-destructive/10 text-destructive"
      />
      <StatCard
        label="Lowest"
        value={summary.lowestKg !== undefined ? `${kgToDisplay(summary.lowestKg, unit)} ${label}` : '—'}
        icon={TrendingDown}
        accentClassName="bg-success/10 text-success"
      />
      <StatCard
        label="Goal progress"
        value={summary.goalProgressPct !== undefined ? `${summary.goalProgressPct}%` : 'Set a goal'}
        icon={Target}
        accentClassName="bg-accent/15 text-accent"
      />
    </div>
  )
}
