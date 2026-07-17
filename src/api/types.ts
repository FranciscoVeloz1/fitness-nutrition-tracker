export type UserRole = 'READ_ONLY' | 'ADMIN'

/** Identity returned by login (no role — clients must call /me). */
export type LoginUser = {
  id: string
  email: string
  name: string
}

/** Full user from GET /auth/me, including global role. */
export type AuthUser = {
  id: string
  email: string
  name: string
  role: UserRole
}

export type LoginRequest = {
  email: string
  password: string
}

export type LoginResponse = {
  user: LoginUser
  accessToken: string
  refreshToken: string
}

export type RefreshRequest = {
  refreshToken: string
}

export type RefreshResponse = {
  accessToken: string
  refreshToken: string
}

export type MeResponse = {
  user: AuthUser
}

export type ApiErrorBody = {
  error: string
  message: string
  details?: unknown
}
