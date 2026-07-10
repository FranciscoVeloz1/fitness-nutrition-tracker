import type { DateKey } from '@/types/common'
import type { StreakStat } from '@/types/statistics'
import { isConsecutiveDay, todayKey, yesterdayOf } from '@/services/date'

/**
 * Generic streak calculator: given dates that "count" (already filtered by
 * whatever threshold the caller cares about — adherence %, workout
 * completion, etc.), returns the current streak (must include today or
 * yesterday to still be "alive") and the longest streak ever recorded.
 */
export function computeStreak(qualifyingDatesAscending: DateKey[]): StreakStat {
  if (qualifyingDatesAscending.length === 0) {
    return { current: 0, longest: 0 }
  }

  let longest = 1
  let runLength = 1
  const runs: { start: DateKey; end: DateKey; length: number }[] = []

  for (let i = 1; i < qualifyingDatesAscending.length; i += 1) {
    const previous = qualifyingDatesAscending[i - 1]
    const current = qualifyingDatesAscending[i]
    if (isConsecutiveDay(previous, current)) {
      runLength += 1
    } else {
      runs.push({
        start: qualifyingDatesAscending[i - runLength],
        end: previous,
        length: runLength,
      })
      longest = Math.max(longest, runLength)
      runLength = 1
    }
  }
  const lastIndex = qualifyingDatesAscending.length - 1
  runs.push({
    start: qualifyingDatesAscending[lastIndex - runLength + 1],
    end: qualifyingDatesAscending[lastIndex],
    length: runLength,
  })
  longest = Math.max(longest, runLength)

  const lastRun = runs[runs.length - 1]
  const today = todayKey()
  const isActive = lastRun.end === today || lastRun.end === yesterdayOf(today)
  const current = isActive ? lastRun.length : 0

  return { current, longest }
}
