import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { settingsRepository } from '@/storage/repositories/settings-repository'
import { queryKeys } from '@/lib/query-keys'
import type { AppSettings } from '@/types/settings'

export function useSettings() {
  return useQuery({
    queryKey: queryKeys.settings(),
    queryFn: () => settingsRepository.get(),
  })
}

export function useUpdateSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (patch: Partial<AppSettings>) => settingsRepository.update(patch),
    onSuccess: (settings) => {
      queryClient.setQueryData(queryKeys.settings(), settings)
      void queryClient.invalidateQueries({ queryKey: queryKeys.dashboardSummary() })
    },
  })
}

export function useResetSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => settingsRepository.reset(),
    onSuccess: (settings) => {
      queryClient.setQueryData(queryKeys.settings(), settings)
      void queryClient.invalidateQueries({ queryKey: queryKeys.dashboardSummary() })
    },
  })
}
