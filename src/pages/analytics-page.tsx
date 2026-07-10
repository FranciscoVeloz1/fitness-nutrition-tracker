import { SectionHeader } from '@/components/common/section-header'
import { CardSkeleton } from '@/components/common/loading-skeletons'
import { ErrorState } from '@/components/common/error-state'
import { WeightChart } from '@/features/weight/components/weight-chart'
import { AdherenceTrendChart } from '@/features/analytics/components/adherence-trend-chart'
import { MonthlyComparisonChart } from '@/features/analytics/components/monthly-comparison-chart'
import { ContributionHeatmap } from '@/features/analytics/components/contribution-heatmap'
import { StreakCards } from '@/features/dashboard/components/streak-cards'
import { WorkoutStats } from '@/features/workout/components/workout-stats'
import { useDailyRecordsRange } from '@/hooks/use-daily-records-range'
import { useSettings } from '@/hooks/use-settings'
import { buildWeightSeries, computeWorkoutSummary } from '@/services/statistics'
import { computeAdherence, ADHERENCE_STREAK_THRESHOLD_PCT } from '@/services/adherence'
import { computeStreak } from '@/services/streaks'
import { shiftDateKey, todayKey } from '@/services/date'

const ANALYTICS_WINDOW_DAYS = 180

export default function AnalyticsPage() {
  const { data: settings } = useSettings()
  const rangeStart = shiftDateKey(todayKey(), -(ANALYTICS_WINDOW_DAYS - 1))
  const { data: records, isPending, isError, error, refetch } = useDailyRecordsRange(rangeStart, todayKey())

  if (isPending) {
    return (
      <div className="space-y-6">
        <SectionHeader title="Analytics" description="Trends across meals, workouts, and weight." />
        <div className="grid gap-4 sm:grid-cols-2">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    )
  }

  if (isError || !records) {
    return (
      <div className="space-y-6">
        <SectionHeader title="Analytics" description="Trends across meals, workouts, and weight." />
        <ErrorState message={error instanceof Error ? error.message : undefined} onRetry={() => void refetch()} />
      </div>
    )
  }

  const adherenceStats = records.map((record) => computeAdherence(record.date, record.meals))
  const adherenceStreak = computeStreak(
    adherenceStats.filter((stat) => stat.adherencePct >= ADHERENCE_STREAK_THRESHOLD_PCT).map((stat) => stat.date),
  )
  const workoutStreak = computeStreak(records.filter((record) => record.workout?.completed).map((record) => record.date))
  const weightSeries = buildWeightSeries(records)

  return (
    <div className="space-y-6">
      <SectionHeader title="Analytics" description="Trends across meals, workouts, and weight — last 6 months." />

      <StreakCards adherenceStreak={adherenceStreak} workoutStreak={workoutStreak} />

      <div className="space-y-3">
        <SectionHeader title="Diet adherence" />
        <AdherenceTrendChart records={records} />
      </div>

      <div className="space-y-3">
        <SectionHeader title="Consistency heatmap" description="Darker squares mean higher adherence that day." />
        <ContributionHeatmap records={records} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <SectionHeader title="Weight trend" />
          <WeightChart series={weightSeries} unit={settings?.weightUnit ?? 'kg'} goalWeightKg={settings?.goalWeightKg} />
        </div>
        <div className="space-y-3">
          <SectionHeader title="Workout consistency" />
          <WorkoutStats summary={computeWorkoutSummary(records)} />
        </div>
      </div>

      <div className="space-y-3">
        <SectionHeader title="Monthly comparison" />
        <MonthlyComparisonChart records={records} />
      </div>
    </div>
  )
}
