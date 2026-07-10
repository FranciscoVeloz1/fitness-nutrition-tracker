import type { DateKey } from '@/types/common'
import type { MealLog } from '@/types/meal'
import type { AdherenceStat } from '@/types/statistics'

/**
 * Percentage of planned meals eaten exactly as planned.
 *
 * Only `followed` meals earn credit — `modified` and `skipped` both count
 * as zero. This mirrors the product spec's worked example: 5 planned meals,
 * 4 followed, 1 modified → 80% (4 / 5), not 90%. `modified` still surfaces
 * separately in the returned breakdown so the UI can show "followed most of
 * the plan" nuance without inflating the adherence number itself.
 */
export function computeAdherence(date: DateKey, meals: MealLog[]): AdherenceStat {
  const plannedCount = meals.length
  const followedCount = meals.filter((meal) => meal.status === 'followed').length
  const modifiedCount = meals.filter((meal) => meal.status === 'modified').length
  const skippedCount = meals.filter((meal) => meal.status === 'skipped' || meal.status === 'pending').length

  const adherencePct = plannedCount === 0 ? 0 : Math.round((followedCount / plannedCount) * 100)

  return {
    date,
    adherencePct,
    plannedCount,
    followedCount,
    modifiedCount,
    skippedCount,
  }
}

export const ADHERENCE_STREAK_THRESHOLD_PCT = 80
