import { z } from 'zod'
import { MEAL_SLOTS } from '@/types/meal'
import { WORKOUT_CATEGORIES, WORKOUT_INTENSITIES } from '@/types/workout'

const mealSlotSchema = z.enum(MEAL_SLOTS)
const mealStatusSchema = z.enum(['pending', 'followed', 'modified', 'skipped'])

const mealTemplateSchema = z.object({
  slot: mealSlotSchema,
  name: z.string().min(1),
  time: z.string().regex(/^\d{2}:\d{2}$/),
})

const mealLogSchema = z.object({
  slot: mealSlotSchema,
  name: z.string(),
  time: z.string(),
  status: mealStatusSchema,
  actualDescription: z.string().optional(),
  notes: z.string().optional(),
  estimatedCalories: z.number().nonnegative().optional(),
})

const workoutEntrySchema = z.object({
  completed: z.boolean(),
  category: z.enum(WORKOUT_CATEGORIES),
  type: z.string(),
  durationMinutes: z.number().nonnegative(),
  intensity: z.enum(WORKOUT_INTENSITIES),
  notes: z.string().optional(),
  dayName: z.string().optional(),
  exercises: z
    .array(
      z.object({
        name: z.string(),
        sets: z.number().int().nonnegative(),
        reps: z.string(),
        notes: z.string().optional(),
      }),
    )
    .optional(),
})

const weightEntrySchema = z.object({
  weightKg: z.number().positive(),
  bodyFatPct: z.number().min(0).max(100).optional(),
  muscleMassPct: z.number().min(0).max(100).optional(),
  waistCm: z.number().positive().optional(),
  notes: z.string().optional(),
})

const dailyRecordSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  meals: z.array(mealLogSchema),
  workout: workoutEntrySchema.optional(),
  weight: weightEntrySchema.optional(),
  notes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

const settingsSchema = z.object({
  mealTemplates: z.array(mealTemplateSchema),
  goalWeightKg: z.number().positive().optional(),
  weightUnit: z.enum(['kg', 'lb']),
  theme: z.enum(['dark', 'light', 'system']),
  schemaVersion: z.number(),
})

export const backupFileSchema = z.object({
  app: z.literal('fitness-nutrition-tracker'),
  exportedAt: z.string(),
  schemaVersion: z.number(),
  settings: settingsSchema,
  dailyRecords: z.array(dailyRecordSchema),
})

export type BackupFile = z.infer<typeof backupFileSchema>
