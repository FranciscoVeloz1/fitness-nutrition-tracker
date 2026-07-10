import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateWorkoutEntry, clearWorkoutEntry } from '@/services/daily-record-service'
import { invalidateDayRelatedQueries } from '@/hooks/use-daily-record'
import type { DateKey } from '@/types/common'
import type { WorkoutEntry } from '@/types/workout'

export function useUpdateWorkout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ date, workout }: { date: DateKey; workout: WorkoutEntry }) =>
      updateWorkoutEntry(date, workout),
    onSuccess: (_record, variables) => {
      invalidateDayRelatedQueries(queryClient, variables.date)
    },
  })
}

export function useClearWorkout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (date: DateKey) => clearWorkoutEntry(date),
    onSuccess: (_record, date) => {
      invalidateDayRelatedQueries(queryClient, date)
    },
  })
}
