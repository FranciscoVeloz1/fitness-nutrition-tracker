import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { workoutProgramRepository } from '@/storage/repositories/workout-program-repository'
import { invalidateDayRelatedQueries } from '@/hooks/use-daily-record'
import { queryKeys } from '@/lib/query-keys'
import type {
  CompleteWorkoutSessionInput,
  PutWorkoutProgramInput,
} from '@/types/workout-program'

export function useWorkoutProgram() {
  return useQuery({
    queryKey: queryKeys.workoutProgram(),
    queryFn: () => workoutProgramRepository.get(),
  })
}

export function useCurrentWorkoutSession() {
  return useQuery({
    queryKey: queryKeys.currentWorkoutSession(),
    queryFn: () => workoutProgramRepository.getCurrent(),
  })
}

export function useUpdateWorkoutProgram() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: PutWorkoutProgramInput) => workoutProgramRepository.save(input),
    onSuccess: (program) => {
      queryClient.setQueryData(queryKeys.workoutProgram(), program)
      void queryClient.invalidateQueries({ queryKey: queryKeys.currentWorkoutSession() })
    },
  })
}

export function useCompleteWorkoutSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CompleteWorkoutSessionInput) =>
      workoutProgramRepository.complete(input),
    onSuccess: (result) => {
      queryClient.setQueryData(queryKeys.workoutProgram(), result.program)
      queryClient.setQueryData(queryKeys.currentWorkoutSession(), result.current)
      queryClient.setQueryData(queryKeys.dailyRecord(result.dailyRecord.date), result.dailyRecord)
      invalidateDayRelatedQueries(queryClient, result.dailyRecord.date)
      void queryClient.invalidateQueries({ queryKey: queryKeys.dashboardSummary() })
    },
  })
}
