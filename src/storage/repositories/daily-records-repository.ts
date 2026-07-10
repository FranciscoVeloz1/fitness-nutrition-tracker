import { getStorageAdapter } from '@/storage/storage-provider'
import { STORAGE_KEYS } from '@/storage/keys'
import type { DailyRecord } from '@/types/daily-record'
import type { DateKey } from '@/types/common'

/**
 * Repository for per-day records. Keys are lexicographically sortable
 * (`daily:2026-07-10`), so range queries are a simple string comparison
 * instead of a secondary index — more than enough for a single-user local
 * dataset spanning years of daily entries.
 */
export class DailyRecordsRepository {
  async get(date: DateKey): Promise<DailyRecord | undefined> {
    const adapter = await getStorageAdapter()
    return adapter.get<DailyRecord>(STORAGE_KEYS.dailyRecord(date))
  }

  async save(record: DailyRecord): Promise<DailyRecord> {
    const adapter = await getStorageAdapter()
    await adapter.set(STORAGE_KEYS.dailyRecord(record.date), record)
    return record
  }

  async delete(date: DateKey): Promise<void> {
    const adapter = await getStorageAdapter()
    await adapter.delete(STORAGE_KEYS.dailyRecord(date))
  }

  /** Inclusive range lookup, sorted ascending by date. */
  async listRange(startDate: DateKey, endDate: DateKey): Promise<DailyRecord[]> {
    const adapter = await getStorageAdapter()
    const allKeys = await adapter.keys(STORAGE_KEYS.dailyRecordPrefix)
    const startKey = STORAGE_KEYS.dailyRecord(startDate)
    const endKey = STORAGE_KEYS.dailyRecord(endDate)
    const keysInRange = allKeys.filter((key) => key >= startKey && key <= endKey).sort()

    const records = await Promise.all(keysInRange.map((key) => adapter.get<DailyRecord>(key)))
    return records.filter((record): record is DailyRecord => record !== undefined)
  }

  async listAll(): Promise<DailyRecord[]> {
    const adapter = await getStorageAdapter()
    const allKeys = (await adapter.keys(STORAGE_KEYS.dailyRecordPrefix)).sort()
    const records = await Promise.all(allKeys.map((key) => adapter.get<DailyRecord>(key)))
    return records.filter((record): record is DailyRecord => record !== undefined)
  }

  async clearAll(): Promise<void> {
    const adapter = await getStorageAdapter()
    const allKeys = await adapter.keys(STORAGE_KEYS.dailyRecordPrefix)
    await Promise.all(allKeys.map((key) => adapter.delete(key)))
  }
}

export const dailyRecordsRepository = new DailyRecordsRepository()
