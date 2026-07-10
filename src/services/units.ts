import type { WeightUnit } from '@/types/common'

const KG_PER_LB = 0.45359237

export function kgToDisplay(weightKg: number, unit: WeightUnit): number {
  const value = unit === 'lb' ? weightKg / KG_PER_LB : weightKg
  return Math.round(value * 10) / 10
}

export function displayToKg(value: number, unit: WeightUnit): number {
  const kg = unit === 'lb' ? value * KG_PER_LB : value
  return Math.round(kg * 100) / 100
}

export function weightUnitLabel(unit: WeightUnit): string {
  return unit === 'lb' ? 'lb' : 'kg'
}
