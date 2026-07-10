import { formatDisplayDate } from '@/services/date'
import type { DateKey } from '@/types/common'

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) {
    return 'Good morning'
  }
  if (hour < 18) {
    return 'Good afternoon'
  }
  return 'Good evening'
}

export function GreetingHeader({ today }: { today: DateKey }) {
  return (
    <div>
      <p className="text-muted-foreground text-sm">{formatDisplayDate(today)}</p>
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{getGreeting()}</h1>
    </div>
  )
}
