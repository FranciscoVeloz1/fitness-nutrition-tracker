import { toast } from 'sonner'
import { SectionHeader } from '@/components/common/section-header'
import { DateNavigator } from '@/components/common/date-navigator'
import { CardSkeleton, StatCardGridSkeleton } from '@/components/common/loading-skeletons'
import { ErrorState } from '@/components/common/error-state'
import { ReadOnlyNotice } from '@/components/common/read-only-notice'
import { WeightForm } from '@/features/weight/components/weight-form'
import { WeightChart } from '@/features/weight/components/weight-chart'
import { WeightSummaryCards } from '@/features/weight/components/weight-summary-cards'
import { useAuth } from '@/auth/AuthProvider'
import { useDailyRecord } from '@/hooks/use-daily-record'
import { useDailyRecordsRange } from '@/hooks/use-daily-records-range'
import { useUpdateWeight } from '@/hooks/use-weight-mutations'
import { useSettings } from '@/hooks/use-settings'
import { useUiStore } from '@/state/ui-store'
import { buildWeightSeries, computeWeightSummary } from '@/services/statistics'
import { shiftDateKey, todayKey } from '@/services/date'
import type { WeightEntry } from '@/types/weight'

const CHART_WINDOW_DAYS = 90

export default function WeightPage() {
  const selectedDate = useUiStore((state) => state.selectedDate)
  const setSelectedDate = useUiStore((state) => state.setSelectedDate)
  const { canMutateFitness } = useAuth()

  const { data: settings } = useSettings()
  const { data: record, isPending, isError, error, refetch } = useDailyRecord(selectedDate)
  const rangeStart = shiftDateKey(todayKey(), -(CHART_WINDOW_DAYS - 1))
  const { data: rangeRecords, isPending: isRangePending } = useDailyRecordsRange(rangeStart, todayKey())
  const updateWeight = useUpdateWeight()

  const handleSubmit = (entry: WeightEntry) => {
    if (!canMutateFitness) return
    updateWeight.mutate(
      { date: selectedDate, weight: entry },
      {
        onSuccess: () => toast.success('Peso registrado'),
        onError: (mutationError) => toast.error('No se pudo guardar el peso', { description: mutationError.message }),
      },
    )
  }

  const unit = settings?.weightUnit ?? 'kg'
  const series = rangeRecords ? buildWeightSeries(rangeRecords) : []
  const summary = computeWeightSummary(series, settings?.goalWeightKg)

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Seguimiento de peso"
        description="Registra tu peso diario y observa tu tendencia a lo largo del tiempo."
        action={<DateNavigator date={selectedDate} onChange={setSelectedDate} />}
      />

      {!canMutateFitness ? <ReadOnlyNotice /> : null}

      {isRangePending ? <StatCardGridSkeleton count={4} /> : <WeightSummaryCards summary={summary} unit={unit} />}

      {isRangePending ? <CardSkeleton /> : <WeightChart series={series} unit={unit} goalWeightKg={settings?.goalWeightKg} />}

      {isPending ? <CardSkeleton /> : null}
      {isError ? (
        <ErrorState message={error instanceof Error ? error.message : undefined} onRetry={() => void refetch()} />
      ) : null}
      {record ? (
        <WeightForm
          unit={unit}
          defaultValues={record.weight}
          readOnly={!canMutateFitness}
          isSaving={updateWeight.isPending}
          onSubmit={handleSubmit}
        />
      ) : null}
    </div>
  )
}
