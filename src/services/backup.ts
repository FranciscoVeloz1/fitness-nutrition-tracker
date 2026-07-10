import { settingsRepository } from '@/storage/repositories/settings-repository'
import { dailyRecordsRepository } from '@/storage/repositories/daily-records-repository'
import { backupFileSchema, type BackupFile } from '@/services/backup-schema'
import { SETTINGS_SCHEMA_VERSION } from '@/storage/repositories/settings-repository'

export class BackupValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'BackupValidationError'
  }
}

export async function buildBackup(): Promise<BackupFile> {
  const [settings, dailyRecords] = await Promise.all([
    settingsRepository.get(),
    dailyRecordsRepository.listAll(),
  ])

  return {
    app: 'fitness-nutrition-tracker',
    exportedAt: new Date().toISOString(),
    schemaVersion: SETTINGS_SCHEMA_VERSION,
    settings,
    dailyRecords,
  }
}

export function downloadBackup(backup: BackupFile): void {
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `fittrack-backup-${backup.exportedAt.slice(0, 10)}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function parseBackupFile(raw: string): BackupFile {
  let json: unknown
  try {
    json = JSON.parse(raw)
  } catch {
    throw new BackupValidationError('El archivo seleccionado no es un JSON válido.')
  }

  const result = backupFileSchema.safeParse(json)
  if (!result.success) {
    throw new BackupValidationError('El archivo no coincide con el formato de respaldo esperado de FitTrack.')
  }
  return result.data
}

/** Overwrites all local data with the contents of a validated backup. */
export async function restoreBackup(backup: BackupFile): Promise<void> {
  await dailyRecordsRepository.clearAll()
  await settingsRepository.save(backup.settings)
  await Promise.all(backup.dailyRecords.map((record) => dailyRecordsRepository.save(record)))
}

export async function resetAllData(): Promise<void> {
  await dailyRecordsRepository.clearAll()
  await settingsRepository.reset()
}
