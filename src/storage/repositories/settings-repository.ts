import type { AppSettings } from '@/types/settings'
import type { MealTemplate } from '@/types/meal'
import * as fitnessApi from '@/api/fitness'
import { requireFitnessApiSession } from '@/api/fitness-session'

export const SETTINGS_SCHEMA_VERSION = 1

export const DEFAULT_MEAL_TEMPLATES: MealTemplate[] = [
  { slot: 'breakfast', name: 'Desayuno', time: '07:30' },
  { slot: 'morningSnack', name: 'Colación matutina', time: '10:00' },
  { slot: 'lunch', name: 'Almuerzo', time: '13:00' },
  { slot: 'afternoonSnack', name: 'Colación de la tarde', time: '16:30' },
  { slot: 'dinner', name: 'Cena', time: '20:00' },
]

export function createDefaultSettings(): AppSettings {
  return {
    mealTemplates: DEFAULT_MEAL_TEMPLATES.map((template) => ({ ...template })),
    weightUnit: 'kg',
    theme: 'dark',
    schemaVersion: SETTINGS_SCHEMA_VERSION,
  }
}

export class SettingsRepository {
  async get(): Promise<AppSettings> {
    const { userId, request } = requireFitnessApiSession()
    return fitnessApi.getSettings(userId, request)
  }

  async save(settings: AppSettings): Promise<AppSettings> {
    const { userId, request } = requireFitnessApiSession()
    return fitnessApi.putSettings(userId, settings, request)
  }

  async update(patch: Partial<AppSettings>): Promise<AppSettings> {
    const current = await this.get()
    const next: AppSettings = { ...current, ...patch }
    return this.save(next)
  }

  async reset(): Promise<AppSettings> {
    const defaults = createDefaultSettings()
    return this.save(defaults)
  }
}

export const settingsRepository = new SettingsRepository()
