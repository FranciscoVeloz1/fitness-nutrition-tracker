import { QueryClient } from '@tanstack/react-query'

/**
 * All data in this app lives on-device, so there is no remote latency to
 * hide and no server truth to reconcile with — mutations invalidate the
 * exact queries they affect instead of relying on background refetching.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})
