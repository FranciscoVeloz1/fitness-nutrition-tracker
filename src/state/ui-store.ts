import { create } from 'zustand'
import type { DateKey } from '@/types/common'
import { todayKey } from '@/services/date'

/**
 * Ephemeral, cross-page UI state only. Persisted domain data (settings,
 * daily records) intentionally does NOT live here — it flows through
 * TanStack Query on top of the storage layer so there is a single source of
 * truth and no risk of the store and storage drifting apart. Zustand is the
 * right tool specifically because this state is read/written from far apart
 * components (mobile sheet, FAB, quick actions) that shouldn't be wired
 * together with prop drilling or route state.
 */
interface UiState {
  isMobileNavOpen: boolean
  isQuickActionsOpen: boolean
  /** Selected day for Meals/Workout/Weight pages; defaults to today. */
  selectedDate: DateKey
  setMobileNavOpen: (open: boolean) => void
  setQuickActionsOpen: (open: boolean) => void
  setSelectedDate: (date: DateKey) => void
  resetSelectedDateToToday: () => void
}

export const useUiStore = create<UiState>((set) => ({
  isMobileNavOpen: false,
  isQuickActionsOpen: false,
  selectedDate: todayKey(),
  setMobileNavOpen: (open) => set({ isMobileNavOpen: open }),
  setQuickActionsOpen: (open) => set({ isQuickActionsOpen: open }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  resetSelectedDateToToday: () => set({ selectedDate: todayKey() }),
}))
