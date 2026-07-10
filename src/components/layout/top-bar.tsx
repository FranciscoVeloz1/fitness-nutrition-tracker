import { Activity, WifiOff } from 'lucide-react'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { useOnlineStatus } from '@/hooks/use-online-status'

export function TopBar() {
  const isOnline = useOnlineStatus()

  return (
    <header className="safe-top sticky top-0 z-20 flex items-center justify-between border-b bg-background/80 px-4 py-3 backdrop-blur-xl lg:hidden">
      <div className="flex items-center gap-2">
        <span className="bg-primary/15 text-primary inline-flex size-8 items-center justify-center rounded-lg">
          <Activity className="size-4" />
        </span>
        <span className="text-sm font-semibold">FitTrack</span>
      </div>
      <div className="flex items-center gap-2">
        {!isOnline ? (
          <span className="text-muted-foreground flex items-center gap-1 text-xs" title="Estás sin conexión — todo sigue funcionando">
            <WifiOff className="size-3.5" />
            Sin conexión
          </span>
        ) : null}
        <ThemeToggle />
      </div>
    </header>
  )
}
