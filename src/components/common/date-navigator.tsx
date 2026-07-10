import { memo } from 'react'
import { ChevronLeft, ChevronRight, CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import type { DateKey } from '@/types/common'
import { formatDisplayDate, parseDateKey, shiftDateKey, toDateKey, todayKey } from '@/services/date'

interface DateNavigatorProps {
  date: DateKey
  onChange: (date: DateKey) => void
}

export const DateNavigator = memo(function DateNavigator({ date, onChange }: DateNavigatorProps) {
  const isToday = date === todayKey()

  return (
    <div className="flex items-center gap-1.5">
      <Button variant="outline" size="icon" onClick={() => onChange(shiftDateKey(date, -1))} aria-label="Previous day">
        <ChevronLeft className="size-4" />
      </Button>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="min-w-40 justify-start gap-2 font-medium">
            <CalendarIcon className="size-4" />
            {isToday ? 'Today' : formatDisplayDate(date)}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="single"
            selected={parseDateKey(date)}
            onSelect={(selected) => {
              if (selected) {
                onChange(toDateKey(selected))
              }
            }}
            disabled={{ after: new Date() }}
          />
        </PopoverContent>
      </Popover>

      <Button
        variant="outline"
        size="icon"
        onClick={() => onChange(shiftDateKey(date, 1))}
        disabled={isToday}
        aria-label="Next day"
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  )
})
