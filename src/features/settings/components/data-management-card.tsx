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
      onSuccess: () => toast.success('Backup downloaded'),
      onError: (error) => toast.error('Export failed', { description: error.message }),
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
        toast.success('Data restored from backup')
        setImportDialogOpen(false)
        setPendingFile(null)
      },
      onError: (error) => {
        const message = error instanceof BackupValidationError ? error.message : 'Import failed'
        toast.error(message)
      },
    })
  }

  const handleConfirmReset = (): void => {
    resetAllData.mutate(undefined, {
      onSuccess: () => {
        toast.success('All data has been reset')
        setResetDialogOpen(false)
      },
      onError: (error) => toast.error('Reset failed', { description: error.message }),
    })
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" onClick={handleExport} disabled={exportBackup.isPending}>
          <Download className="size-4" />
          Export JSON
        </Button>

        <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
          <Upload className="size-4" />
          Import JSON
        </Button>
        <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleFileSelected} />

        <Button variant="destructive" onClick={() => setResetDialogOpen(true)}>
          <Trash2 className="size-4" />
          Reset all data
        </Button>
      </div>

      <ConfirmDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        title="Restore from backup?"
        description="This will replace all current meals, workouts, weight entries, and settings with the contents of the selected file. This cannot be undone."
        confirmLabel="Restore"
        destructive
        isConfirming={importBackup.isPending}
        onConfirm={handleConfirmImport}
      />

      <ConfirmDialog
        open={resetDialogOpen}
        onOpenChange={setResetDialogOpen}
        title="Reset all data?"
        description="This permanently deletes every meal, workout, and weight entry, and restores default settings. This cannot be undone."
        confirmLabel="Reset everything"
        destructive
        isConfirming={resetAllData.isPending}
        onConfirm={handleConfirmReset}
      />
    </div>
  )
}
