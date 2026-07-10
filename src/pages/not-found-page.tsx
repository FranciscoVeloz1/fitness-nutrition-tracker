import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/common/empty-state'
import { ROUTES } from '@/routes/paths'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <EmptyState
        icon={Compass}
        title="Página no encontrada"
        description="La página que buscas no existe o fue movida."
        action={
          <Button asChild>
            <Link to={ROUTES.dashboard}>Volver al inicio</Link>
          </Button>
        }
      />
    </div>
  )
}
