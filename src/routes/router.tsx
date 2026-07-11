import { lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AppShell } from '@/components/layout/app-shell'
import { RequireAuth } from '@/auth/RequireAuth'
import { ROUTES } from '@/routes/paths'

const LoginPage = lazy(() => import('@/pages/login-page'))
const DashboardPage = lazy(() => import('@/pages/dashboard-page'))
const MealsPage = lazy(() => import('@/pages/meals-page'))
const WorkoutPage = lazy(() => import('@/pages/workout-page'))
const WeightPage = lazy(() => import('@/pages/weight-page'))
const HistoryPage = lazy(() => import('@/pages/history-page'))
const AnalyticsPage = lazy(() => import('@/pages/analytics-page'))
const SettingsPage = lazy(() => import('@/pages/settings-page'))
const NotFoundPage = lazy(() => import('@/pages/not-found-page'))

/** Route tree. `AppShell` renders its matched child through `useOutlet()`. */
export function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.login} element={<LoginPage />} />
      <Route element={<RequireAuth />}>
        <Route element={<AppShell />}>
          <Route path={ROUTES.dashboard} element={<DashboardPage />} />
          <Route path={ROUTES.meals} element={<MealsPage />} />
          <Route path={ROUTES.workout} element={<WorkoutPage />} />
          <Route path={ROUTES.weight} element={<WeightPage />} />
          <Route path={ROUTES.history} element={<HistoryPage />} />
          <Route path={ROUTES.analytics} element={<AnalyticsPage />} />
          <Route path={ROUTES.settings} element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
