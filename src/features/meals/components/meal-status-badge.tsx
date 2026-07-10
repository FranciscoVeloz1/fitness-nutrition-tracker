import { CheckCircle2, AlertTriangle, XCircle, Circle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { MealStatus } from '@/types/meal'

const STATUS_CONFIG: Record<MealStatus, { label: string; icon: typeof CheckCircle2; className: string }> = {
  followed: { label: 'Followed', icon: CheckCircle2, className: 'bg-success/15 text-success border-success/30' },
  modified: { label: 'Modified', icon: AlertTriangle, className: 'bg-warning/15 text-warning border-warning/30' },
  skipped: { label: 'Skipped', icon: XCircle, className: 'bg-destructive/15 text-destructive border-destructive/30' },
  pending: { label: 'Pending', icon: Circle, className: 'bg-muted text-muted-foreground border-border' },
}

export function MealStatusBadge({ status }: { status: MealStatus }) {
  const config = STATUS_CONFIG[status]
  return (
    <Badge variant="outline" className={cn('gap-1 border', config.className)}>
      <config.icon className="size-3" />
      {config.label}
    </Badge>
  )
}
