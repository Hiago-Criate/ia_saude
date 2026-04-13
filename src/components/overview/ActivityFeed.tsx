import { useLogStore, type LogEntry } from '@/stores/logStore'
import { useSSELogs } from '@/hooks/useSSELogs'
import { cn, formatTime, levelName, LEVEL_COLORS } from '@/lib/utils'

export function ActivityFeed() {
  useSSELogs(true)
  const logs = useLogStore((s: { logs: LogEntry[] }) => s.logs)
  const recent = logs.slice(-25).reverse()

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-800">
        <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wider">
          Atividade Recente
        </h3>
      </div>
      <div className="divide-y divide-gray-800 max-h-80 overflow-auto">
        {recent.length === 0 && (
          <div className="px-4 py-6 text-center text-gray-600 text-sm">
            Aguardando eventos...
          </div>
        )}
        {recent.map((entry: LogEntry, i: number) => {
          const lvl = levelName(entry.level)
          return (
            <div key={`${entry.time}-${i}`} className="flex items-start gap-3 px-4 py-2 text-xs hover:bg-gray-800/50">
              <span className="text-gray-600 shrink-0 w-14">{formatTime(entry.time)}</span>
              <span className={cn('uppercase font-bold w-9 shrink-0', LEVEL_COLORS[lvl])}>{lvl}</span>
              <span className="text-gray-300 break-all line-clamp-2">{entry.msg}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
