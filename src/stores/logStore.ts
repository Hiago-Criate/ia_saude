import { create } from 'zustand'

export interface LogEntry {
  level: string | number
  time: number
  msg: string
  service?: string
  phone?: string
  event?: string
  action?: string
  error?: unknown
  [key: string]: unknown
}

interface LogStore {
  logs: LogEntry[]
  paused: boolean
  addLog: (entry: LogEntry) => void
  clear: () => void
  setPaused: (paused: boolean) => void
}

export const useLogStore = create<LogStore>((set) => ({
  logs: [],
  paused: false,
  addLog: (entry) =>
    set((state) => {
      if (state.paused) return state
      const logs = state.logs.length >= 1000
        ? [...state.logs.slice(-999), entry]
        : [...state.logs, entry]
      return { logs }
    }),
  clear: () => set({ logs: [] }),
  setPaused: (paused) => set({ paused }),
}))
