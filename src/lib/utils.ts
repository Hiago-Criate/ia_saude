import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function maskPhone(phone: string): string {
  if (phone.length > 8) {
    return phone.slice(0, 4) + '****' + phone.slice(-4)
  }
  return phone
}

export const LEVEL_COLORS: Record<string, string> = {
  trace: 'text-gray-500',
  debug: 'text-slate-400',
  info: 'text-blue-400',
  warn: 'text-amber-400',
  error: 'text-red-400',
  fatal: 'text-red-600',
}

export const LEVEL_BG: Record<string, string> = {
  trace: 'bg-gray-800',
  debug: 'bg-slate-800',
  info: 'bg-blue-950',
  warn: 'bg-amber-950',
  error: 'bg-red-950',
  fatal: 'bg-red-900',
}

export function levelName(level: string | number): string {
  if (typeof level === 'string') return level.toLowerCase()
  if (level <= 10) return 'trace'
  if (level <= 20) return 'debug'
  if (level <= 30) return 'info'
  if (level <= 40) return 'warn'
  if (level <= 50) return 'error'
  return 'fatal'
}

export const STATE_COLORS: Record<string, string> = {
  idle: 'bg-gray-700 text-gray-300',
  done: 'bg-gray-700 text-gray-300',
  awaiting_medicine: 'bg-blue-900 text-blue-300',
  awaiting_location: 'bg-purple-900 text-purple-300',
  awaiting_confirmation: 'bg-amber-900 text-amber-300',
  quoting: 'bg-green-900 text-green-300',
  presenting_results: 'bg-teal-900 text-teal-300',
}
