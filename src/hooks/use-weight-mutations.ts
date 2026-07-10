import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateWeightEntry, updateDayNotes } from '@/services/daily-record-service'
import { invalidateDayRelatedQueries } from '@/hooks/use-daily-record'
import type { DateKey } from '@/types/common'
import type { WeightEntry } from '@/types/weight'

export function useUpdateWeight() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ date, weight }: { date: DateKey; weight: WeightEntry }) => updateWeightEntry(date, weight),
    onSuccess: (_record, variables) => {
      invalidateDayRelatedQueries(queryClient, variables.date)
    },
  })
}

export function useUpdateDayNotes() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ date, notes }: { date: DateKey; notes: string }) => updateDayNotes(date, notes),
    onSuccess: (_record, variables) => {
      invalidateDayRelatedQueries(queryClient, variables.date)
    },
  })
}
