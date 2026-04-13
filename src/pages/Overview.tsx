import { MetricsCards } from '@/components/overview/MetricsCards'
import { ActivityFeed } from '@/components/overview/ActivityFeed'
import { useMetrics } from '@/api/metrics'

export function Overview() {
  const { data: metrics } = useMetrics()

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-100">Overview</h1>
        <p className="text-sm text-gray-500 mt-0.5">Status em tempo real do Vita Core</p>
      </div>

      {/* Service Status */}
      {metrics && (
        <div className="flex items-center gap-3 flex-wrap">
          {[
            { label: 'Redis', ok: metrics.services.redis.status === 'ok' },
            { label: 'Supabase', ok: metrics.services.supabase.status === 'ok' },
            { label: 'BullMQ', ok: metrics.queue.waiting >= 0 },
          ].map(({ label, ok }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-gray-900 border-gray-800"
            >
              <span
                className={`w-2 h-2 rounded-full ${ok ? 'bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.6)]' : 'bg-red-400'}`}
              />
              <span className="text-xs text-gray-300">{label}</span>
            </div>
          ))}
        </div>
      )}

      <MetricsCards />

      <div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Atividade Recente
        </h2>
        <ActivityFeed />
      </div>
    </div>
  )
}
