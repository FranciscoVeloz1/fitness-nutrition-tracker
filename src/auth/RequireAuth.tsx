import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './AuthProvider'
import { ROUTES } from '@/routes/paths'
import { CardSkeleton } from '@/components/common/loading-skeletons'

export function RequireAuth() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'bootstrapping') {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-sm space-y-3">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    )
  }

  if (status === 'anonymous') {
    return <Navigate to={ROUTES.login} replace state={{ from: location }} />
  }

  return <Outlet />
}
