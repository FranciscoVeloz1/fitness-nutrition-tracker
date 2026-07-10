import { getStorageAdapter } from '@/storage/storage-provider'
import { STORAGE_KEYS } from '@/storage/keys'
import type { AppSettings } from '@/types/settings'
import type { MealTemplate } from '@/types/meal'

export const SETTINGS_SCHEMA_VERSION = 1

export const DEFAULT_MEAL_TEMPLATES: MealTemplate[] = [
  { slot: 'breakfast', name: 'Breakfast', time: '07:30' },
  { slot: 'morningSnack', name: 'Morning Snack', time: '10:00' },
  { slot: 'lunch', name: 'Lunch', time: '13:00' },
  { slot: 'afternoonSnack', name: 'Afternoon Snack', time: '16:30' },
  { slot: 'dinner', name: 'Dinner', time: '20:00' },
]

export function createDefaultSettings(): AppSettings {
  return {
    mealTemplates: DEFAULT_MEAL_TEMPLATES.map((template) => ({ ...template })),
    weightUnit: 'kg',
    theme: 'dark',
    schemaVersion: SETTINGS_SCHEMA_VERSION,
  }
}

/**
 * Repository for the single app-wide settings document. Swappable for a
 * `/settings` API resource later: the interface stays `get`/`save` and only
 * the implementation body changes.
 */
export class SettingsRepository {
  async get(): Promise<AppSettings> {
    const adapter = await getStorageAdapter()
    const stored = await adapter.get<AppSettings>(STORAGE_KEYS.settings)
    if (!stored) {
      const defaults = createDefaultSettings()
      await adapter.set(STORAGE_KEYS.settings, defaults)
      return defaults
    }
    return stored
  }

  async save(settings: AppSettings): Promise<AppSettings> {
    const adapter = await getStorageAdapter()
    await adapter.set(STORAGE_KEYS.settings, settings)
    return settings
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
