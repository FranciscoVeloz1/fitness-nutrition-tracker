import { openDB, type IDBPDatabase } from 'idb'
import type { StorageAdapter } from '@/storage/storage-adapter'
import { toStorageError } from '@/storage/storage-error'

const DB_NAME = 'fittrack-db'
const DB_VERSION = 1
const STORE_NAME = 'kv'

function openDatabase(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    },
  })
}

export class IndexedDbAdapter implements StorageAdapter {
  readonly name = 'indexeddb'
  private readonly dbPromise: Promise<IDBPDatabase>

  constructor() {
    this.dbPromise = openDatabase()
  }

  async get<T>(key: string): Promise<T | undefined> {
    try {
      const db = await this.dbPromise
      return (await db.get(STORE_NAME, key)) as T | undefined
    } catch (error) {
      throw toStorageError('READ_FAILED', `Error al leer "${key}" de IndexedDB`, error)
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      const db = await this.dbPromise
      await db.put(STORE_NAME, value, key)
    } catch (error) {
      throw toStorageError('WRITE_FAILED', `Error al escribir "${key}" en IndexedDB`, error)
    }
  }

  async delete(key: string): Promise<void> {
    try {
      const db = await this.dbPromise
      await db.delete(STORE_NAME, key)
    } catch (error) {
      throw toStorageError('DELETE_FAILED', `Error al eliminar "${key}" de IndexedDB`, error)
    }
  }

  async keys(prefix?: string): Promise<string[]> {
    try {
      const db = await this.dbPromise
      const allKeys = (await db.getAllKeys(STORE_NAME)) as string[]
      return prefix ? allKeys.filter((key) => key.startsWith(prefix)) : allKeys
    } catch (error) {
      throw toStorageError('READ_FAILED', 'Error al listar las claves de IndexedDB', error)
    }
  }

  async clear(): Promise<void> {
    try {
      const db = await this.dbPromise
      await db.clear(STORE_NAME)
    } catch (error) {
      throw toStorageError('DELETE_FAILED', 'Error al vaciar el almacén de IndexedDB', error)
    }
  }
}

/** Cheap capability probe used by the storage provider before committing to this adapter. */
export async function isIndexedDbAvailable(): Promise<boolean> {
  if (typeof indexedDB === 'undefined') {
    return false
  }
  try {
    const db = await openDatabase()
    db.close()
    return true
  } catch {
    return false
  }
}
