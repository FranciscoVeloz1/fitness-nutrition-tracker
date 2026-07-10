import { useSyncExternalStore } from 'react'

function subscribe(query: string, onStoreChange: () => void): () => void {
  const mediaQueryList = window.matchMedia(query)
  mediaQueryList.addEventListener('change', onStoreChange)
  return () => {
    mediaQueryList.removeEventListener('change', onStoreChange)
  }
}

/** Subscribes to a CSS media query and returns whether it currently matches. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onStoreChange) => subscribe(query, onStoreChange),
    () => window.matchMedia(query).matches,
  )
}

export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)')
}
