import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import * as authApi from '@/api/auth'
import { ApiError, request, type RequestOptions } from '@/api/http'
import type { AuthUser, UserRole } from '@/api/types'
import { setFitnessApiSession } from '@/api/fitness-session'
import { clearRefreshToken, readRefreshToken, writeRefreshToken } from './session-storage'
import { clearLocalFitnessDomainData } from './clear-local-fitness-data'

export type AuthStatus = 'bootstrapping' | 'authenticated' | 'anonymous'

export type AuthContextValue = {
  status: AuthStatus
  user: AuthUser | null
  role: UserRole | null
  /** Fitness mutations require ADMIN; READ_ONLY can only read self data. */
  canMutateFitness: boolean
  accessToken: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  authorizedRequest: <T>(path: string, options?: Omit<RequestOptions, 'accessToken'>) => Promise<T>
}

const AuthContext = createContext<AuthContextValue | null>(null)

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [status, setStatus] = useState<AuthStatus>('bootstrapping')
  const [user, setUser] = useState<AuthUser | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const refreshTokenRef = useRef<string | null>(null)
  const refreshInFlightRef = useRef<Promise<string> | null>(null)

  const clearSession = useCallback(() => {
    refreshTokenRef.current = null
    clearRefreshToken()
    setAccessToken(null)
    setUser(null)
    setStatus('anonymous')
    setFitnessApiSession(null)
  }, [])

  const persistTokens = useCallback((nextAccessToken: string, nextRefreshToken: string) => {
    refreshTokenRef.current = nextRefreshToken
    writeRefreshToken(nextRefreshToken)
    setAccessToken(nextAccessToken)
  }, [])

  const refreshSession = useCallback(async (): Promise<string> => {
    if (refreshInFlightRef.current) {
      return refreshInFlightRef.current
    }

    const currentRefresh = refreshTokenRef.current
    if (!currentRefresh) {
      clearSession()
      throw new ApiError(401, 'Missing refresh token', 'UNAUTHORIZED')
    }

    const pending = (async () => {
      try {
        const tokens = await authApi.refresh({ refreshToken: currentRefresh })
        persistTokens(tokens.accessToken, tokens.refreshToken)
        const meResponse = await authApi.me(tokens.accessToken)
        setUser(meResponse.user)
        setStatus('authenticated')
        return tokens.accessToken
      } catch (caught) {
        clearSession()
        throw caught
      } finally {
        refreshInFlightRef.current = null
      }
    })()

    refreshInFlightRef.current = pending
    return pending
  }, [clearSession, persistTokens])

  const authorizedRequest = useCallback(
    async <T,>(path: string, options: Omit<RequestOptions, 'accessToken'> = {}): Promise<T> => {
      const token = accessToken
      if (!token) {
        throw new ApiError(401, 'Not authenticated', 'UNAUTHORIZED')
      }

      try {
        return await request<T>(path, { ...options, accessToken: token })
      } catch (caught) {
        if (!(caught instanceof ApiError) || caught.status !== 401) {
          throw caught
        }

        const nextToken = await refreshSession()
        return request<T>(path, { ...options, accessToken: nextToken })
      }
    },
    [accessToken, refreshSession]
  )

  const bootstrap = useEffectEvent(async () => {
    const storedRefresh = readRefreshToken()
    if (!storedRefresh) {
      setStatus('anonymous')
      return
    }

    refreshTokenRef.current = storedRefresh

    try {
      await refreshSession()
    } catch {
      // refreshSession already cleared state
    }
  })

  useEffect(() => {
    let cancelled = false

    queueMicrotask(() => {
      if (!cancelled) {
        void bootstrap()
      }
    })

    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await authApi.login({ email, password })
      persistTokens(result.accessToken, result.refreshToken)
      const meResponse = await authApi.me(result.accessToken)
      setUser(meResponse.user)
      setStatus('authenticated')
      await clearLocalFitnessDomainData()
    },
    [persistTokens]
  )

  const logout = useCallback(async () => {
    const refreshToken = refreshTokenRef.current
    clearSession()
    if (refreshToken) {
      try {
        await authApi.logout(refreshToken)
      } catch {
        // Local session already cleared; ignore remote logout failures.
      }
    }
  }, [clearSession])

  useEffect(() => {
    if (status === 'authenticated' && user && accessToken) {
      setFitnessApiSession({ userId: user.id, request: authorizedRequest })
    } else if (status === 'anonymous') {
      setFitnessApiSession(null)
    }
  }, [status, user, accessToken, authorizedRequest])

  const value = useMemo<AuthContextValue>(() => {
    const role = user?.role ?? null
    return {
      status,
      user,
      role,
      canMutateFitness: role === 'ADMIN',
      accessToken,
      login,
      logout,
      authorizedRequest,
    }
  }, [status, user, accessToken, login, logout, authorizedRequest])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext)
  if (!value) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return value
}
