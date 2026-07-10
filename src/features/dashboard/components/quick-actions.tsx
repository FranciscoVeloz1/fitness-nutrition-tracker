import { Link } from 'react-router-dom'
import { Scale, Dumbbell, UtensilsCrossed, LineChart } from 'lucide-react'
import { ROUTES } from '@/routes/paths'

const ACTIONS = [
  { to: ROUTES.meals, label: 'Log meals', icon: UtensilsCrossed, accent: 'bg-primary/10 text-primary' },
  { to: ROUTES.workout, label: 'Log workout', icon: Dumbbell, accent: 'bg-accent/15 text-accent' },
  { to: ROUTES.weight, label: 'Log weight', icon: Scale, accent: 'bg-warning/15 text-warning' },
  { to: ROUTES.analytics, label: 'View analytics', icon: LineChart, accent: 'bg-success/15 text-success' },
]

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {ACTIONS.map((action) => (
        <Link
          key={action.to}
          to={action.to}
          className="glass-panel flex flex-col items-center gap-2 rounded-2xl p-4 text-center transition-transform active:scale-[0.97]"
        >
          <span className={`inline-flex rounded-full p-2.5 ${action.accent}`}>
            <action.icon className="size-5" />
          </span>
          <span className="text-sm font-medium">{action.label}</span>
        </Link>
      ))}
    </div>
  )
}
