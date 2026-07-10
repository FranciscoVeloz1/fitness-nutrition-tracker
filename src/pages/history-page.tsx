import { useMemo } from 'react'
import { SectionHeader } from '@/components/common/section-header'
import { Calendar } from '@/components/ui/calendar'
import { CardSkeleton } from '@/components/common/loading-skeletons'
import { ErrorState } from '@/components/common/error-state'
import { DayDetailPanel } from '@/features/history/components/day-detail-panel'
import { useDailyRecordsRange } from '@/hooks/use-daily-records-range'
import { useSettings } from '@/hooks/use-settings'
import { useUiStore } from '@/state/ui-store'
import { parseDateKey, shiftDateKey, toDateKey, todayKey } from '@/services/date'

const CALENDAR_WINDOW_DAYS = 365

export default function HistoryPage() {
  const selectedDate = useUiStore((state) => state.selectedDate)
  const setSelectedDate = useUiStore((state) => state.setSelectedDate)
  const { data: settings } = useSettings()

  const rangeStart = shiftDateKey(todayKey(), -(CALENDAR_WINDOW_DAYS - 1))
  const { data: records, isPending, isError, error, refetch } = useDailyRecordsRange(rangeStart, todayKey())

  const loggedDates = useMemo(
    () =>
      (records ?? [])
        .filter((record) => record.workout || record.weight || record.meals.some((meal) => meal.status !== 'pending'))
        .map((record) => parseDateKey(record.date)),
    [records],
  )

  const selectedRecord = records?.find((record) => record.date === selectedDate)

  return (
    <div className="space-y-6">
      <SectionHeader title="History" description="Browse any day to see what you logged." />

      {isPending ? <CardSkeleton /> : null}
      {isError ? (
        <ErrorState message={error instanceof Error ? error.message : undefined} onRetry={() => void refetch()} />
      ) : null}

      {records ? (
        <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
          <div className="glass-panel w-fit rounded-2xl p-3">
            <Calendar
              mode="single"
              selected={parseDateKey(selectedDate)}
              onSelect={(date) => {
                if (date) {
                  setSelectedDate(toDateKey(date))
                }
              }}
              disabled={{ after: new Date() }}
              modifiers={{ logged: loggedDates }}
              modifiersClassNames={{
                logged:
                  'relative after:absolute after:bottom-1 after:left-1/2 after:size-1 after:-translate-x-1/2 after:rounded-full after:bg-primary',
              }}
            />
          </div>

          <div className="glass-panel rounded-2xl p-5">
            <DayDetailPanel date={selectedDate} record={selectedRecord} unit={settings?.weightUnit ?? 'kg'} />
          </div>
        </div>
      ) : null}
    </div>
  )
}
