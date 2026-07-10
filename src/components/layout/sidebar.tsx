import { memo } from 'react'
import { NavLink } from 'react-router-dom'
import { Activity } from 'lucide-react'
import { NAV_ITEMS } from '@/routes/nav-items'
import { cn } from '@/lib/utils'

/** Persistent desktop navigation rail. Hidden below `lg` in favor of the bottom nav. */
export const Sidebar = memo(function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r px-4 py-6 lg:flex">
      <div className="mb-8 flex items-center gap-2 px-2">
        <span className="bg-primary/15 text-primary inline-flex size-9 items-center justify-center rounded-xl">
          <Activity className="size-5" />
        </span>
        <div>
          <p className="text-sm font-semibold leading-tight">FitTrack</p>
          <p className="text-muted-foreground text-xs leading-tight">Comidas · Entrenamientos · Peso</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/12 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )
            }
          >
            <item.icon className="size-4.5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <p className="text-muted-foreground px-2 text-xs">Todos tus datos permanecen en este dispositivo.</p>
    </aside>
  )
})
