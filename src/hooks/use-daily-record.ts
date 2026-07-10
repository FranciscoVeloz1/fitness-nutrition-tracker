import { useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query'
import { getOrCreateDailyRecord } from '@/services/daily-record-service'
import { queryKeys } from '@/lib/query-keys'
import type { DateKey } from '@/types/common'

export function useDailyRecord(date: DateKey) {
  return useQuery({
    queryKey: queryKeys.dailyRecord(date),
    queryFn: () => getOrCreateDailyRecord(date),
  })
}

/** Shared invalidation for every mutation that touches a single day's record. */
export function invalidateDayRelatedQueries(queryClient: QueryClient, date: DateKey): void {
  void queryClient.invalidateQueries({ queryKey: queryKeys.dailyRecord(date) })
  void queryClient.invalidateQueries({ queryKey: ['dailyRecords'] })
  void queryClient.invalidateQueries({ queryKey: queryKeys.dashboardSummary() })
}

export function useDayInvalidation() {
  const queryClient = useQueryClient()
  return (date: DateKey) => invalidateDayRelatedQueries(queryClient, date)
}
