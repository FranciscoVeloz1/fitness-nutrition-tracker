import type { DateKey } from '@/types/common'

export const STORAGE_KEYS = {
  settings: 'app:settings',
  dailyRecordPrefix: 'daily:',
  dailyRecord: (date: DateKey): string => `daily:${date}`,
} as const
