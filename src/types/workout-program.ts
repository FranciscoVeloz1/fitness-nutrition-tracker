import type { WorkoutCategory } from '@/types/workout'

export interface WorkoutProgramExercise {
  id: string
  position: number
  name: string
  sets: number
  reps: string
  notes?: string
}

export interface WorkoutProgramDay {
  id: string
  position: number
  name: string
  isRest: boolean
  category: WorkoutCategory | null
  exercises: WorkoutProgramExercise[]
}

export interface WorkoutProgramProgress {
  currentDayIndex: number
  lastCompletedDate: string | null
}

export interface WorkoutProgram {
  id: string
  name: string
  days: WorkoutProgramDay[]
  progress: WorkoutProgramProgress
  createdAt: string
  updatedAt: string
}

export interface WorkoutProgramExerciseInput {
  name: string
  sets: number
  reps: string
  notes?: string
}

export interface WorkoutProgramDayInput {
  name: string
  isRest: boolean
  category?: WorkoutCategory | null
  exercises: WorkoutProgramExerciseInput[]
}

export interface PutWorkoutProgramInput {
  name: string
  days: WorkoutProgramDayInput[]
}

export interface CurrentWorkoutSession {
  dayIndex: number
  day: WorkoutProgramDay
  progress: WorkoutProgramProgress
}

export interface CompleteWorkoutSessionInput {
  date: string
  durationMinutes?: number
  intensity?: 'low' | 'moderate' | 'high'
  notes?: string
}

export interface CompleteWorkoutSessionResult {
  program: WorkoutProgram
  dailyRecord: import('@/types/daily-record').DailyRecord
  current: CurrentWorkoutSession
}
