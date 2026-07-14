export const WORKOUT_CATEGORIES = ['cardio', 'strength', 'stretching', 'mixed', 'rest'] as const
export type WorkoutCategory = (typeof WORKOUT_CATEGORIES)[number]

/** Spanish display labels for each workout category. */
export const CATEGORY_LABELS: Record<WorkoutCategory, string> = {
  cardio: 'Cardio',
  strength: 'Fuerza',
  stretching: 'Estiramiento',
  mixed: 'Mixto',
  rest: 'Día de descanso',
}

export const WORKOUT_INTENSITIES = ['low', 'moderate', 'high'] as const
export type WorkoutIntensity = (typeof WORKOUT_INTENSITIES)[number]

/** Spanish display labels for each workout intensity level. */
export const INTENSITY_LABELS: Record<WorkoutIntensity, string> = {
  low: 'Baja',
  moderate: 'Moderada',
  high: 'Alta',
}

export interface WorkoutExerciseSnapshot {
  name: string
  sets: number
  reps: string
  notes?: string
}

export interface WorkoutEntry {
  completed: boolean
  category: WorkoutCategory
  /** Free-text label, e.g. "Push day", "5k run". */
  type: string
  /** Duration in minutes. */
  durationMinutes: number
  intensity: WorkoutIntensity
  notes?: string
  programDayId?: string
  dayName?: string
  exercises?: WorkoutExerciseSnapshot[]
}
