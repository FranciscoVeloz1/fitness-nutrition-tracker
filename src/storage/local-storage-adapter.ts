import type { StorageAdapter } from '@/storage/storage-adapter'
import { toStorageError } from '@/storage/storage-error'

const NAMESPACE = 'fittrack:'

/**
 * Fallback adapter for browsers/contexts without IndexedDB (Safari private
 * mode in some versions, restrictive embedded webviews, older browsers).
 * Namespaces every key so the app can coexist with other localStorage usage.
 */
export class LocalStorageAdapter implements StorageAdapter {
  readonly name = 'localstorage'

  async get<T>(key: string): Promise<T | undefined> {
    try {
      const raw = localStorage.getItem(NAMESPACE + key)
      return raw === null ? undefined : (JSON.parse(raw) as T)
    } catch (error) {
      throw toStorageError('READ_FAILED', `Failed to read "${key}" from localStorage`, error)
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      localStorage.setItem(NAMESPACE + key, JSON.stringify(value))
    } catch (error) {
      throw toStorageError('WRITE_FAILED', `Failed to write "${key}" to localStorage`, error)
    }
  }

  async delete(key: string): Promise<void> {
    try {
      localStorage.removeItem(NAMESPACE + key)
    } catch (error) {
      throw toStorageError('DELETE_FAILED', `Failed to delete "${key}" from localStorage`, error)
    }
  }

  async keys(prefix?: string): Promise<string[]> {
    try {
      const matched: string[] = []
      for (let i = 0; i < localStorage.length; i += 1) {
        const rawKey = localStorage.key(i)
        if (!rawKey || !rawKey.startsWith(NAMESPACE)) {
          continue
        }
        const key = rawKey.slice(NAMESPACE.length)
        if (!prefix || key.startsWith(prefix)) {
          matched.push(key)
        }
      }
      return matched
    } catch (error) {
      throw toStorageError('READ_FAILED', 'Failed to list localStorage keys', error)
    }
  }

  async clear(): Promise<void> {
    try {
      const allKeys = await this.keys()
      for (const key of allKeys) {
        localStorage.removeItem(NAMESPACE + key)
      }
    } catch (error) {
      throw toStorageError('DELETE_FAILED', 'Failed to clear localStorage', error)
    }
  }
}

export function isLocalStorageAvailable(): boolean {
  try {
    const probeKey = `${NAMESPACE}__probe__`
    localStorage.setItem(probeKey, '1')
    localStorage.removeItem(probeKey)
    return true
  } catch {
    return false
  }
}
