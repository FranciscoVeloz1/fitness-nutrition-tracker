import { useMutation, useQueryClient, type QueryClient } from '@tanstack/react-query'
import { buildBackup, downloadBackup, parseBackupFile, restoreBackup, resetAllData } from '@/services/backup'
import { queryKeys } from '@/lib/query-keys'

function invalidateAllPersistedData(queryClient: QueryClient): void {
  void queryClient.invalidateQueries({ queryKey: queryKeys.settings() })
  void queryClient.invalidateQueries({ queryKey: ['dailyRecord'] })
  void queryClient.invalidateQueries({ queryKey: ['dailyRecords'] })
  void queryClient.invalidateQueries({ queryKey: queryKeys.dashboardSummary() })
}

export function useExportBackup() {
  return useMutation({
    mutationFn: async () => {
      const backup = await buildBackup()
      downloadBackup(backup)
      return backup
    },
  })
}

export function useImportBackup() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (file: File) => {
      const raw = await file.text()
      const backup = parseBackupFile(raw)
      await restoreBackup(backup)
      return backup
    },
    onSuccess: () => invalidateAllPersistedData(queryClient),
  })
}

export function useResetAllData() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => resetAllData(),
    onSuccess: () => invalidateAllPersistedData(queryClient),
  })
}
