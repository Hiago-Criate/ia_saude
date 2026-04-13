import { useMetrics } from '@/api/metrics'
import { cn } from '@/lib/utils'

interface StatusDotProps {
  ok: boolean
  label: string
  latencyMs?: number
}

function StatusDot({ ok, label, latencyMs }: StatusDotProps) {
  return (
    <div className="flex items-center gap-1.5 text-xs">
      <div className={cn('w-2 h-2 rounded-full', ok ? 'bg-green-400' : 'bg-red-500 animate-pulse')} />
      <span className={cn(ok ? 'text-gray-400' : 'text-red-400')}>{label}</span>
      {ok && latencyMs !== undefined && (
        <span className="text-gray-600">{latencyMs}ms</span>
      )}
    </div>
  )
}

export function TopBar() {
  const { data: metrics } = useMetrics()

  return (
    <div className="h-12 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6 z-10 flex-shrink-0">
      <span className="text-gray-500 text-xs font-mono">vita-core admin</span>

      <div className="flex items-center gap-4">
        <StatusDot
          ok={metrics?.services.redis.status === 'ok'}
          label="Redis"
          latencyMs={metrics?.services.redis.latencyMs}
        />
        <StatusDot
          ok={metrics?.services.supabase.status === 'ok'}
          label="Supabase"
          latencyMs={metrics?.services.supabase.latencyMs}
        />
        <StatusDot
          ok={(metrics?.queue.active ?? 0) >= 0}
          label={`Queue: ${metrics?.queue.waiting ?? 0}↑ ${metrics?.queue.active ?? 0}⚡`}
        />
      </div>
    </div>
  )
}
