export type UserRole = 'READ_ONLY' | 'ADMIN'

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
  user: AuthUser
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
