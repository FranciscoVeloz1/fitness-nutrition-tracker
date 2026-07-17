import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MEAL_SLOTS, MEAL_SLOT_LABELS } from '@/types/meal'
import type { MealTemplate } from '@/types/meal'
import { useUpdateSettings } from '@/hooks/use-settings'

const mealTemplatesFormSchema = z.object({
  mealTemplates: z
    .array(
      z.object({
        slot: z.enum(MEAL_SLOTS),
        name: z.string().min(1, 'Obligatorio').max(40),
        time: z.string().regex(/^\d{2}:\d{2}$/, 'Hora inválida'),
      }),
    )
    .length(5),
})

type MealTemplatesFormValues = z.infer<typeof mealTemplatesFormSchema>

export function MealTemplatesForm({
  mealTemplates,
  readOnly = false,
}: {
  mealTemplates: MealTemplate[]
  readOnly?: boolean
}) {
  const updateSettings = useUpdateSettings()
  const form = useForm<MealTemplatesFormValues>({
    resolver: zodResolver(mealTemplatesFormSchema),
    defaultValues: { mealTemplates },
  })

  useEffect(() => {
    form.reset({ mealTemplates })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mealTemplates])

  const handleSubmit = (values: MealTemplatesFormValues): void => {
    if (readOnly) return
    updateSettings.mutate(
      { mealTemplates: values.mealTemplates },
      {
        onSuccess: () => toast.success('Plan de comidas actualizado'),
        onError: (error) => toast.error('No se pudo guardar el plan de comidas', { description: error.message }),
      },
    )
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
      <fieldset disabled={readOnly} className="space-y-3 disabled:opacity-70">
        {mealTemplates.map((template, index) => (
          <div key={template.slot} className="grid grid-cols-[1fr_auto] items-end gap-3 rounded-xl border p-3 sm:grid-cols-[2fr_1fr]">
            <div className="space-y-1.5">
              <Label htmlFor={`meal-name-${template.slot}`} className="text-muted-foreground text-xs">
                {MEAL_SLOT_LABELS[template.slot]}
              </Label>
              <Input id={`meal-name-${template.slot}`} {...form.register(`mealTemplates.${index}.name`)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`meal-time-${template.slot}`} className="text-muted-foreground text-xs">
                Hora
              </Label>
              <Input id={`meal-time-${template.slot}`} type="time" {...form.register(`mealTemplates.${index}.time`)} />
            </div>
          </div>
        ))}
        {!readOnly ? (
          <Button type="submit" disabled={updateSettings.isPending}>
            {updateSettings.isPending ? 'Guardando…' : 'Guardar plan de comidas'}
          </Button>
        ) : null}
      </fieldset>
    </form>
  )
}
