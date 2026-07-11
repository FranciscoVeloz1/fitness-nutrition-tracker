import type { DailyRecord } from '@/types/daily-record'
import type { DateKey } from '@/types/common'
import * as fitnessApi from '@/api/fitness'
import { requireFitnessApiSession } from '@/api/fitness-session'

export class DailyRecordsRepository {
  async get(date: DateKey): Promise<DailyRecord | undefined> {
    const { userId, request } = requireFitnessApiSession()
    return fitnessApi.getDailyRecord(userId, date, request)
  }

  async save(record: DailyRecord): Promise<DailyRecord> {
    const { userId, request } = requireFitnessApiSession()
    const { date, ...body } = record
    return fitnessApi.putDailyRecord(userId, date, body, request)
  }

  async delete(date: DateKey): Promise<void> {
    const { userId, request } = requireFitnessApiSession()
    return fitnessApi.deleteDailyRecord(userId, date, request)
  }

  async listRange(startDate: DateKey, endDate: DateKey): Promise<DailyRecord[]> {
    const { userId, request } = requireFitnessApiSession()
    return fitnessApi.listDailyRecords(userId, startDate, endDate, request)
  }

  async listAll(): Promise<DailyRecord[]> {
    return this.listRange('2000-01-01', '2100-12-31')
  }

  async clearAll(): Promise<void> {
    const records = await this.listAll()
    await Promise.all(records.map((record) => this.delete(record.date)))
  }
}

export const dailyRecordsRepository = new DailyRecordsRepository()
