import type { StorageAdapter } from '@/storage/storage-adapter'
import { IndexedDbAdapter, isIndexedDbAvailable } from '@/storage/indexed-db-adapter'
import { LocalStorageAdapter, isLocalStorageAvailable } from '@/storage/local-storage-adapter'
import { StorageError } from '@/storage/storage-error'

let adapterPromise: Promise<StorageAdapter> | undefined

async function resolveAdapter(): Promise<StorageAdapter> {
  if (await isIndexedDbAvailable()) {
    return new IndexedDbAdapter()
  }
  if (isLocalStorageAvailable()) {
    return new LocalStorageAdapter()
  }
  throw new StorageError(
    'UNAVAILABLE',
    'No storage backend is available in this environment (IndexedDB and localStorage both failed).',
  )
}

/**
 * Lazily resolves and memoizes the best available storage adapter. All
 * repositories should go through this instead of instantiating adapters
 * directly, so the whole app shares one backend decision and one DB
 * connection.
 */
export function getStorageAdapter(): Promise<StorageAdapter> {
  if (!adapterPromise) {
    adapterPromise = resolveAdapter()
  }
  return adapterPromise
}

/** Test-only escape hatch to force re-resolution of the adapter. */
export function resetStorageAdapterForTesting(): void {
  adapterPromise = undefined
}
