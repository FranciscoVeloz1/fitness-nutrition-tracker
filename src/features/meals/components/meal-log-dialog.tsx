import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import type { MealLog } from '@/types/meal'

const mealLogFormSchema = z.object({
  status: z.enum(['modified', 'skipped']),
  actualDescription: z.string().max(200).optional(),
  notes: z.string().max(300).optional(),
  // `z.literal('')` must come before `z.coerce.number()`: since `Number('') === 0`,
  // checking the number branch first would coerce an empty field into a "real" 0
  // instead of leaving it unset.
  estimatedCalories: z
    .union([z.literal(''), z.coerce.number().min(0).max(5000)])
    .optional()
    .transform((value) => (value === '' || value === undefined ? undefined : value)),
})

type MealLogFormInput = z.input<typeof mealLogFormSchema>
export type MealLogFormValues = z.output<typeof mealLogFormSchema>

interface MealLogDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  meal: MealLog
  isSaving?: boolean
  onSubmit: (values: MealLogFormValues) => void
}

export function MealLogDialog({ open, onOpenChange, meal, isSaving, onSubmit }: MealLogDialogProps) {
  const form = useForm<MealLogFormInput, unknown, MealLogFormValues>({
    resolver: zodResolver(mealLogFormSchema),
    defaultValues: {
      status: meal.status === 'skipped' ? 'skipped' : 'modified',
      actualDescription: meal.actualDescription ?? '',
      notes: meal.notes ?? '',
      estimatedCalories: meal.estimatedCalories,
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        status: meal.status === 'skipped' ? 'skipped' : 'modified',
        actualDescription: meal.actualDescription ?? '',
        notes: meal.notes ?? '',
        estimatedCalories: meal.estimatedCalories,
      })
    }
  }, [open, meal, form])

  const status = form.watch('status')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form
          onSubmit={form.handleSubmit((values) => {
            onSubmit(values)
          })}
        >
          <DialogHeader>
            <DialogTitle>{meal.name}</DialogTitle>
            <DialogDescription>No seguiste el plan exactamente — cuéntanos qué pasó.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>¿Qué pasó?</Label>
              <RadioGroup
                value={status}
                onValueChange={(value) => form.setValue('status', value as 'modified' | 'skipped')}
                className="grid grid-cols-2 gap-2"
              >
                <Label
                  htmlFor="status-modified"
                  className="flex items-center gap-2 rounded-xl border p-3 text-sm font-normal data-[state=checked]:border-primary"
                  data-state={status === 'modified' ? 'checked' : 'unchecked'}
                >
                  <RadioGroupItem value="modified" id="status-modified" />
                  Comí otra cosa
                </Label>
                <Label
                  htmlFor="status-skipped"
                  className="flex items-center gap-2 rounded-xl border p-3 text-sm font-normal data-[state=checked]:border-primary"
                  data-state={status === 'skipped' ? 'checked' : 'unchecked'}
                >
                  <RadioGroupItem value="skipped" id="status-skipped" />
                  Lo omití por completo
                </Label>
              </RadioGroup>
            </div>

            {status === 'modified' ? (
              <div className="space-y-2">
                <Label htmlFor="actualDescription">¿Qué comiste en su lugar?</Label>
                <Input
                  id="actualDescription"
                  placeholder="ej. Ensalada de pollo a la parrilla"
                  {...form.register('actualDescription')}
                />
              </div>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="estimatedCalories">Calorías estimadas (opcional)</Label>
              <Input
                id="estimatedCalories"
                type="number"
                inputMode="numeric"
                min={0}
                placeholder="ej. 650"
                {...form.register('estimatedCalories')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notas (opcional)</Label>
              <Textarea id="notes" rows={2} placeholder="Algo que valga la pena recordar" {...form.register('notes')} />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Guardando…' : 'Guardar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
