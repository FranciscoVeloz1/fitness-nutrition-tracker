import type { DateKey } from '@/types/common'
import type { WorkoutCategory } from '@/types/workout'

export interface AdherenceStat {
  date: DateKey
  /** 0-100. */
  adherencePct: number
  plannedCount: number
  followedCount: number
  modifiedCount: number
  skippedCount: number
}

export interface StreakStat {
  current: number
  longest: number
}

export interface WeightStat {
  date: DateKey
  weightKg: number
  /** Trailing 7-day moving average ending on this date, when enough data exists. */
  movingAverageKg?: number
}

export interface WeightSummary {
  latestKg?: number
  previousKg?: number
  deltaKg?: number
  highestKg?: number
  lowestKg?: number
  goalWeightKg?: number
  /** 0-100, only present when a goal and a starting point are known. */
  goalProgressPct?: number
}

export interface WorkoutSummary {
  completedDays: number
  totalDaysTracked: number
  completionPct: number
  totalMinutes: number
  averageDurationMinutes: number
  categoryCounts: Record<WorkoutCategory, number>
}

export interface DashboardSummary {
  today: DateKey
  weight: WeightSummary
  adherenceToday?: AdherenceStat
  workoutCompletedToday: boolean
  mealsFollowedToday: number
  mealsPlannedToday: number
  weeklyAdherenceAvgPct?: number
  adherenceStreak: StreakStat
  workoutStreak: StreakStat
}
