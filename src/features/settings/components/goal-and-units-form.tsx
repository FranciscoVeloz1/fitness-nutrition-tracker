import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { AppSettings } from '@/types/settings'
import { useUpdateSettings } from '@/hooks/use-settings'
import { displayToKg, kgToDisplay } from '@/services/units'

const goalFormSchema = z.object({
  weightUnit: z.enum(['kg', 'lb']),
  // `z.literal('')` must come before `z.coerce.number()` in the union so an
  // empty field is treated as "not entered" rather than coerced to a number.
  goalWeight: z
    .union([z.literal(''), z.coerce.number().positive().max(999)])
    .optional()
    .transform((value) => (value === '' || value === undefined ? undefined : value)),
})

type GoalFormInput = z.input<typeof goalFormSchema>
type GoalFormValues = z.output<typeof goalFormSchema>

export function GoalAndUnitsForm({ settings }: { settings: AppSettings }) {
  const updateSettings = useUpdateSettings()
  const form = useForm<GoalFormInput, unknown, GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      weightUnit: settings.weightUnit,
      goalWeight: settings.goalWeightKg ? kgToDisplay(settings.goalWeightKg, settings.weightUnit) : undefined,
    },
  })

  useEffect(() => {
    form.reset({
      weightUnit: settings.weightUnit,
      goalWeight: settings.goalWeightKg ? kgToDisplay(settings.goalWeightKg, settings.weightUnit) : undefined,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.weightUnit, settings.goalWeightKg])

  const handleSubmit = (values: GoalFormValues): void => {
    updateSettings.mutate(
      {
        weightUnit: values.weightUnit,
        goalWeightKg: values.goalWeight !== undefined ? displayToKg(values.goalWeight, values.weightUnit) : undefined,
      },
      {
        onSuccess: () => toast.success('Preferences saved'),
        onError: (error) => toast.error('Could not save preferences', { description: error.message }),
      },
    )
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="weightUnit">Weight unit</Label>
        <Controller
          control={form.control}
          name="weightUnit"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="weightUnit" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kg">Kilograms (kg)</SelectItem>
                <SelectItem value="lb">Pounds (lb)</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="goalWeight">Goal weight ({form.watch('weightUnit')})</Label>
        <Input id="goalWeight" type="number" step="0.1" inputMode="decimal" {...form.register('goalWeight')} />
      </div>

      <Button type="submit" disabled={updateSettings.isPending} className="sm:col-span-2 sm:w-fit">
        {updateSettings.isPending ? 'Saving…' : 'Save preferences'}
      </Button>
    </form>
  )
}
