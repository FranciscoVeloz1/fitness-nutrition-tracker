import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorBoundaryProps {
  children: ReactNode
  /** Label shown in the fallback UI, e.g. "the dashboard". Defaults to "this page". */
  scopeLabel?: string
}

interface ErrorBoundaryState {
  error: Error | undefined
}

/**
 * Route/feature-shell boundary. Catches render-time exceptions so one
 * broken section (e.g. a malformed imported record) can't blank the whole
 * app. Data-fetch errors are handled separately via TanStack Query's own
 * `error` state — this only guards against unexpected render throws.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: undefined }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  private handleReset = (): void => {
    this.setState({ error: undefined })
  }

  render(): ReactNode {
    if (this.state.error) {
      return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8 text-center">
          <div className="bg-destructive/10 text-destructive rounded-full p-3">
            <AlertTriangle className="size-6" />
          </div>
          <div className="space-y-1">
            <p className="text-lg font-semibold">Something went wrong in {this.props.scopeLabel ?? 'this page'}</p>
            <p className="text-muted-foreground max-w-sm text-sm">
              {this.state.error.message || 'An unexpected error occurred. You can try again below.'}
            </p>
          </div>
          <Button onClick={this.handleReset} variant="outline">
            <RotateCcw className="size-4" />
            Try again
          </Button>
        </div>
      )
    }
    return this.props.children
  }
}
