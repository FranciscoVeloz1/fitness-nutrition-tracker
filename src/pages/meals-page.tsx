import { toast } from 'sonner'
import { SectionHeader } from '@/components/common/section-header'
import { DateNavigator } from '@/components/common/date-navigator'
import { ListSkeleton } from '@/components/common/loading-skeletons'
import { ErrorState } from '@/components/common/error-state'
import { MealCard } from '@/features/meals/components/meal-card'
import { AdherenceSummary } from '@/features/meals/components/adherence-summary'
import type { MealLogFormValues } from '@/features/meals/components/meal-log-dialog'
import { useDailyRecord } from '@/hooks/use-daily-record'
import { useUpdateMeal } from '@/hooks/use-meal-mutations'
import { useUiStore } from '@/state/ui-store'
import { computeAdherence } from '@/services/adherence'
import type { MealSlot } from '@/types/meal'

export default function MealsPage() {
  const selectedDate = useUiStore((state) => state.selectedDate)
  const setSelectedDate = useUiStore((state) => state.setSelectedDate)

  const { data: record, isPending, isError, error, refetch } = useDailyRecord(selectedDate)
  const updateMeal = useUpdateMeal()

  const handleFollowed = (slot: MealSlot) => {
    updateMeal.mutate(
      { date: selectedDate, slot, status: 'followed' },
      {
        onError: (mutationError) => {
          toast.error('Could not update meal', { description: mutationError.message })
        },
      },
    )
  }

  const handleLogDetails = (slot: MealSlot, values: MealLogFormValues) => {
    updateMeal.mutate(
      { date: selectedDate, slot, ...values },
      {
        onSuccess: () => toast.success('Meal updated'),
        onError: (mutationError) => {
          toast.error('Could not update meal', { description: mutationError.message })
        },
      },
    )
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Daily Meals"
        description="Log how closely you followed each planned meal."
        action={<DateNavigator date={selectedDate} onChange={setSelectedDate} />}
      />

      {isPending ? <ListSkeleton count={5} /> : null}

      {isError ? (
        <ErrorState message={error instanceof Error ? error.message : undefined} onRetry={() => void refetch()} />
      ) : null}

      {record ? (
        <div className="space-y-4">
          <AdherenceSummary stat={computeAdherence(record.date, record.meals)} />

          <div className="space-y-3">
            {record.meals.map((meal) => (
              <MealCard
                key={meal.slot}
                meal={meal}
                isSaving={updateMeal.isPending}
                onFollowed={() => handleFollowed(meal.slot)}
                onLogDetails={(values) => handleLogDetails(meal.slot, values)}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
