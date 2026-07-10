export interface WeightEntry {
  /** Always stored in kilograms; convert at the presentation layer. */
  weightKg: number
  bodyFatPct?: number
  muscleMassPct?: number
  waistCm?: number
  notes?: string
}
