import { ProgressRing } from '@/components/common/progress-ring'
import type { AdherenceStat } from '@/types/statistics'

export function AdherenceSummary({ stat }: { stat: AdherenceStat }) {
  return (
    <div className="glass-panel flex items-center gap-5 rounded-2xl p-5">
      <ProgressRing value={stat.adherencePct} size={84} strokeWidth={8} />
      <div className="grid flex-1 grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-success text-lg font-semibold tabular-nums">{stat.followedCount}</p>
          <p className="text-muted-foreground text-xs">Cumplido</p>
        </div>
        <div>
          <p className="text-warning text-lg font-semibold tabular-nums">{stat.modifiedCount}</p>
          <p className="text-muted-foreground text-xs">Modificado</p>
        </div>
        <div>
          <p className="text-destructive text-lg font-semibold tabular-nums">{stat.skippedCount}</p>
          <p className="text-muted-foreground text-xs">Omitido</p>
        </div>
      </div>
    </div>
  )
}
