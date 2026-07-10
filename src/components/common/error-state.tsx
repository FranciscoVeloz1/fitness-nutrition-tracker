import { AlertCircle, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
}

/** Inline error UI for failed queries — pairs with `ErrorBoundary`, which only catches render-time throws. */
export function ErrorState({ title = 'Error al cargar los datos', message, onRetry }: ErrorStateProps) {
  return (
    <div className="border-destructive/30 bg-destructive/5 flex flex-col items-center gap-3 rounded-2xl border px-6 py-10 text-center">
      <div className="text-destructive bg-destructive/10 rounded-full p-3">
        <AlertCircle className="size-6" />
      </div>
      <div className="space-y-1">
        <p className="font-medium">{title}</p>
        {message ? <p className="text-muted-foreground max-w-sm text-sm">{message}</p> : null}
      </div>
      {onRetry ? (
        <Button onClick={onRetry} variant="outline" size="sm">
          <RotateCcw className="size-4" />
          Reintentar
        </Button>
      ) : null}
    </div>
  )
}
