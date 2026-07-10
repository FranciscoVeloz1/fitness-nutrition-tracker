import { useState } from 'react'
import { toast } from 'sonner'
import { Dumbbell, Scale, StickyNote, CalendarX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { MealStatusBadge } from '@/features/meals/components/meal-status-badge'
import { EmptyState } from '@/components/common/empty-state'
import { ProgressRing } from '@/components/common/progress-ring'
import { useUpdateDayNotes } from '@/hooks/use-weight-mutations'
import { computeAdherence } from '@/services/adherence'
import { kgToDisplay, weightUnitLabel } from '@/services/units'
import { formatDisplayDate } from '@/services/date'
import type { DailyRecord } from '@/types/daily-record'
import type { WeightUnit } from '@/types/common'

interface DayDetailPanelProps {
  date: string
  record: DailyRecord | undefined
  unit: WeightUnit
}

export function DayDetailPanel({ date, record, unit }: DayDetailPanelProps) {
  const [notesDraft, setNotesDraft] = useState(record?.notes ?? '')
  const updateNotes = useUpdateDayNotes()

  if (!record) {
    return (
      <div className="space-y-3">
        <p className="text-muted-foreground text-sm">{formatDisplayDate(date)}</p>
        <EmptyState icon={CalendarX} title="Nothing logged" description="No meals, workout, or weight recorded for this day." />
      </div>
    )
  }

  const adherence = computeAdherence(record.date, record.meals)

  const handleSaveNotes = (): void => {
    updateNotes.mutate(
      { date, notes: notesDraft },
      {
        onSuccess: () => toast.success('Notes saved'),
        onError: (error) => toast.error('Could not save notes', { description: error.message }),
      },
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">{formatDisplayDate(date)}</p>
        <ProgressRing value={adherence.adherencePct} size={56} strokeWidth={6} />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Meals</p>
        <div className="space-y-1.5">
          {record.meals.map((meal) => (
            <div key={meal.slot} className="flex items-center justify-between rounded-xl border px-3 py-2 text-sm">
              <span>{meal.name}</span>
              <MealStatusBadge status={meal.status} />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border p-3">
          <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <Dumbbell className="size-3.5" /> Workout
          </p>
          <p className="mt-1 text-sm font-medium">
            {record.workout ? (record.workout.completed ? record.workout.type : 'Rest day') : 'Not logged'}
          </p>
        </div>
        <div className="rounded-xl border p-3">
          <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <Scale className="size-3.5" /> Weight
          </p>
          <p className="mt-1 text-sm font-medium">
            {record.weight ? `${kgToDisplay(record.weight.weightKg, unit)} ${weightUnitLabel(unit)}` : 'Not logged'}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="flex items-center gap-1.5 text-sm font-medium">
          <StickyNote className="size-3.5" /> Notes
        </p>
        <Textarea
          rows={3}
          value={notesDraft}
          onChange={(event) => setNotesDraft(event.target.value)}
          placeholder="Anything worth remembering about this day"
        />
        <Button size="sm" variant="outline" onClick={handleSaveNotes} disabled={updateNotes.isPending}>
          {updateNotes.isPending ? 'Saving…' : 'Save notes'}
        </Button>
      </div>
    </div>
  )
}
