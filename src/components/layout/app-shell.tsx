import { Suspense } from 'react'
import { useLocation, useOutlet } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Sidebar } from '@/components/layout/sidebar'
import { BottomNav } from '@/components/layout/bottom-nav'
import { TopBar } from '@/components/layout/top-bar'
import { FloatingActionButton } from '@/components/layout/floating-action-button'
import { PageTransition } from '@/components/common/page-transition'
import { ErrorBoundary } from '@/components/common/error-boundary'
import { StatCardGridSkeleton } from '@/components/common/loading-skeletons'

export function AppShell() {
  const location = useLocation()
  const outlet = useOutlet()

  return (
    <div className="min-h-svh">
      <Sidebar />
      <TopBar />

      <main className="mx-auto max-w-6xl px-4 pt-4 pb-28 lg:ml-64 lg:px-8 lg:pt-8 lg:pb-16">
        <ErrorBoundary key={location.pathname}>
          <Suspense fallback={<StatCardGridSkeleton />}>
            <AnimatePresence mode="wait" initial={false}>
              <PageTransition key={location.pathname}>{outlet}</PageTransition>
            </AnimatePresence>
          </Suspense>
        </ErrorBoundary>
      </main>

      <FloatingActionButton />
      <BottomNav />
    </div>
  )
}
