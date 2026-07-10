import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MEAL_SLOTS } from '@/types/meal'
import type { MealTemplate } from '@/types/meal'
import { useUpdateSettings } from '@/hooks/use-settings'

const mealTemplatesFormSchema = z.object({
  mealTemplates: z
    .array(
      z.object({
        slot: z.enum(MEAL_SLOTS),
        name: z.string().min(1, 'Required').max(40),
        time: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time'),
      }),
    )
    .length(5),
})

type MealTemplatesFormValues = z.infer<typeof mealTemplatesFormSchema>

export function MealTemplatesForm({ mealTemplates }: { mealTemplates: MealTemplate[] }) {
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
    updateSettings.mutate(
      { mealTemplates: values.mealTemplates },
      {
        onSuccess: () => toast.success('Meal plan updated'),
        onError: (error) => toast.error('Could not save meal plan', { description: error.message }),
      },
    )
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
      {mealTemplates.map((template, index) => (
        <div key={template.slot} className="grid grid-cols-[1fr_auto] items-end gap-3 rounded-xl border p-3 sm:grid-cols-[2fr_1fr]">
          <div className="space-y-1.5">
            <Label htmlFor={`meal-name-${template.slot}`} className="text-muted-foreground text-xs capitalize">
              {template.slot.replace(/([A-Z])/g, ' $1')}
            </Label>
            <Input id={`meal-name-${template.slot}`} {...form.register(`mealTemplates.${index}.name`)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`meal-time-${template.slot}`} className="text-muted-foreground text-xs">
              Time
            </Label>
            <Input id={`meal-time-${template.slot}`} type="time" {...form.register(`mealTemplates.${index}.time`)} />
          </div>
        </div>
      ))}
      <Button type="submit" disabled={updateSettings.isPending}>
        {updateSettings.isPending ? 'Saving…' : 'Save meal plan'}
      </Button>
    </form>
  )
}
