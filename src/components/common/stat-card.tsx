import { memo, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: ReactNode
  icon?: LucideIcon
  trend?: {
    direction: 'up' | 'down' | 'flat'
    label: string
    tone?: 'positive' | 'negative' | 'neutral'
  }
  accentClassName?: string
  className?: string
}

const TREND_TONE_CLASSNAMES: Record<'positive' | 'negative' | 'neutral', string> = {
  positive: 'text-success',
  negative: 'text-destructive',
  neutral: 'text-muted-foreground',
}

export const StatCard = memo(function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  accentClassName = 'bg-primary/10 text-primary',
  className,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('glass-panel flex flex-col gap-3 rounded-2xl p-4', className)}
    >
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-sm font-medium">{label}</span>
        {Icon ? (
          <span className={cn('inline-flex rounded-full p-2', accentClassName)}>
            <Icon className="size-4" />
          </span>
        ) : null}
      </div>
      <div className="text-2xl font-semibold tabular-nums">{value}</div>
      {trend ? (
        <span className={cn('text-xs font-medium', TREND_TONE_CLASSNAMES[trend.tone ?? 'neutral'])}>
          {trend.label}
        </span>
      ) : null}
    </motion.div>
  )
})
