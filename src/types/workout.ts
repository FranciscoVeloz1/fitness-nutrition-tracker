export const WORKOUT_CATEGORIES = ['cardio', 'strength', 'stretching', 'mixed', 'rest'] as const
export type WorkoutCategory = (typeof WORKOUT_CATEGORIES)[number]

export const WORKOUT_INTENSITIES = ['low', 'moderate', 'high'] as const
export type WorkoutIntensity = (typeof WORKOUT_INTENSITIES)[number]

export interface WorkoutEntry {
  completed: boolean
  category: WorkoutCategory
  /** Free-text label, e.g. "Push day", "5k run". */
  type: string
  /** Duration in minutes. */
  durationMinutes: number
  intensity: WorkoutIntensity
  notes?: string
}
