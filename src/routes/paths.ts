export const ROUTES = {
  login: '/login',
  dashboard: '/',
  meals: '/meals',
  workout: '/workout',
  weight: '/weight',
  history: '/history',
  analytics: '/analytics',
  settings: '/settings',
} as const

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]
