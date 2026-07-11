import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LoginForm } from '@/features/auth/components/login-form'
import { useAuth } from '@/auth/AuthProvider'
import { ROUTES } from '@/routes/paths'

type LocationState = { from?: Location } | null

export default function LoginPage() {
  const { status } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as LocationState
  const from = state?.from?.pathname ?? ROUTES.dashboard

  useEffect(() => {
    if (status === 'authenticated') {
      navigate(from, { replace: true })
    }
  }, [status, navigate, from])

  const handleSuccess = (): void => {
    navigate(from, { replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight">FitTrack</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Accede a tu historial de nutrición y entrenamiento
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-6">
          <LoginForm onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  )
}
