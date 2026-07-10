import { useQuery } from '@tanstack/react-query'
import { dailyRecordsRepository } from '@/storage/repositories/daily-records-repository'
import { queryKeys } from '@/lib/query-keys'
import type { DateKey } from '@/types/common'

export function useDailyRecordsRange(startDate: DateKey, endDate: DateKey) {
  return useQuery({
    queryKey: queryKeys.dailyRecordsRange(startDate, endDate),
    queryFn: () => dailyRecordsRepository.listRange(startDate, endDate),
  })
}

export function useAllDailyRecords() {
  return useQuery({
    queryKey: queryKeys.dailyRecordsAll(),
    queryFn: () => dailyRecordsRepository.listAll(),
  })
}
