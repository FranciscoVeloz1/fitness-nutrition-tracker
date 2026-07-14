import * as fitnessApi from '@/api/fitness'
import { requireFitnessApiSession } from '@/api/fitness-session'
import type {
  CompleteWorkoutSessionInput,
  CompleteWorkoutSessionResult,
  CurrentWorkoutSession,
  PutWorkoutProgramInput,
  WorkoutProgram,
} from '@/types/workout-program'

export class WorkoutProgramRepository {
  async get(): Promise<WorkoutProgram> {
    const { userId, request } = requireFitnessApiSession()
    return fitnessApi.getWorkoutProgram(userId, request)
  }

  async save(input: PutWorkoutProgramInput): Promise<WorkoutProgram> {
    const { userId, request } = requireFitnessApiSession()
    return fitnessApi.putWorkoutProgram(userId, input, request)
  }

  async getCurrent(): Promise<CurrentWorkoutSession> {
    const { userId, request } = requireFitnessApiSession()
    return fitnessApi.getCurrentWorkoutSession(userId, request)
  }

  async complete(input: CompleteWorkoutSessionInput): Promise<CompleteWorkoutSessionResult> {
    const { userId, request } = requireFitnessApiSession()
    return fitnessApi.completeWorkoutSession(userId, input, request)
  }
}

export const workoutProgramRepository = new WorkoutProgramRepository()
