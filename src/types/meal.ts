import type { DateKey } from '@/types/common'

/**
 * The five fixed meal slots of the day. Order matters for display and is
 * reused wherever meals are listed or iterated.
 */
export const MEAL_SLOTS = [
  'breakfast',
  'morningSnack',
  'lunch',
  'afternoonSnack',
  'dinner',
] as const

export type MealSlot = (typeof MEAL_SLOTS)[number]

/** Spanish display labels for each fixed meal slot, used as form field labels. */
export const MEAL_SLOT_LABELS: Record<MealSlot, string> = {
  breakfast: 'Desayuno',
  morningSnack: 'Colación matutina',
  lunch: 'Almuerzo',
  afternoonSnack: 'Colación de la tarde',
  dinner: 'Cena',
}

/**
 * Adherence outcome for a single planned meal on a given day.
 * - `pending`: not logged yet (default state for a future/untouched meal)
 * - `followed`: eaten exactly as planned
 * - `modified`: eaten, but different from the plan (partial credit)
 * - `skipped`: not eaten at all
 */
export type MealStatus = 'pending' | 'followed' | 'modified' | 'skipped'

export interface MealTemplate {
  slot: MealSlot
  name: string
  /** 24h `HH:mm` scheduled time, e.g. "07:30". */
  time: string
}

export interface MealLog {
  slot: MealSlot
  /** Snapshot of the planned name/time at the moment this day was recorded. */
  name: string
  time: string
  status: MealStatus
  /** Only meaningful when status is "modified" or "skipped". */
  actualDescription?: string
  notes?: string
  estimatedCalories?: number
}

export interface MealEntryUpdate {
  date: DateKey
  slot: MealSlot
  status: MealStatus
  actualDescription?: string
  notes?: string
  estimatedCalories?: number
}
