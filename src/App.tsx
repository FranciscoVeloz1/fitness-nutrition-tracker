import { AppProviders } from '@/providers/app-providers'
import { AppRoutes } from '@/routes/router'

export default function App() {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  )
}
