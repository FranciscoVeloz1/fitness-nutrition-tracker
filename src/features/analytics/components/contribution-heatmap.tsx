import { useMemo } from 'react'
import { addDays, startOfWeek } from 'date-fns'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { DailyRecord } from '@/types/daily-record'
import { computeAdherence } from '@/services/adherence'
import { formatDisplayDate, parseDateKey, todayKey, toDateKey } from '@/services/date'

const WEEKS_TO_SHOW = 18

function intensityClass(pct: number | undefined): string {
  if (pct === undefined) {
    return 'bg-muted'
  }
  if (pct === 0) {
    return 'bg-destructive/25'
  }
  if (pct < 50) {
    return 'bg-warning/35'
  }
  if (pct < 80) {
    return 'bg-primary/40'
  }
  return 'bg-success/70'
}

export function ContributionHeatmap({ records }: { records: DailyRecord[] }) {
  const adherenceByDate = useMemo(() => {
    const map = new Map<string, number>()
    for (const record of records) {
      map.set(record.date, computeAdherence(record.date, record.meals).adherencePct)
    }
    return map
  }, [records])

  const weeks = useMemo(() => {
    const today = parseDateKey(todayKey())
    const gridStart = startOfWeek(addDays(today, -(WEEKS_TO_SHOW * 7 - 1)), { weekStartsOn: 1 })

    return Array.from({ length: WEEKS_TO_SHOW }, (_, weekIndex) =>
      Array.from({ length: 7 }, (_, dayIndex) => {
        const date = addDays(gridStart, weekIndex * 7 + dayIndex)
        const dateKey = toDateKey(date)
        return { dateKey, isFuture: date > today, adherencePct: adherenceByDate.get(dateKey) }
      }),
    )
  }, [adherenceByDate])

  return (
    <div className="glass-panel overflow-x-auto rounded-2xl p-4">
      <div className="flex gap-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.map((day) => (
              <Tooltip key={day.dateKey}>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      'size-3.5 rounded-sm',
                      day.isFuture ? 'bg-transparent' : intensityClass(day.adherencePct),
                    )}
                  />
                </TooltipTrigger>
                {!day.isFuture ? (
                  <TooltipContent>
                    {formatDisplayDate(day.dateKey)} ·{' '}
                    {day.adherencePct !== undefined ? `${day.adherencePct}% adherence` : 'No data'}
                  </TooltipContent>
                ) : null}
              </Tooltip>
            ))}
          </div>
        ))}
      </div>
      <div className="text-muted-foreground mt-3 flex items-center gap-2 text-xs">
        <span>Less</span>
        <span className="bg-destructive/25 size-3 rounded-sm" />
        <span className="bg-warning/35 size-3 rounded-sm" />
        <span className="bg-primary/40 size-3 rounded-sm" />
        <span className="bg-success/70 size-3 rounded-sm" />
        <span>More</span>
      </div>
    </div>
  )
}
