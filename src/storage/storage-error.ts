/**
 * Typed error for every failure surfaced by the storage layer. Callers can
 * narrow on `.code` instead of parsing message strings, and UI layers can
 * map codes to user-facing copy.
 */
export type StorageErrorCode =
  | 'UNAVAILABLE'
  | 'READ_FAILED'
  | 'WRITE_FAILED'
  | 'DELETE_FAILED'
  | 'INVALID_DATA'

export class StorageError extends Error {
  readonly code: StorageErrorCode
  readonly cause?: unknown

  constructor(code: StorageErrorCode, message: string, cause?: unknown) {
    super(message)
    this.name = 'StorageError'
    this.code = code
    this.cause = cause
  }
}

export function toStorageError(code: StorageErrorCode, message: string, error: unknown): StorageError {
  if (error instanceof StorageError) {
    return error
  }
  return new StorageError(code, message, error)
}
