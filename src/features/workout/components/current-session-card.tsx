import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { INTENSITY_LABELS, WORKOUT_INTENSITIES } from '@/types/workout'
import type { WorkoutIntensity } from '@/types/workout'
import type { WorkoutProgramDay } from '@/types/workout-program'

interface CurrentSessionCardProps {
  day: WorkoutProgramDay
  dayIndex: number
  dayCount: number
  completedToday: boolean
  isCompleting: boolean
  durationMinutes: number
  intensity: WorkoutIntensity
  notes: string
  onDurationChange: (value: number) => void
  onIntensityChange: (value: WorkoutIntensity) => void
  onNotesChange: (value: string) => void
  onCompleteChange: (completed: boolean) => void
}

export function CurrentSessionCard(props: CurrentSessionCardProps) {
  const {
    day,
    dayIndex,
    dayCount,
    completedToday,
    isCompleting,
    durationMinutes,
    intensity,
    notes,
    onDurationChange,
    onIntensityChange,
    onNotesChange,
    onCompleteChange,
  } = props

  return (
    <div className="glass-panel space-y-5 rounded-2xl p-5">
      <div>
        <p className="text-muted-foreground text-xs uppercase tracking-wide">
          Día {dayIndex + 1} de {dayCount}
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">{day.name}</h2>
        {day.isRest ? (
          <p className="text-muted-foreground mt-2 text-sm">
            Día de descanso — márcalo completado para avanzar
          </p>
        ) : null}
      </div>

      {!day.isRest && day.exercises.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Sin ejercicios configurados. Edítalos en Ajustes.
        </p>
      ) : null}

      {!day.isRest && day.exercises.length > 0 ? (
        <ul className="space-y-2">
          {day.exercises.map((exercise) => {
            return (
              <li
                key={exercise.id}
                className="flex items-baseline justify-between gap-3 border-b border-border/50 py-2 last:border-0"
              >
                <div className="min-w-0">
                  <span className="font-medium">{exercise.name}</span>
                  {exercise.notes ? (
                    <p className="text-muted-foreground text-xs">{exercise.notes}</p>
                  ) : null}
                </div>
                <span className="text-muted-foreground shrink-0 text-sm tabular-nums">
                  {exercise.sets} × {exercise.reps}
                </span>
              </li>
            )
          })}
        </ul>
      ) : null}

      <div className="flex items-center justify-between rounded-xl border p-3">
        <div>
          <Label htmlFor="complete-workout" className="font-medium">
            Completé el entrenamiento
          </Label>
          <p className="text-muted-foreground text-xs">
            Avanza al siguiente día del programa al marcar como completado.
          </p>
        </div>
        <Switch
          id="complete-workout"
          checked={completedToday}
          disabled={isCompleting || completedToday}
          onCheckedChange={(checked) => {
            onCompleteChange(checked)
          }}
        />
      </div>

      <details className="rounded-xl border p-3">
        <summary className="cursor-pointer text-sm font-medium">Detalles</summary>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="duration-minutes">Duración (min)</Label>
            <Input
              id="duration-minutes"
              type="number"
              min={0}
              value={durationMinutes}
              disabled={completedToday || isCompleting}
              onChange={(event) => {
                onDurationChange(Number(event.target.value) || 0)
              }}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Intensidad</Label>
            <Select
              value={intensity}
              disabled={completedToday || isCompleting}
              onValueChange={(value) => {
                onIntensityChange(value as WorkoutIntensity)
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {WORKOUT_INTENSITIES.map((level) => {
                  return (
                    <SelectItem key={level} value={level}>
                      {INTENSITY_LABELS[level]}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="session-notes">Notas</Label>
            <Textarea
              id="session-notes"
              rows={2}
              value={notes}
              disabled={completedToday || isCompleting}
              onChange={(event) => {
                onNotesChange(event.target.value)
              }}
            />
          </div>
        </div>
      </details>
    </div>
  )
}
