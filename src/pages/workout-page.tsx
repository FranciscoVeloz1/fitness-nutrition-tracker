import { toast } from 'sonner'
import { SectionHeader } from '@/components/common/section-header'
import { DateNavigator } from '@/components/common/date-navigator'
import { CardSkeleton } from '@/components/common/loading-skeletons'
import { ErrorState } from '@/components/common/error-state'
import { WorkoutForm, type WorkoutFormValues } from '@/features/workout/components/workout-form'
import { WorkoutStats } from '@/features/workout/components/workout-stats'
import { useDailyRecord } from '@/hooks/use-daily-record'
import { useDailyRecordsRange } from '@/hooks/use-daily-records-range'
import { useUpdateWorkout } from '@/hooks/use-workout-mutations'
import { useUiStore } from '@/state/ui-store'
import { computeWorkoutSummary } from '@/services/statistics'
import { shiftDateKey, todayKey } from '@/services/date'

const STATS_WINDOW_DAYS = 30

export default function WorkoutPage() {
  const selectedDate = useUiStore((state) => state.selectedDate)
  const setSelectedDate = useUiStore((state) => state.setSelectedDate)

  const { data: record, isPending, isError, error, refetch } = useDailyRecord(selectedDate)
  const rangeStart = shiftDateKey(todayKey(), -(STATS_WINDOW_DAYS - 1))
  const { data: rangeRecords } = useDailyRecordsRange(rangeStart, todayKey())
  const updateWorkout = useUpdateWorkout()

  const handleSubmit = (values: WorkoutFormValues) => {
    updateWorkout.mutate(
      { date: selectedDate, workout: values },
      {
        onSuccess: () => toast.success('Workout saved'),
        onError: (mutationError) => toast.error('Could not save workout', { description: mutationError.message }),
      },
    )
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Workout"
        description="Log today's training session and track consistency over time."
        action={<DateNavigator date={selectedDate} onChange={setSelectedDate} />}
      />

      {isPending ? <CardSkeleton /> : null}

      {isError ? (
        <ErrorState message={error instanceof Error ? error.message : undefined} onRetry={() => void refetch()} />
      ) : null}

      {record ? (
        <WorkoutForm defaultValues={record.workout} isSaving={updateWorkout.isPending} onSubmit={handleSubmit} />
      ) : null}

      {rangeRecords ? <WorkoutStats summary={computeWorkoutSummary(rangeRecords)} /> : null}
    </div>
  )
}
