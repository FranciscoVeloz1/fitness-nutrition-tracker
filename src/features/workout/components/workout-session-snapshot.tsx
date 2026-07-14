import { Badge } from '@/components/ui/badge'
import { CATEGORY_LABELS, INTENSITY_LABELS } from '@/types/workout'
import type { WorkoutEntry } from '@/types/workout'

export function WorkoutSessionSnapshot({ workout }: { workout: WorkoutEntry }) {
  const title = workout.dayName ?? workout.type

  return (
    <div className="glass-panel space-y-4 rounded-2xl p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-muted-foreground text-xs uppercase tracking-wide">Sesión registrada</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">{title}</h2>
        </div>
        <Badge variant={workout.completed ? 'default' : 'secondary'}>
          {workout.completed ? 'Completado' : 'No completado'}
        </Badge>
      </div>

      <div className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 text-sm">
        <span>{CATEGORY_LABELS[workout.category]}</span>
        <span>{workout.durationMinutes} min</span>
        <span>{INTENSITY_LABELS[workout.intensity]}</span>
      </div>

      {workout.exercises && workout.exercises.length > 0 ? (
        <ul className="space-y-2">
          {workout.exercises.map((exercise, index) => {
            return (
              <li
                key={`${exercise.name}-${index}`}
                className="flex items-baseline justify-between gap-3 border-b border-border/50 py-2 last:border-0"
              >
                <span className="font-medium">{exercise.name}</span>
                <span className="text-muted-foreground text-sm tabular-nums">
                  {exercise.sets} × {exercise.reps}
                </span>
              </li>
            )
          })}
        </ul>
      ) : null}

      {workout.notes ? <p className="text-muted-foreground text-sm">{workout.notes}</p> : null}
    </div>
  )
}
