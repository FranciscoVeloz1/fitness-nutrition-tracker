/**
 * ISO calendar date key in `yyyy-MM-dd` format. Used as the primary key for
 * all day-scoped records so lookups stay stable across timezones.
 */
export type DateKey = string

/** ISO 8601 timestamp string produced by `new Date().toISOString()`. */
export type Timestamp = string

export type WeightUnit = 'kg' | 'lb'

export type ThemeMode = 'dark' | 'light' | 'system'
