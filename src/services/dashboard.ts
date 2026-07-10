import { dailyRecordsRepository } from '@/storage/repositories/daily-records-repository'
import { settingsRepository } from '@/storage/repositories/settings-repository'
import { computeAdherence, ADHERENCE_STREAK_THRESHOLD_PCT } from '@/services/adherence'
import { computeStreak } from '@/services/streaks'
import { buildWeightSeries, computeWeightSummary } from '@/services/statistics'
import { shiftDateKey, todayKey } from '@/services/date'
import type { DashboardSummary } from '@/types/statistics'

const WEEKLY_WINDOW_DAYS = 7

export async function loadDashboardSummary(): Promise<DashboardSummary> {
  const today = todayKey()
  const rangeStart = shiftDateKey(today, -89)
  const [settings, records] = await Promise.all([
    settingsRepository.get(),
    dailyRecordsRepository.listRange(rangeStart, today),
  ])

  const todayRecord = records.find((record) => record.date === today)
  const adherenceStats = records.map((record) => computeAdherence(record.date, record.meals))
  const adherenceToday = adherenceStats.find((stat) => stat.date === today)

  const last7 = adherenceStats.filter((stat) => shiftDateKey(today, -(WEEKLY_WINDOW_DAYS - 1)) <= stat.date)
  const weeklyAdherenceAvgPct =
    last7.length === 0
      ? undefined
      : Math.round(last7.reduce((sum, stat) => sum + stat.adherencePct, 0) / last7.length)

  const qualifyingAdherenceDates = adherenceStats
    .filter((stat) => stat.adherencePct >= ADHERENCE_STREAK_THRESHOLD_PCT)
    .map((stat) => stat.date)
  const qualifyingWorkoutDates = records
    .filter((record) => record.workout?.completed)
    .map((record) => record.date)

  const weightSeries = buildWeightSeries(records)
  const weightSummary = computeWeightSummary(weightSeries, settings.goalWeightKg)

  return {
    today,
    weight: weightSummary,
    adherenceToday,
    workoutCompletedToday: Boolean(todayRecord?.workout?.completed),
    mealsFollowedToday: adherenceToday?.followedCount ?? 0,
    mealsPlannedToday: adherenceToday?.plannedCount ?? settings.mealTemplates.length,
    weeklyAdherenceAvgPct,
    adherenceStreak: computeStreak(qualifyingAdherenceDates),
    workoutStreak: computeStreak(qualifyingWorkoutDates),
  }
}
