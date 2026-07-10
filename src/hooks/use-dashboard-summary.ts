import { useQuery } from '@tanstack/react-query'
import { loadDashboardSummary } from '@/services/dashboard'
import { queryKeys } from '@/lib/query-keys'

export function useDashboardSummary() {
  return useQuery({
    queryKey: queryKeys.dashboardSummary(),
    queryFn: () => loadDashboardSummary(),
  })
}
