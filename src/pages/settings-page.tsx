import { SectionHeader } from '@/components/common/section-header'
import { CardSkeleton } from '@/components/common/loading-skeletons'
import { ErrorState } from '@/components/common/error-state'
import { MealTemplatesForm } from '@/features/settings/components/meal-templates-form'
import { GoalAndUnitsForm } from '@/features/settings/components/goal-and-units-form'
import { ThemeSettingsCard } from '@/features/settings/components/theme-settings-card'
import { DataManagementCard } from '@/features/settings/components/data-management-card'
import { useSettings } from '@/hooks/use-settings'

export default function SettingsPage() {
  const { data: settings, isPending, isError, error, refetch } = useSettings()

  return (
    <div className="space-y-8">
      <SectionHeader title="Settings" description="Configure your meal plan, goals, units, and app data." />

      {isPending ? <CardSkeleton /> : null}
      {isError ? (
        <ErrorState message={error instanceof Error ? error.message : undefined} onRetry={() => void refetch()} />
      ) : null}

      {settings ? (
        <>
          <section className="space-y-3">
            <SectionHeader title="Meal plan" description="Names and scheduled times for your 5 daily meals." />
            <MealTemplatesForm mealTemplates={settings.mealTemplates} />
          </section>

          <section className="space-y-3">
            <SectionHeader title="Goals & units" />
            <GoalAndUnitsForm settings={settings} />
          </section>

          <section className="space-y-3">
            <SectionHeader title="Appearance" />
            <ThemeSettingsCard />
          </section>

          <section className="space-y-3">
            <SectionHeader title="Your data" description="Everything is stored on this device." />
            <DataManagementCard />
          </section>
        </>
      ) : null}
    </div>
  )
}
