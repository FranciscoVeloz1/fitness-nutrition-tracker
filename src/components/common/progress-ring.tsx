import { memo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ProgressRingProps {
  /** 0-100 */
  value: number
  size?: number
  strokeWidth?: number
  label?: string
  sublabel?: string
  className?: string
  colorClassName?: string
}

const CIRCLE_RATIO = 2 * Math.PI

/** Animated circular progress indicator used for adherence %, workout completion, and goal progress. */
export const ProgressRing = memo(function ProgressRing({
  value,
  size = 96,
  strokeWidth = 9,
  label,
  sublabel,
  className,
  colorClassName = 'text-primary',
}: ProgressRingProps) {
  const clamped = Math.min(100, Math.max(0, value))
  const radius = (size - strokeWidth) / 2
  const circumference = radius * CIRCLE_RATIO

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="text-border"
          stroke="currentColor"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={colorClassName}
          stroke="currentColor"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - (clamped / 100) * circumference }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-semibold tabular-nums">{label ?? `${Math.round(clamped)}%`}</span>
        {sublabel ? <span className="text-muted-foreground text-[11px]">{sublabel}</span> : null}
      </div>
    </div>
  )
})
