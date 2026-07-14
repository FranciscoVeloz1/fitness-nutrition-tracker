import { useEffect } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useUpdateWorkoutProgram } from '@/hooks/use-workout-program'
import { WORKOUT_CATEGORIES, CATEGORY_LABELS } from '@/types/workout'
import type { WorkoutProgram } from '@/types/workout-program'

const exerciseSchema = z.object({
  name: z.string().min(1, 'Obligatorio').max(80),
  sets: z.coerce.number().int().min(0).max(50),
  reps: z.string().min(1, 'Obligatorio').max(30),
  notes: z.string().max(200).optional(),
})

const daySchema = z
  .object({
    name: z.string().min(1, 'Obligatorio').max(60),
    isRest: z.boolean(),
    category: z.enum(WORKOUT_CATEGORIES).nullable().optional(),
    exercises: z.array(exerciseSchema),
  })
  .superRefine((day, ctx) => {
    if (!day.isRest && day.exercises.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Añade al menos un ejercicio o marca descanso',
        path: ['exercises'],
      })
    }
  })

const workoutProgramFormSchema = z.object({
  name: z.string().min(1).max(80),
  days: z.array(daySchema).min(1, 'Necesitas al menos un día'),
})

type WorkoutProgramFormInput = z.input<typeof workoutProgramFormSchema>
type WorkoutProgramFormValues = z.output<typeof workoutProgramFormSchema>

function mapProgramToForm(program: WorkoutProgram): WorkoutProgramFormValues {
  return {
    name: program.name,
    days: program.days.map((day) => {
      return {
        name: day.name,
        isRest: day.isRest,
        category: day.category,
        exercises: day.exercises.map((exercise) => {
          return {
            name: exercise.name,
            sets: exercise.sets,
            reps: exercise.reps,
            notes: exercise.notes ?? '',
          }
        }),
      }
    }),
  }
}

function moveItem<T>(items: T[], from: number, to: number): T[] {
  if (to < 0 || to >= items.length) {
    return items
  }
  const next = items.slice()
  const [item] = next.splice(from, 1)
  if (!item) {
    return items
  }
  next.splice(to, 0, item)
  return next
}

export function WorkoutProgramForm({ program }: { program: WorkoutProgram }) {
  const updateProgram = useUpdateWorkoutProgram()
  const form = useForm<WorkoutProgramFormInput, unknown, WorkoutProgramFormValues>({
    resolver: zodResolver(workoutProgramFormSchema),
    defaultValues: mapProgramToForm(program),
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'days',
  })

  useEffect(() => {
    form.reset(mapProgramToForm(program))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [program.id, program.updatedAt])

  const handleSubmit = (values: WorkoutProgramFormValues): void => {
    updateProgram.mutate(
      {
        name: values.name,
        days: values.days.map((day) => {
          return {
            name: day.name,
            isRest: day.isRest,
            category: day.isRest ? 'rest' : (day.category ?? 'strength'),
            exercises: day.isRest
              ? []
              : day.exercises.map((exercise) => {
                  return {
                    name: exercise.name,
                    sets: exercise.sets,
                    reps: exercise.reps,
                    ...(exercise.notes ? { notes: exercise.notes } : {}),
                  }
                }),
          }
        }),
      },
      {
        onSuccess: () => {
          toast.success('Programa actualizado')
        },
        onError: (error) => {
          const message = error instanceof Error ? error.message : 'Error desconocido'
          toast.error('No se pudo guardar el programa', { description: message })
        },
      },
    )
  }

  const days = form.watch('days')

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="program-name">Nombre del programa</Label>
        <Input id="program-name" {...form.register('name')} />
        {form.formState.errors.name ? (
          <p className="text-destructive text-xs">{form.formState.errors.name.message}</p>
        ) : null}
      </div>

      {fields.map((field, dayIndex) => {
        const dayErrors = form.formState.errors.days?.[dayIndex]
        const isRest = days[dayIndex]?.isRest ?? false

        return (
          <div key={field.id} className="space-y-3 rounded-xl border p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1 space-y-1.5">
                <Label htmlFor={`day-name-${dayIndex}`}>Día {dayIndex + 1}</Label>
                <Input id={`day-name-${dayIndex}`} {...form.register(`days.${dayIndex}.name`)} />
                {dayErrors?.name ? (
                  <p className="text-destructive text-xs">{dayErrors.name.message}</p>
                ) : null}
              </div>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-11"
                  aria-label="Subir día"
                  disabled={dayIndex === 0}
                  onClick={() => {
                    form.setValue('days', moveItem(days, dayIndex, dayIndex - 1), {
                      shouldDirty: true,
                    })
                  }}
                >
                  <ArrowUp className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-11"
                  aria-label="Bajar día"
                  disabled={dayIndex >= fields.length - 1}
                  onClick={() => {
                    form.setValue('days', moveItem(days, dayIndex, dayIndex + 1), {
                      shouldDirty: true,
                    })
                  }}
                >
                  <ArrowDown className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-11"
                  aria-label="Eliminar día"
                  disabled={fields.length <= 1}
                  onClick={() => {
                    remove(dayIndex)
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border px-3 py-2">
              <div>
                <Label htmlFor={`day-rest-${dayIndex}`} className="font-medium">
                  Día de descanso
                </Label>
                <p className="text-muted-foreground text-xs">Sin ejercicios; al completar avanzas al siguiente día.</p>
              </div>
              <Controller
                control={form.control}
                name={`days.${dayIndex}.isRest`}
                render={({ field: restField }) => {
                  return (
                    <Switch
                      id={`day-rest-${dayIndex}`}
                      checked={restField.value}
                      onCheckedChange={(checked) => {
                        restField.onChange(checked)
                        if (checked) {
                          form.setValue(`days.${dayIndex}.exercises`, [], { shouldDirty: true })
                          form.setValue(`days.${dayIndex}.category`, 'rest', { shouldDirty: true })
                        } else if (!form.getValues(`days.${dayIndex}.category`)) {
                          form.setValue(`days.${dayIndex}.category`, 'strength', { shouldDirty: true })
                        }
                      }}
                    />
                  )
                }}
              />
            </div>

            {!isRest ? (
              <>
                <div className="space-y-1.5">
                  <Label>Categoría</Label>
                  <Controller
                    control={form.control}
                    name={`days.${dayIndex}.category`}
                    render={({ field: categoryField }) => {
                      return (
                        <Select
                          value={categoryField.value ?? 'strength'}
                          onValueChange={(value) => {
                            categoryField.onChange(value)
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {WORKOUT_CATEGORIES.map((category) => {
                              return (
                                <SelectItem key={category} value={category}>
                                  {CATEGORY_LABELS[category]}
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
                      )
                    }}
                  />
                </div>

                <DayExercisesEditor form={form} dayIndex={dayIndex} />
                {dayErrors?.exercises?.message || dayErrors?.exercises?.root?.message ? (
                  <p className="text-destructive text-xs">
                    {dayErrors.exercises.message ?? dayErrors.exercises.root?.message}
                  </p>
                ) : null}
              </>
            ) : null}
          </div>
        )
      })}

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            append({
              name: 'Nuevo día',
              isRest: false,
              category: 'strength',
              exercises: [{ name: '', sets: 3, reps: '8-12', notes: '' }],
            })
          }}
        >
          <Plus className="size-4" />
          Añadir día
        </Button>
        <Button type="submit" disabled={updateProgram.isPending}>
          {updateProgram.isPending ? 'Guardando…' : 'Guardar programa'}
        </Button>
      </div>
      {form.formState.errors.days?.message || form.formState.errors.days?.root?.message ? (
        <p className="text-destructive text-xs">
          {form.formState.errors.days.message ?? form.formState.errors.days.root?.message}
        </p>
      ) : null}
    </form>
  )
}

function DayExercisesEditor({
  form,
  dayIndex,
}: {
  form: ReturnType<typeof useForm<WorkoutProgramFormInput, unknown, WorkoutProgramFormValues>>
  dayIndex: number
}) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `days.${dayIndex}.exercises`,
  })

  const exercises = form.watch(`days.${dayIndex}.exercises`)

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Ejercicios</p>
      {fields.map((field, exerciseIndex) => {
        return (
          <div key={field.id} className="grid gap-2 rounded-lg border p-3 sm:grid-cols-[1fr_5rem_6rem_auto]">
            <div className="space-y-1">
              <Label htmlFor={`ex-name-${dayIndex}-${exerciseIndex}`} className="text-muted-foreground text-xs">
                Nombre
              </Label>
              <Input
                id={`ex-name-${dayIndex}-${exerciseIndex}`}
                {...form.register(`days.${dayIndex}.exercises.${exerciseIndex}.name`)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor={`ex-sets-${dayIndex}-${exerciseIndex}`} className="text-muted-foreground text-xs">
                Series
              </Label>
              <Input
                id={`ex-sets-${dayIndex}-${exerciseIndex}`}
                type="number"
                min={0}
                {...form.register(`days.${dayIndex}.exercises.${exerciseIndex}.sets`)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor={`ex-reps-${dayIndex}-${exerciseIndex}`} className="text-muted-foreground text-xs">
                Reps
              </Label>
              <Input
                id={`ex-reps-${dayIndex}-${exerciseIndex}`}
                {...form.register(`days.${dayIndex}.exercises.${exerciseIndex}.reps`)}
              />
            </div>
            <div className="flex items-end gap-1">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-11"
                aria-label="Subir ejercicio"
                disabled={exerciseIndex === 0}
                onClick={() => {
                  form.setValue(
                    `days.${dayIndex}.exercises`,
                    moveItem(exercises, exerciseIndex, exerciseIndex - 1),
                    { shouldDirty: true },
                  )
                }}
              >
                <ArrowUp className="size-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-11"
                aria-label="Bajar ejercicio"
                disabled={exerciseIndex >= fields.length - 1}
                onClick={() => {
                  form.setValue(
                    `days.${dayIndex}.exercises`,
                    moveItem(exercises, exerciseIndex, exerciseIndex + 1),
                    { shouldDirty: true },
                  )
                }}
              >
                <ArrowDown className="size-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-11"
                aria-label="Eliminar ejercicio"
                onClick={() => {
                  remove(exerciseIndex)
                }}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        )
      })}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => {
          append({ name: '', sets: 3, reps: '8-12', notes: '' })
        }}
      >
        <Plus className="size-4" />
        Añadir ejercicio
      </Button>
    </div>
  )
}
