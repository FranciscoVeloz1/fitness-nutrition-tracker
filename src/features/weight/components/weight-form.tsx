import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import type { WeightUnit } from '@/types/common'
import type { WeightEntry } from '@/types/weight'
import { displayToKg, kgToDisplay, weightUnitLabel } from '@/services/units'

const weightFormSchema = z.object({
  weight: z.coerce.number().positive('Ingresa un peso válido').max(999),
  // `z.literal('')` must come before `z.coerce.number()` in the union: since
  // `Number('') === 0`, checking the number branch first would let an empty
  // field silently coerce to a "real" 0 reading instead of "not entered".
  bodyFatPct: z
    .union([z.literal(''), z.coerce.number().min(0).max(100)])
    .optional()
    .transform((value) => (value === '' || value === undefined ? undefined : value)),
  muscleMassPct: z
    .union([z.literal(''), z.coerce.number().min(0).max(100)])
    .optional()
    .transform((value) => (value === '' || value === undefined ? undefined : value)),
  waist: z
    .union([z.literal(''), z.coerce.number().min(0).max(300)])
    .optional()
    .transform((value) => (value === '' || value === undefined ? undefined : value)),
  notes: z.string().max(300).optional(),
})

type WeightFormInput = z.input<typeof weightFormSchema>
type WeightFormValues = z.output<typeof weightFormSchema>

interface WeightFormProps {
  unit: WeightUnit
  defaultValues?: WeightEntry
  isSaving?: boolean
  onSubmit: (entry: WeightEntry) => void
}

export function WeightForm({ unit, defaultValues, isSaving, onSubmit }: WeightFormProps) {
  const form = useForm<WeightFormInput, unknown, WeightFormValues>({
    resolver: zodResolver(weightFormSchema),
    defaultValues: {
      weight: defaultValues ? kgToDisplay(defaultValues.weightKg, unit) : undefined,
      bodyFatPct: defaultValues?.bodyFatPct,
      muscleMassPct: defaultValues?.muscleMassPct,
      waist: defaultValues?.waistCm,
      notes: defaultValues?.notes ?? '',
    },
  })

  useEffect(() => {
    form.reset({
      weight: defaultValues ? kgToDisplay(defaultValues.weightKg, unit) : undefined,
      bodyFatPct: defaultValues?.bodyFatPct,
      muscleMassPct: defaultValues?.muscleMassPct,
      waist: defaultValues?.waistCm,
      notes: defaultValues?.notes ?? '',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues?.weightKg, unit])

  const handleSubmit = (values: WeightFormValues): void => {
    onSubmit({
      weightKg: displayToKg(values.weight, unit),
      bodyFatPct: values.bodyFatPct,
      muscleMassPct: values.muscleMassPct,
      waistCm: values.waist,
      notes: values.notes,
    })
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="glass-panel space-y-4 rounded-2xl p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="weight">Peso ({weightUnitLabel(unit)})</Label>
          <Input id="weight" type="number" step="0.1" inputMode="decimal" {...form.register('weight')} />
          {form.formState.errors.weight ? (
            <p className="text-destructive text-xs">{form.formState.errors.weight.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="bodyFatPct">% de grasa corporal (opcional)</Label>
          <Input id="bodyFatPct" type="number" step="0.1" inputMode="decimal" {...form.register('bodyFatPct')} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="muscleMassPct">% de masa muscular (opcional)</Label>
          <Input id="muscleMassPct" type="number" step="0.1" inputMode="decimal" {...form.register('muscleMassPct')} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="waist">Cintura, cm (opcional)</Label>
          <Input id="waist" type="number" step="0.1" inputMode="decimal" {...form.register('waist')} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notas (opcional)</Label>
        <Textarea id="notes" rows={2} placeholder="¿Cómo te sientes hoy?" {...form.register('notes')} />
      </div>

      <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">
        {isSaving ? 'Guardando…' : 'Guardar peso'}
      </Button>
    </form>
  )
}
