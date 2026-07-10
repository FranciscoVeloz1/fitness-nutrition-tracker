import { dailyRecordsRepository } from '@/storage/repositories/daily-records-repository'
import { settingsRepository } from '@/storage/repositories/settings-repository'
import type { DateKey } from '@/types/common'
import type { DailyRecord } from '@/types/daily-record'
import type { MealEntryUpdate, MealLog } from '@/types/meal'
import type { WorkoutEntry } from '@/types/workout'
import type { WeightEntry } from '@/types/weight'

function seedMealsFromTemplates(settings: Awaited<ReturnType<typeof settingsRepository.get>>): MealLog[] {
  return settings.mealTemplates.map((template) => ({
    slot: template.slot,
    name: template.name,
    time: template.time,
    status: 'pending',
  }))
}

/**
 * Fetches a day's record, creating and persisting a fresh one (seeded from
 * the current meal templates) the first time that date is touched. Every
 * mutation in this module funnels through here so "day exists with the
 * right meal slots" is guaranteed in one place.
 */
export async function getOrCreateDailyRecord(date: DateKey): Promise<DailyRecord> {
  const existing = await dailyRecordsRepository.get(date)
  if (existing) {
    return existing
  }

  const settings = await settingsRepository.get()
  const now = new Date().toISOString()
  const record: DailyRecord = {
    date,
    meals: seedMealsFromTemplates(settings),
    createdAt: now,
    updatedAt: now,
  }
  return dailyRecordsRepository.save(record)
}

export async function updateMealEntry(update: MealEntryUpdate): Promise<DailyRecord> {
  const record = await getOrCreateDailyRecord(update.date)
  const meals = record.meals.map((meal) =>
    meal.slot === update.slot
      ? {
          ...meal,
          status: update.status,
          actualDescription: update.actualDescription,
          notes: update.notes,
          estimatedCalories: update.estimatedCalories,
        }
      : meal,
  )
  const next: DailyRecord = { ...record, meals, updatedAt: new Date().toISOString() }
  return dailyRecordsRepository.save(next)
}

export async function updateWorkoutEntry(date: DateKey, workout: WorkoutEntry): Promise<DailyRecord> {
  const record = await getOrCreateDailyRecord(date)
  const next: DailyRecord = { ...record, workout, updatedAt: new Date().toISOString() }
  return dailyRecordsRepository.save(next)
}

export async function clearWorkoutEntry(date: DateKey): Promise<DailyRecord> {
  const record = await getOrCreateDailyRecord(date)
  const next: DailyRecord = { ...record, workout: undefined, updatedAt: new Date().toISOString() }
  return dailyRecordsRepository.save(next)
}

export async function updateWeightEntry(date: DateKey, weight: WeightEntry): Promise<DailyRecord> {
  const record = await getOrCreateDailyRecord(date)
  const next: DailyRecord = { ...record, weight, updatedAt: new Date().toISOString() }
  return dailyRecordsRepository.save(next)
}

export async function updateDayNotes(date: DateKey, notes: string): Promise<DailyRecord> {
  const record = await getOrCreateDailyRecord(date)
  const next: DailyRecord = { ...record, notes, updatedAt: new Date().toISOString() }
  return dailyRecordsRepository.save(next)
}
