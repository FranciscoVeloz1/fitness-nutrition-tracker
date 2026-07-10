import { Flame, Dumbbell } from 'lucide-react'
import { motion } from 'framer-motion'
import type { StreakStat } from '@/types/statistics'

function StreakCard({
  icon: Icon,
  label,
  streak,
  accent,
}: {
  icon: typeof Flame
  label: string
  streak: StreakStat
  accent: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="glass-panel flex items-center gap-4 rounded-2xl p-4"
    >
      <span className={`inline-flex size-12 items-center justify-center rounded-full ${accent}`}>
        <Icon className="size-6" />
      </span>
      <div>
        <p className="text-2xl font-semibold tabular-nums">
          {streak.current} <span className="text-muted-foreground text-sm font-normal">days</span>
        </p>
        <p className="text-muted-foreground text-xs">
          {label} · longest {streak.longest}d
        </p>
      </div>
    </motion.div>
  )
}

export function StreakCards({
  adherenceStreak,
  workoutStreak,
}: {
  adherenceStreak: StreakStat
  workoutStreak: StreakStat
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <StreakCard icon={Flame} label="Adherence streak" streak={adherenceStreak} accent="bg-warning/15 text-warning" />
      <StreakCard icon={Dumbbell} label="Workout streak" streak={workoutStreak} accent="bg-accent/15 text-accent" />
    </div>
  )
}
