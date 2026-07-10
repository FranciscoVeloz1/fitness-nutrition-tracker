import { Scale, Dumbbell, UtensilsCrossed, ArrowDown, ArrowUp, Minus } from 'lucide-react'
import { SectionHeader } from '@/components/common/section-header'
import { StatCard } from '@/components/common/stat-card'
import { ProgressRing } from '@/components/common/progress-ring'
import { StatCardGridSkeleton, CardSkeleton } from '@/components/common/loading-skeletons'
import { ErrorState } from '@/components/common/error-state'
import { GreetingHeader } from '@/features/dashboard/components/greeting-header'
import { QuickActions } from '@/features/dashboard/components/quick-actions'
import { WeeklySummaryChart } from '@/features/dashboard/components/weekly-summary-chart'
import { StreakCards } from '@/features/dashboard/components/streak-cards'
import { useDashboardSummary } from '@/hooks/use-dashboard-summary'
import { useDailyRecordsRange } from '@/hooks/use-daily-records-range'
import { useSettings } from '@/hooks/use-settings'
import { shiftDateKey, todayKey } from '@/services/date'
import { kgToDisplay, weightUnitLabel } from '@/services/units'

export default function DashboardPage() {
  const { data: summary, isPending, isError, error, refetch } = useDashboardSummary()
  const { data: settings } = useSettings()
  const today = todayKey()
  const weekStart = shiftDateKey(today, -6)
  const { data: weekRecords } = useDailyRecordsRange(weekStart, today)

  const unit = settings?.weightUnit ?? 'kg'

  if (isError) {
    return (
      <div className="space-y-6">
        <GreetingHeader today={today} />
        <ErrorState message={error instanceof Error ? error.message : undefined} onRetry={() => void refetch()} />
      </div>
    )
  }

  const weightDelta = summary?.weight.deltaKg
  const deltaIcon = weightDelta === undefined || weightDelta === 0 ? Minus : weightDelta > 0 ? ArrowUp : ArrowDown

  return (
    <div className="space-y-6">
      <GreetingHeader today={today} />

      <QuickActions />

      {isPending || !summary ? (
        <StatCardGridSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            label="Peso actual"
            value={summary.weight.latestKg !== undefined ? `${kgToDisplay(summary.weight.latestKg, unit)} ${weightUnitLabel(unit)}` : '—'}
            icon={Scale}
            trend={
              weightDelta !== undefined
                ? {
                    direction: weightDelta > 0 ? 'up' : weightDelta < 0 ? 'down' : 'flat',
                    label:
                      weightDelta === 0
                        ? 'Sin cambio vs. ayer'
                        : `${kgToDisplay(Math.abs(weightDelta), unit)} ${weightUnitLabel(unit)} vs. el último registro`,
                    tone: weightDelta === 0 ? 'neutral' : weightDelta < 0 ? 'positive' : 'negative',
                  }
                : undefined
            }
            accentClassName="bg-primary/10 text-primary"
          />
          <StatCard
            label="Adherencia a la dieta"
            value={summary.adherenceToday ? `${summary.adherenceToday.adherencePct}%` : '—'}
            icon={UtensilsCrossed}
            trend={{
              direction: 'flat',
              label: `${summary.mealsFollowedToday}/${summary.mealsPlannedToday} comidas cumplidas`,
              tone: 'neutral',
            }}
            accentClassName="bg-success/10 text-success"
          />
          <StatCard
            label="Entrenamiento"
            value={summary.workoutCompletedToday ? 'Completado' : 'Aún no'}
            icon={Dumbbell}
            accentClassName={summary.workoutCompletedToday ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}
          />
          <StatCard
            label="Cambio de peso"
            value={weightDelta !== undefined ? `${weightDelta > 0 ? '+' : ''}${kgToDisplay(weightDelta, unit)} ${weightUnitLabel(unit)}` : '—'}
            icon={deltaIcon}
            accentClassName="bg-accent/15 text-accent"
          />
        </div>
      )}

      {summary ? <StreakCards adherenceStreak={summary.adherenceStreak} workoutStreak={summary.workoutStreak} /> : null}

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-3">
          <SectionHeader title="Esta semana" description="Adherencia diaria a la dieta durante los últimos 7 días." />
          {weekRecords ? <WeeklySummaryChart records={weekRecords} /> : <CardSkeleton />}
        </div>

        <div className="space-y-3">
          <SectionHeader title="Promedio semanal" />
          <div className="glass-panel flex h-56 flex-col items-center justify-center gap-2 rounded-2xl p-4">
            <ProgressRing value={summary?.weeklyAdherenceAvgPct ?? 0} size={104} colorClassName="text-success" />
            <p className="text-muted-foreground text-xs">Adherencia promedio esta semana</p>
          </div>
        </div>
      </div>
    </div>
  )
}
