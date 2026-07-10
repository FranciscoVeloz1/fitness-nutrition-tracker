import type { ThemeMode, WeightUnit } from '@/types/common'
import type { MealTemplate } from '@/types/meal'

export interface AppSettings {
  mealTemplates: MealTemplate[]
  /** Always stored in kilograms; convert at the presentation layer. */
  goalWeightKg?: number
  weightUnit: WeightUnit
  theme: ThemeMode
  /** Bumped whenever the on-disk schema changes; used for migrations. */
  schemaVersion: number
}
