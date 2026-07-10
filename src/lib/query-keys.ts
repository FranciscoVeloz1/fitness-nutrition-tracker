import type { DateKey } from '@/types/common'

/**
 * Centralized query key factory. Keeping this in one place avoids typos
 * between the key a component subscribes to and the key a mutation
 * invalidates — a common source of "UI didn't update" bugs.
 */
export const queryKeys = {
  settings: () => ['settings'] as const,
  dailyRecord: (date: DateKey) => ['dailyRecord', date] as const,
  dailyRecordsRange: (start: DateKey, end: DateKey) => ['dailyRecords', 'range', start, end] as const,
  dailyRecordsAll: () => ['dailyRecords', 'all'] as const,
  dashboardSummary: () => ['dashboardSummary'] as const,
}
