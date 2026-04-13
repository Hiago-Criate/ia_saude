import { useMetrics, useStats } from '@/api/metrics'
import { Users, Activity, ShoppingBag, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useLogStore, type LogEntry } from '@/stores/logStore'
import { levelName } from '@/lib/utils'

function Card({ title, value, icon: Icon, color, sub }: {
  title: string
  value: string | number
  icon: React.ComponentType<{ size?: number; className?: string }>
  color: string
  sub?: string
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">{title}</div>
          <div className="text-2xl font-bold text-white">{value}</div>
          {sub && <div className="text-xs text-gray-500 mt-1">{sub}</div>}
        </div>
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
    </div>
  )
}

export function MetricsCards() {
  const { data: metrics } = useMetrics()
  const { data: stats } = useStats()
  const logs = useLogStore((s: { logs: LogEntry[] }) => s.logs)
  const errorsLastHour = logs.filter(
    (l: LogEntry) => levelName(l.level) === 'error' && Date.now() - l.time < 3_600_000
  ).length

  const chartData = stats?.quotes_by_day
    ? Object.entries(stats.quotes_by_day)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, count]) => ({ date: date.slice(5), count }))
    : []

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card
          title="Usuários"
          value={metrics?.db.total_users ?? '—'}
          icon={Users}
          color="bg-blue-600"
          sub={`${metrics?.db.active_pharmacies ?? 0} farmácias ativas`}
        />
        <Card
          title="Cotações ativas"
          value={metrics?.db.active_quotes ?? '—'}
          icon={Activity}
          color="bg-purple-600"
          sub={`${metrics?.db.completed_quotes_today ?? 0} concluídas hoje`}
        />
        <Card
          title="Fila BullMQ"
          value={`${metrics?.queue.waiting ?? 0}/${metrics?.queue.active ?? 0}`}
          icon={ShoppingBag}
          color="bg-amber-600"
          sub={`${metrics?.queue.failed ?? 0} falhas`}
        />
        <Card
          title="Erros (1h)"
          value={errorsLastHour}
          icon={TrendingUp}
          color={errorsLastHour > 0 ? 'bg-red-600' : 'bg-green-600'}
          sub="erros no log buffer"
        />
      </div>

      {chartData.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-4">
            Cotações — últimos 7 dias
          </h3>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={chartData} barSize={20}>
              <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#1f2937', border: '1px solid #374151', color: '#e5e7eb', fontSize: 12 }}
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
