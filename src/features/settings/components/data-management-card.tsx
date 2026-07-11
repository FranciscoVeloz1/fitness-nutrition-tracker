import { useState } from 'react'
import { toast } from 'sonner'
import { RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/common/confirm-dialog'
import { useResetSettings } from '@/hooks/use-settings'

export function DataManagementCard() {
  const [resetDialogOpen, setResetDialogOpen] = useState(false)
  const resetSettings = useResetSettings()

  const handleConfirmReset = (): void => {
    resetSettings.mutate(undefined, {
      onSuccess: () => {
        toast.success('Configuración restablecida a los valores predeterminados')
        setResetDialogOpen(false)
      },
      onError: (error) => toast.error('Error al restablecer', { description: error.message }),
    })
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        <Button variant="destructive" onClick={() => setResetDialogOpen(true)}>
          <RotateCcw className="size-4" />
          Restablecer ajustes
        </Button>
      </div>

      <ConfirmDialog
        open={resetDialogOpen}
        onOpenChange={setResetDialogOpen}
        title="¿Restablecer la configuración?"
        description="Esto restablece el plan de comidas, las metas y las unidades a los valores predeterminados. Los registros diarios en la nube no se eliminan. Esta acción no se puede deshacer."
        confirmLabel="Restablecer"
        destructive
        isConfirming={resetSettings.isPending}
        onConfirm={handleConfirmReset}
      />
    </div>
  )
}
