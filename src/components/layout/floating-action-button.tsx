import { useNavigate } from 'react-router-dom'
import { Plus, Scale, Dumbbell, UtensilsCrossed } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ROUTES } from '@/routes/paths'

const QUICK_ACTIONS = [
  { label: 'Registrar peso', to: ROUTES.weight, icon: Scale },
  { label: 'Registrar entrenamiento', to: ROUTES.workout, icon: Dumbbell },
  { label: 'Actualizar comidas', to: ROUTES.meals, icon: UtensilsCrossed },
]

/** Global quick-add entry point, always reachable regardless of the current page. */
export function FloatingActionButton() {
  const navigate = useNavigate()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Acciones rápidas"
          className="fixed right-4 bottom-20 z-30 inline-flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform active:scale-95 lg:right-8 lg:bottom-8"
        >
          <Plus className="size-6" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="top" className="w-48">
        <DropdownMenuLabel>Acciones rápidas</DropdownMenuLabel>
        {QUICK_ACTIONS.map((action) => (
          <DropdownMenuItem key={action.to} onClick={() => navigate(action.to)}>
            <action.icon className="size-4" />
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
