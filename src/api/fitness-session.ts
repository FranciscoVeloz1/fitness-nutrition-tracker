import type { RequestOptions } from './http'

export type AuthorizedRequest = <T>(path: string, options?: Omit<RequestOptions, 'accessToken'>) => Promise<T>

export type FitnessApiSession = {
  userId: string
  request: AuthorizedRequest
}

let session: FitnessApiSession | null = null

export function setFitnessApiSession(next: FitnessApiSession | null): void {
  session = next
}

export function requireFitnessApiSession(): FitnessApiSession {
  if (!session) {
    throw new Error('Fitness API session is not available. User must be authenticated.')
  }
  return session
}
