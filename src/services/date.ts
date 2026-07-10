import { format, parseISO, addDays, differenceInCalendarDays, isValid } from 'date-fns'
import { es } from 'date-fns/locale'
import type { DateKey } from '@/types/common'

const DATE_KEY_FORMAT = 'yyyy-MM-dd'

export function toDateKey(date: Date): DateKey {
  return format(date, DATE_KEY_FORMAT)
}

export function todayKey(): DateKey {
  return toDateKey(new Date())
}

export function parseDateKey(date: DateKey): Date {
  return parseISO(date)
}

export function isValidDateKey(date: string): date is DateKey {
  return /^\d{4}-\d{2}-\d{2}$/.test(date) && isValid(parseISO(date))
}

export function shiftDateKey(date: DateKey, days: number): DateKey {
  return toDateKey(addDays(parseDateKey(date), days))
}

export function yesterdayOf(date: DateKey): DateKey {
  return shiftDateKey(date, -1)
}

/** Number of calendar days between two date keys (b - a). */
export function diffInDays(a: DateKey, b: DateKey): number {
  return differenceInCalendarDays(parseDateKey(b), parseDateKey(a))
}

export function isConsecutiveDay(previous: DateKey, next: DateKey): boolean {
  return diffInDays(previous, next) === 1
}

/** e.g. "Viernes, 10 de julio" (date-fns lowercases weekday names in `es`; capitalized here for use as a heading). */
export function formatDisplayDate(date: DateKey): string {
  const formatted = format(parseDateKey(date), "EEEE, d 'de' MMMM", { locale: es })
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

export function formatShortDate(date: DateKey): string {
  return format(parseDateKey(date), 'd MMM', { locale: es })
}
