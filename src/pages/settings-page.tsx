import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { LogOut } from 'lucide-react'
import { SectionHeader } from '@/components/common/section-header'
import { CardSkeleton } from '@/components/common/loading-skeletons'
import { ErrorState } from '@/components/common/error-state'
import { MealTemplatesForm } from '@/features/settings/components/meal-templates-form'
import { GoalAndUnitsForm } from '@/features/settings/components/goal-and-units-form'
import { ThemeSettingsCard } from '@/features/settings/components/theme-settings-card'
import { DataManagementCard } from '@/features/settings/components/data-management-card'
import { useSettings } from '@/hooks/use-settings'
import { useAuth } from '@/auth/AuthProvider'
import { queryClient } from '@/lib/query-client'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/routes/paths'

export default function SettingsPage() {
  const { data: settings, isPending, isError, error, refetch } = useSettings()
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async (): Promise<void> => {
    try {
      await logout()
      queryClient.clear()
      navigate(ROUTES.login, { replace: true })
    } catch {
      toast.error('Error al cerrar sesión')
    }
  }

  return (
    <div className="space-y-8">
      <SectionHeader title="Configuración" description="Configura tu plan de comidas, tus metas, las unidades y los datos de la app." />

      {isPending ? <CardSkeleton /> : null}
      {isError ? (
        <ErrorState message={error instanceof Error ? error.message : undefined} onRetry={() => void refetch()} />
      ) : null}

      {settings ? (
        <>
          <section className="space-y-3">
            <SectionHeader title="Plan de comidas" description="Nombres y horarios de tus 5 comidas diarias." />
            <MealTemplatesForm mealTemplates={settings.mealTemplates} />
          </section>

          <section className="space-y-3">
            <SectionHeader title="Metas y unidades" />
            <GoalAndUnitsForm settings={settings} />
          </section>

          <section className="space-y-3">
            <SectionHeader title="Apariencia" />
            <ThemeSettingsCard />
          </section>

          <section className="space-y-3">
            <SectionHeader title="Tus datos" description="Los datos se almacenan en la nube. Restablece la configuración a los valores predeterminados si es necesario." />
            <DataManagementCard />
          </section>

          <section className="space-y-3">
            <SectionHeader title="Cuenta" description="Cierra sesión para salir de la aplicación." />
            <Button variant="destructive" onClick={() => void handleLogout()}>
              <LogOut className="size-4" />
              Cerrar sesión
            </Button>
          </section>
        </>
      ) : null}
    </div>
  )
}
