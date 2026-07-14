import { useState } from 'react'
import { toast } from 'sonner'
import { SectionHeader } from '@/components/common/section-header'
import { DateNavigator } from '@/components/common/date-navigator'
import { CardSkeleton } from '@/components/common/loading-skeletons'
import { ErrorState } from '@/components/common/error-state'
import { CurrentSessionCard } from '@/features/workout/components/current-session-card'
import { WorkoutSessionSnapshot } from '@/features/workout/components/workout-session-snapshot'
import { WorkoutStats } from '@/features/workout/components/workout-stats'
import { useDailyRecord } from '@/hooks/use-daily-record'
import { useDailyRecordsRange } from '@/hooks/use-daily-records-range'
import {
  useCompleteWorkoutSession,
  useCurrentWorkoutSession,
  useWorkoutProgram,
} from '@/hooks/use-workout-program'
import { useUiStore } from '@/state/ui-store'
import { computeWorkoutSummary } from '@/services/statistics'
import { shiftDateKey, todayKey } from '@/services/date'
import type { WorkoutIntensity } from '@/types/workout'

const STATS_WINDOW_DAYS = 30

export default function WorkoutPage() {
  const selectedDate = useUiStore((state) => state.selectedDate)
  const setSelectedDate = useUiStore((state) => state.setSelectedDate)
  const today = todayKey()
  const isToday = selectedDate === today

  const currentQuery = useCurrentWorkoutSession()
  const recordQuery = useDailyRecord(selectedDate)
  const rangeStart = shiftDateKey(today, -(STATS_WINDOW_DAYS - 1))
  const rangeQuery = useDailyRecordsRange(rangeStart, today)
  const programQuery = useWorkoutProgram()
  const completeSession = useCompleteWorkoutSession()

  const [durationMinutes, setDurationMinutes] = useState(45)
  const [intensity, setIntensity] = useState<WorkoutIntensity>('moderate')
  const [notes, setNotes] = useState('')

  const handleCompleteChange = (completed: boolean): void => {
    if (!completed) {
      toast.message('El progreso del programa no retrocede al desmarcar')
      return
    }

    completeSession.mutate(
      {
        date: today,
        durationMinutes,
        intensity,
        notes: notes.trim() ? notes.trim() : undefined,
      },
      {
        onSuccess: () => {
          toast.success('Entrenamiento completado — siguiente rutina lista')
        },
        onError: (error) => {
          const message = error instanceof Error ? error.message : 'Error desconocido'
          toast.error('No se pudo completar el entrenamiento', { description: message })
        },
      },
    )
  }

  const completedToday = Boolean(recordQuery.data?.workout?.completed) && isToday

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Entrenamiento"
        description="Sigue la rutina del día y márcala cuando la completes."
        action={<DateNavigator date={selectedDate} onChange={setSelectedDate} />}
      />

      {(currentQuery.isPending || recordQuery.isPending) && isToday ? <CardSkeleton /> : null}
      {isToday && currentQuery.isError ? (
        <ErrorState
          message={currentQuery.error instanceof Error ? currentQuery.error.message : undefined}
          onRetry={() => {
            void currentQuery.refetch()
          }}
        />
      ) : null}

      {isToday && currentQuery.data && programQuery.data ? (
        <CurrentSessionCard
          day={currentQuery.data.day}
          dayIndex={currentQuery.data.dayIndex}
          dayCount={programQuery.data.days.length}
          completedToday={completedToday}
          isCompleting={completeSession.isPending}
          durationMinutes={durationMinutes}
          intensity={intensity}
          notes={notes}
          onDurationChange={setDurationMinutes}
          onIntensityChange={setIntensity}
          onNotesChange={setNotes}
          onCompleteChange={handleCompleteChange}
        />
      ) : null}

      {!isToday ? (
        recordQuery.isPending ? (
          <CardSkeleton />
        ) : recordQuery.data?.workout ? (
          <WorkoutSessionSnapshot workout={recordQuery.data.workout} />
        ) : (
          <p className="text-muted-foreground text-sm">Sin entrenamiento registrado este día.</p>
        )
      ) : null}

      {rangeQuery.data ? <WorkoutStats summary={computeWorkoutSummary(rangeQuery.data)} /> : null}
    </div>
  )
}
