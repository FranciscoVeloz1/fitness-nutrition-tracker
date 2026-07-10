import type { DateKey, Timestamp } from '@/types/common'
import type { MealLog } from '@/types/meal'
import type { WorkoutEntry } from '@/types/workout'
import type { WeightEntry } from '@/types/weight'

/**
 * The single source of truth for one calendar day. Meals are always present
 * (seeded from the meal templates); workout and weight are optional until
 * the user logs them.
 */
export interface DailyRecord {
  date: DateKey
  meals: MealLog[]
  workout?: WorkoutEntry
  weight?: WeightEntry
  notes?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}
