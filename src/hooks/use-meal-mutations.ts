import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateMealEntry } from '@/services/daily-record-service'
import { invalidateDayRelatedQueries } from '@/hooks/use-daily-record'
import type { MealEntryUpdate } from '@/types/meal'

export function useUpdateMeal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (update: MealEntryUpdate) => updateMealEntry(update),
    onSuccess: (_record, variables) => {
      invalidateDayRelatedQueries(queryClient, variables.date)
    },
  })
}
