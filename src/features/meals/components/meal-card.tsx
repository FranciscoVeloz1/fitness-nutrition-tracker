import { useState } from 'react'
import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { MealStatusBadge } from '@/features/meals/components/meal-status-badge'
import { MealLogDialog, type MealLogFormValues } from '@/features/meals/components/meal-log-dialog'
import type { MealLog } from '@/types/meal'
import { cn } from '@/lib/utils'

interface MealCardProps {
  meal: MealLog
  onFollowed: () => void
  onLogDetails: (values: MealLogFormValues) => void
  isSaving?: boolean
}

export function MealCard({ meal, onFollowed, onLogDetails, isSaving }: MealCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const isFollowed = meal.status === 'followed'

  return (
    <motion.div
      layout
      className={cn(
        'glass-panel rounded-2xl p-4 transition-colors',
        isFollowed && 'ring-1 ring-success/40',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="font-medium">{meal.name}</p>
          <p className="text-muted-foreground flex items-center gap-1 text-xs">
            <Clock className="size-3" />
            {meal.time}
          </p>
        </div>
        <MealStatusBadge status={meal.status} />
      </div>

      {meal.status === 'modified' || meal.status === 'skipped' ? (
        <div className="bg-muted/60 mt-3 space-y-1 rounded-xl p-3 text-sm">
          {meal.actualDescription ? (
            <p>
              <span className="text-muted-foreground">Comió en su lugar: </span>
              {meal.actualDescription}
            </p>
          ) : null}
          {meal.estimatedCalories ? (
            <p>
              <span className="text-muted-foreground">Cal. estimadas: </span>
              {meal.estimatedCalories} kcal
            </p>
          ) : null}
          {meal.notes ? (
            <p>
              <span className="text-muted-foreground">Notas: </span>
              {meal.notes}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="mt-4 flex items-center justify-between border-t pt-3">
        <div className="flex items-center gap-2">
          <Checkbox
            id={`followed-${meal.slot}`}
            checked={isFollowed}
            onCheckedChange={(checked) => {
              if (checked) {
                onFollowed()
              } else {
                setDialogOpen(true)
              }
            }}
          />
          <Label htmlFor={`followed-${meal.slot}`} className="cursor-pointer text-sm font-normal">
            Seguí la comida planeada
          </Label>
        </div>
        {!isFollowed ? (
          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="text-primary text-xs font-medium hover:underline"
          >
            {meal.status === 'pending' ? 'Registrar qué pasó' : 'Editar detalles'}
          </button>
        ) : null}
      </div>

      <MealLogDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        meal={meal}
        isSaving={isSaving}
        onSubmit={(values) => {
          onLogDetails(values)
          setDialogOpen(false)
        }}
      />
    </motion.div>
  )
}
