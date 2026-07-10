import { useRef, useState, type ChangeEvent } from 'react'
import { toast } from 'sonner'
import { Download, Upload, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/common/confirm-dialog'
import { useExportBackup, useImportBackup, useResetAllData } from '@/hooks/use-backup'
import { BackupValidationError } from '@/services/backup'

export function DataManagementCard() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [resetDialogOpen, setResetDialogOpen] = useState(false)
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [pendingFile, setPendingFile] = useState<File | null>(null)

  const exportBackup = useExportBackup()
  const importBackup = useImportBackup()
  const resetAllData = useResetAllData()

  const handleExport = (): void => {
    exportBackup.mutate(undefined, {
      onSuccess: () => toast.success('Copia de seguridad descargada'),
      onError: (error) => toast.error('Error al exportar', { description: error.message }),
    })
  }

  const handleFileSelected = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0]
    if (file) {
      setPendingFile(file)
      setImportDialogOpen(true)
    }
    event.target.value = ''
  }

  const handleConfirmImport = (): void => {
    if (!pendingFile) {
      return
    }
    importBackup.mutate(pendingFile, {
      onSuccess: () => {
        toast.success('Datos restaurados desde la copia de seguridad')
        setImportDialogOpen(false)
        setPendingFile(null)
      },
      onError: (error) => {
        const message = error instanceof BackupValidationError ? error.message : 'Error al importar'
        toast.error(message)
      },
    })
  }

  const handleConfirmReset = (): void => {
    resetAllData.mutate(undefined, {
      onSuccess: () => {
        toast.success('Todos los datos se restablecieron')
        setResetDialogOpen(false)
      },
      onError: (error) => toast.error('Error al restablecer', { description: error.message }),
    })
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" onClick={handleExport} disabled={exportBackup.isPending}>
          <Download className="size-4" />
          Exportar JSON
        </Button>

        <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
          <Upload className="size-4" />
          Importar JSON
        </Button>
        <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleFileSelected} />

        <Button variant="destructive" onClick={() => setResetDialogOpen(true)}>
          <Trash2 className="size-4" />
          Restablecer todos los datos
        </Button>
      </div>

      <ConfirmDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        title="¿Restaurar desde una copia de seguridad?"
        description="Esto reemplazará todas las comidas, entrenamientos, registros de peso y la configuración actuales con el contenido del archivo seleccionado. Esta acción no se puede deshacer."
        confirmLabel="Restaurar"
        destructive
        isConfirming={importBackup.isPending}
        onConfirm={handleConfirmImport}
      />

      <ConfirmDialog
        open={resetDialogOpen}
        onOpenChange={setResetDialogOpen}
        title="¿Restablecer todos los datos?"
        description="Esto elimina permanentemente cada comida, entrenamiento y registro de peso, y restablece la configuración predeterminada. Esta acción no se puede deshacer."
        confirmLabel="Restablecer todo"
        destructive
        isConfirming={resetAllData.isPending}
        onConfirm={handleConfirmReset}
      />
    </div>
  )
}
