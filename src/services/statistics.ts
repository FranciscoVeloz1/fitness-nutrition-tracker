import type { DailyRecord } from '@/types/daily-record'
import type { WeightStat, WeightSummary, WorkoutSummary } from '@/types/statistics'
import type { WorkoutCategory } from '@/types/workout'
import { WORKOUT_CATEGORIES } from '@/types/workout'

const MOVING_AVERAGE_WINDOW = 7

/** Builds the weight time series (with a trailing 7-day moving average) from ascending daily records. */
export function buildWeightSeries(recordsAscending: DailyRecord[]): WeightStat[] {
  const entries = recordsAscending.filter((record) => record.weight !== undefined)
  return entries.map((record, index) => {
    const windowStart = Math.max(0, index - MOVING_AVERAGE_WINDOW + 1)
    const window = entries.slice(windowStart, index + 1)
    const movingAverageKg =
      window.length >= 1
        ? window.reduce((sum, entry) => sum + (entry.weight?.weightKg ?? 0), 0) / window.length
        : undefined

    return {
      date: record.date,
      weightKg: record.weight?.weightKg ?? 0,
      movingAverageKg: movingAverageKg ? Math.round(movingAverageKg * 10) / 10 : undefined,
    }
  })
}

export function computeWeightSummary(series: WeightStat[], goalWeightKg?: number): WeightSummary {
  if (series.length === 0) {
    return { goalWeightKg }
  }

  const latest = series[series.length - 1]
  const previous = series.length >= 2 ? series[series.length - 2] : undefined
  const weights = series.map((entry) => entry.weightKg)
  const highestKg = Math.max(...weights)
  const lowestKg = Math.min(...weights)
  const startingKg = series[0].weightKg

  let goalProgressPct: number | undefined
  if (goalWeightKg !== undefined && startingKg !== goalWeightKg) {
    const totalDelta = startingKg - goalWeightKg
    const currentDelta = startingKg - latest.weightKg
    goalProgressPct = Math.round(Math.min(100, Math.max(0, (currentDelta / totalDelta) * 100)))
  }

  return {
    latestKg: latest.weightKg,
    previousKg: previous?.weightKg,
    deltaKg: previous ? Math.round((latest.weightKg - previous.weightKg) * 10) / 10 : undefined,
    highestKg,
    lowestKg,
    goalWeightKg,
    goalProgressPct,
  }
}

export function computeWorkoutSummary(recordsInRange: DailyRecord[]): WorkoutSummary {
  const tracked = recordsInRange.filter((record) => record.workout !== undefined)
  const completed = tracked.filter((record) => record.workout?.completed)

  const categoryCounts = WORKOUT_CATEGORIES.reduce(
    (acc, category) => {
      acc[category] = 0
      return acc
    },
    {} as Record<WorkoutCategory, number>,
  )
  let totalMinutes = 0
  for (const record of completed) {
    const workout = record.workout
    if (!workout) {
      continue
    }
    categoryCounts[workout.category] += 1
    totalMinutes += workout.durationMinutes
  }

  return {
    completedDays: completed.length,
    totalDaysTracked: tracked.length,
    completionPct: tracked.length === 0 ? 0 : Math.round((completed.length / tracked.length) * 100),
    totalMinutes,
    averageDurationMinutes: completed.length === 0 ? 0 : Math.round(totalMinutes / completed.length),
    categoryCounts,
  }
}
