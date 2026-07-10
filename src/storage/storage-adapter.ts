/**
 * Minimal key-value contract every persistence backend must satisfy.
 *
 * This is the seam that lets the app run on IndexedDB today, fall back to
 * localStorage when IndexedDB is unavailable, and later be swapped for a
 * remote-API-backed adapter without touching a single repository or
 * component. Every method is async on purpose, even the localStorage
 * implementation, so callers never depend on synchronous storage semantics.
 */
export interface StorageAdapter {
  readonly name: string
  get<T>(key: string): Promise<T | undefined>
  set<T>(key: string, value: T): Promise<void>
  delete(key: string): Promise<void>
  /** Returns all stored keys, optionally filtered to those starting with `prefix`. */
  keys(prefix?: string): Promise<string[]>
  clear(): Promise<void>
}
