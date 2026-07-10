import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { WORKOUT_CATEGORIES, WORKOUT_INTENSITIES, CATEGORY_LABELS, INTENSITY_LABELS } from '@/types/workout'
import type { WorkoutEntry } from '@/types/workout'

const workoutFormSchema = z.object({
  completed: z.boolean(),
  category: z.enum(WORKOUT_CATEGORIES),
  type: z.string().min(1, 'Dale un nombre a este entrenamiento').max(60),
  durationMinutes: z.coerce.number().min(0).max(600),
  intensity: z.enum(WORKOUT_INTENSITIES),
  notes: z.string().max(300).optional(),
})

type WorkoutFormInput = z.input<typeof workoutFormSchema>
export type WorkoutFormValues = z.output<typeof workoutFormSchema>

interface WorkoutFormProps {
  defaultValues?: Partial<WorkoutEntry>
  isSaving?: boolean
  onSubmit: (values: WorkoutFormValues) => void
}

export function WorkoutForm({ defaultValues, isSaving, onSubmit }: WorkoutFormProps) {
  const form = useForm<WorkoutFormInput, unknown, WorkoutFormValues>({
    resolver: zodResolver(workoutFormSchema),
    defaultValues: {
      completed: defaultValues?.completed ?? true,
      category: defaultValues?.category ?? 'strength',
      type: defaultValues?.type ?? '',
      durationMinutes: defaultValues?.durationMinutes ?? 30,
      intensity: defaultValues?.intensity ?? 'moderate',
      notes: defaultValues?.notes ?? '',
    },
  })

  useEffect(() => {
    form.reset({
      completed: defaultValues?.completed ?? true,
      category: defaultValues?.category ?? 'strength',
      type: defaultValues?.type ?? '',
      durationMinutes: defaultValues?.durationMinutes ?? 30,
      intensity: defaultValues?.intensity ?? 'moderate',
      notes: defaultValues?.notes ?? '',
    })
    // Only re-seed the form when the underlying record identity changes (new day loaded).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues?.type, defaultValues?.completed])

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="glass-panel space-y-5 rounded-2xl p-5">
      <div className="flex items-center justify-between rounded-xl border p-3">
        <div>
          <Label htmlFor="completed" className="font-medium">
            Entrenamiento completado
          </Label>
          <p className="text-muted-foreground text-xs">Desactívalo para registrar un día de descanso.</p>
        </div>
        <Controller
          control={form.control}
          name="completed"
          render={({ field }) => <Switch id="completed" checked={field.value} onCheckedChange={field.onChange} />}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="type">Tipo de entrenamiento</Label>
          <Input id="type" placeholder="ej. Día de empuje, carrera de 5k" {...form.register('type')} />
          {form.formState.errors.type ? (
            <p className="text-destructive text-xs">{form.formState.errors.type.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Categoría</Label>
          <Controller
            control={form.control}
            name="category"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="category" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {WORKOUT_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {CATEGORY_LABELS[category]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="durationMinutes">Duración (minutos)</Label>
          <Input id="durationMinutes" type="number" inputMode="numeric" min={0} {...form.register('durationMinutes')} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="intensity">Intensidad</Label>
          <Controller
            control={form.control}
            name="intensity"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="intensity" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {WORKOUT_INTENSITIES.map((intensity) => (
                    <SelectItem key={intensity} value={intensity}>
                      {INTENSITY_LABELS[intensity]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notas (opcional)</Label>
        <Textarea id="notes" rows={3} placeholder="¿Cómo te sentiste?" {...form.register('notes')} />
      </div>

      <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">
        {isSaving ? 'Guardando…' : 'Guardar entrenamiento'}
      </Button>
    </form>
  )
}
