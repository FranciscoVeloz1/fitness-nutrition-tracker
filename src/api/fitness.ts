import type { AppSettings } from '@/types/settings'
import type { DailyRecord } from '@/types/daily-record'
import type { DateKey } from '@/types/common'
import type {
  CompleteWorkoutSessionInput,
  CompleteWorkoutSessionResult,
  CurrentWorkoutSession,
  PutWorkoutProgramInput,
  WorkoutProgram,
} from '@/types/workout-program'
import { ApiError } from './http'
import type { AuthorizedRequest } from './fitness-session'

type SettingsEnvelope = { settings: AppSettings }
type DailyRecordEnvelope = { dailyRecord: DailyRecord }
type DailyRecordsEnvelope = { dailyRecords: DailyRecord[] }
type WorkoutProgramEnvelope = { program: WorkoutProgram }
type CurrentWorkoutEnvelope = { current: CurrentWorkoutSession }

export async function getSettings(userId: string, authorizedRequest: AuthorizedRequest): Promise<AppSettings> {
  const result = await authorizedRequest<SettingsEnvelope>(`/api/v1/users/${userId}/fitness/settings`)
  return result.settings
}

export async function putSettings(
  userId: string,
  settings: AppSettings,
  authorizedRequest: AuthorizedRequest
): Promise<AppSettings> {
  const result = await authorizedRequest<SettingsEnvelope>(`/api/v1/users/${userId}/fitness/settings`, {
    method: 'PUT',
    body: settings,
  })
  return result.settings
}

export async function listDailyRecords(
  userId: string,
  from: DateKey,
  to: DateKey,
  authorizedRequest: AuthorizedRequest
): Promise<DailyRecord[]> {
  const params = new URLSearchParams({ from, to })
  const result = await authorizedRequest<DailyRecordsEnvelope>(
    `/api/v1/users/${userId}/fitness/daily-records?${params.toString()}`
  )
  return result.dailyRecords ?? []
}

export async function getDailyRecord(
  userId: string,
  date: DateKey,
  authorizedRequest: AuthorizedRequest
): Promise<DailyRecord | undefined> {
  try {
    const result = await authorizedRequest<DailyRecordEnvelope>(
      `/api/v1/users/${userId}/fitness/daily-records/${date}`
    )
    return result.dailyRecord
  } catch (caught) {
    if (caught instanceof ApiError && caught.status === 404) {
      return undefined
    }
    throw caught
  }
}

export async function putDailyRecord(
  userId: string,
  date: DateKey,
  body: Omit<DailyRecord, 'date' | 'createdAt' | 'updatedAt'> &
    Partial<Pick<DailyRecord, 'createdAt' | 'updatedAt'>>,
  authorizedRequest: AuthorizedRequest
): Promise<DailyRecord> {
  const result = await authorizedRequest<DailyRecordEnvelope>(
    `/api/v1/users/${userId}/fitness/daily-records/${date}`,
    {
      method: 'PUT',
      body: {
        meals: body.meals,
        workout: body.workout,
        weight: body.weight,
        notes: body.notes,
      },
    }
  )
  return result.dailyRecord
}

export async function deleteDailyRecord(
  userId: string,
  date: DateKey,
  authorizedRequest: AuthorizedRequest
): Promise<void> {
  await authorizedRequest<void>(`/api/v1/users/${userId}/fitness/daily-records/${date}`, {
    method: 'DELETE',
  })
}

export async function getWorkoutProgram(
  userId: string,
  authorizedRequest: AuthorizedRequest,
): Promise<WorkoutProgram> {
  const result = await authorizedRequest<WorkoutProgramEnvelope>(
    `/api/v1/users/${userId}/fitness/workout-program`,
  )
  return result.program
}

export async function putWorkoutProgram(
  userId: string,
  body: PutWorkoutProgramInput,
  authorizedRequest: AuthorizedRequest,
): Promise<WorkoutProgram> {
  const result = await authorizedRequest<WorkoutProgramEnvelope>(
    `/api/v1/users/${userId}/fitness/workout-program`,
    { method: 'PUT', body },
  )
  return result.program
}

export async function getCurrentWorkoutSession(
  userId: string,
  authorizedRequest: AuthorizedRequest,
): Promise<CurrentWorkoutSession> {
  const result = await authorizedRequest<CurrentWorkoutEnvelope>(
    `/api/v1/users/${userId}/fitness/workout-program/current`,
  )
  return result.current
}

export async function completeWorkoutSession(
  userId: string,
  body: CompleteWorkoutSessionInput,
  authorizedRequest: AuthorizedRequest,
): Promise<CompleteWorkoutSessionResult> {
  return authorizedRequest<CompleteWorkoutSessionResult>(
    `/api/v1/users/${userId}/fitness/workout-program/complete`,
    { method: 'POST', body },
  )
}
