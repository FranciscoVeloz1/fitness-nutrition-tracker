import {
  LayoutDashboard,
  UtensilsCrossed,
  Dumbbell,
  Scale,
  CalendarDays,
  LineChart,
  Settings,
  type LucideIcon,
} from 'lucide-react'
import { ROUTES } from '@/routes/paths'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
}

/** Full navigation, used verbatim by the desktop sidebar. */
export const NAV_ITEMS: NavItem[] = [
  { to: ROUTES.dashboard, label: 'Inicio', icon: LayoutDashboard },
  { to: ROUTES.meals, label: 'Comidas', icon: UtensilsCrossed },
  { to: ROUTES.workout, label: 'Entrenamiento', icon: Dumbbell },
  { to: ROUTES.weight, label: 'Peso', icon: Scale },
  { to: ROUTES.history, label: 'Historial', icon: CalendarDays },
  { to: ROUTES.analytics, label: 'Estadísticas', icon: LineChart },
  { to: ROUTES.settings, label: 'Configuración', icon: Settings },
]

/** The four most-used destinations, pinned to the mobile bottom nav (a 5th slot opens "More"). */
export const MOBILE_PRIMARY_NAV_ITEMS: NavItem[] = [
  NAV_ITEMS[0],
  NAV_ITEMS[1],
  NAV_ITEMS[2],
  NAV_ITEMS[3],
]

/** Overflow destinations surfaced behind the mobile "More" sheet. */
export const MOBILE_MORE_NAV_ITEMS: NavItem[] = [NAV_ITEMS[4], NAV_ITEMS[5], NAV_ITEMS[6]]
