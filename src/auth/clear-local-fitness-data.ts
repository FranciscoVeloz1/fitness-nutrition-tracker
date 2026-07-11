const FITTRACK_DB_NAME = 'fittrack-db'
const FITTRACK_KEY_PREFIX = 'fittrack:'
const AUTH_KEY = 'fittrack:auth:v1'
const THEME_KEY = 'fittrack-theme'

export async function clearLocalFitnessDomainData(): Promise<void> {
  await deleteIndexedDb(FITTRACK_DB_NAME)
  clearFitrackLocalStorageKeys()
}

function deleteIndexedDb(name: string): Promise<void> {
  return new Promise((resolve) => {
    const request = indexedDB.deleteDatabase(name)

    request.onsuccess = () => {
      resolve()
    }

    request.onerror = () => {
      resolve()
    }

    request.onblocked = () => {
      resolve()
    }
  })
}

function clearFitrackLocalStorageKeys(): void {
  try {
    const keysToRemove: string[] = []

    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i)
      if (key === null) {
        continue
      }

      if (key === AUTH_KEY || key === THEME_KEY) {
        continue
      }

      if (key.startsWith(FITTRACK_KEY_PREFIX)) {
        keysToRemove.push(key)
      }
    }

    for (const key of keysToRemove) {
      window.localStorage.removeItem(key)
    }
  } catch {
    // Ignore storage failures.
  }
}
