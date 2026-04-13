import { useRef, useEffect, useState } from 'react'
import { useLogStore, type LogEntry } from '@/stores/logStore'
import { useSSELogs } from '@/hooks/useSSELogs'
import { cn, formatTime, levelName, LEVEL_COLORS, LEVEL_BG } from '@/lib/utils'
import { Pause, Play, Trash2, ChevronDown, ChevronRight } from 'lucide-react'

interface LogEntryRowProps {
  entry: LogEntry
}

function LogEntryRow({ entry }: LogEntryRowProps) {
  const [expanded, setExpanded] = useState(false)
  const lvl = levelName(entry.level)
  const extra: Record<string, unknown> = { ...entry }
  delete extra['level']
  delete extra['time']
  delete extra['msg']
  delete extra['service']
  delete extra['pid']
  delete extra['hostname']

  const hasExtra = Object.keys(extra).length > 0

  return (
    <div className={cn('border-b border-gray-800 text-xs font-mono', LEVEL_BG[lvl] ?? 'bg-gray-900')}>
      <div
        className={cn('flex items-start gap-2 px-3 py-1.5', hasExtra && 'cursor-pointer hover:brightness-110')}
        onClick={() => hasExtra && setExpanded(!expanded)}
      >
        <span className="text-gray-600 shrink-0 w-16">{formatTime(entry.time)}</span>
        <span className={cn('uppercase font-bold w-10 shrink-0', LEVEL_COLORS[lvl])}>{lvl}</span>
        <span className="text-gray-300 flex-1 break-all">{entry.msg}</span>
        {hasExtra && (
          expanded
            ? <ChevronDown size={12} className="text-gray-500 shrink-0 mt-0.5" />
            : <ChevronRight size={12} className="text-gray-500 shrink-0 mt-0.5" />
        )}
      </div>
      {expanded && hasExtra && (
        <div className="px-3 pb-2 pl-16">
          <pre className="text-gray-400 text-xs overflow-auto max-h-64 bg-black/30 rounded p-2">
            {JSON.stringify(extra, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

const LEVELS = ['trace', 'debug', 'info', 'warn', 'error']

export function LogViewer() {
  useSSELogs(true)
  const { logs, paused, clear, setPaused } = useLogStore()
  const [levelFilter, setLevelFilter] = useState<string[]>([])
  const [textFilter, setTextFilter] = useState('')
  const [autoScroll, setAutoScroll] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  const filtered = logs.filter((entry: LogEntry) => {
    const lvl = levelName(entry.level)
    if (levelFilter.length > 0 && !levelFilter.includes(lvl)) return false
    if (textFilter && !JSON.stringify(entry).toLowerCase().includes(textFilter.toLowerCase())) return false
    return true
  })

  useEffect(() => {
    if (autoScroll && !paused) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [filtered.length, autoScroll, paused])

  const toggleLevel = (lvl: string) => {
    setLevelFilter((prev) =>
      prev.includes(lvl) ? prev.filter((l) => l !== lvl) : [...prev, lvl]
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-2 border-b border-gray-800 bg-gray-900 shrink-0 flex-wrap">
        <div className="flex gap-1">
          {LEVELS.map((lvl) => (
            <button
              key={lvl}
              onClick={() => toggleLevel(lvl)}
              className={cn(
                'px-2 py-0.5 rounded text-xs font-mono border transition-colors',
                levelFilter.includes(lvl)
                  ? 'border-blue-500 bg-blue-900 text-blue-300'
                  : 'border-gray-700 text-gray-500 hover:border-gray-600'
              )}
            >
              {lvl}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={textFilter}
          onChange={(e) => setTextFilter(e.target.value)}
          placeholder="Filtrar mensagens..."
          className="flex-1 min-w-32 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-gray-300 placeholder-gray-600 outline-none focus:border-gray-500"
        />

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-gray-600">{filtered.length} logs</span>
          <button
            onClick={() => setPaused(!paused)}
            className="flex items-center gap-1 text-xs px-2 py-1 rounded border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500"
          >
            {paused ? <Play size={12} /> : <Pause size={12} />}
            {paused ? 'Retomar' : 'Pausar'}
          </button>
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={cn(
              'text-xs px-2 py-1 rounded border',
              autoScroll ? 'border-blue-700 text-blue-400' : 'border-gray-700 text-gray-500'
            )}
          >
            Auto-scroll
          </button>
          <button
            onClick={clear}
            className="flex items-center gap-1 text-xs px-2 py-1 rounded border border-red-900 text-red-500 hover:bg-red-900/30"
          >
            <Trash2 size={12} />
            Limpar
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-gray-950">
        {filtered.length === 0 && (
          <div className="flex items-center justify-center h-32 text-gray-600 text-sm">
            {logs.length === 0 ? 'Aguardando conexão SSE...' : 'Nenhum log corresponde ao filtro'}
          </div>
        )}
        {filtered.map((entry: LogEntry, i: number) => (
          <LogEntryRow key={`${entry.time}-${i}`} entry={entry} />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
