import { CheckCircle2, Circle, Clock, AlertCircle, Zap, Package, Cloud, Shield } from 'lucide-react'

interface RoadmapItem {
  id: string
  label: string
  description: string
  status: 'done' | 'in_progress' | 'pending' | 'blocked'
  priority?: 'high' | 'medium' | 'low'
  category: string
}

const ITEMS: RoadmapItem[] = [
  // DONE
  {
    id: 'infra-redis',
    label: 'Redis + BullMQ local',
    description: 'Fila de cotações com jobs por farmácia',
    status: 'done',
    category: 'Infraestrutura',
  },
  {
    id: 'webhook-uazapi',
    label: 'Webhook UazAPI normalizado',
    description: 'Suporte ao formato real criate (EventType, sender_pn)',
    status: 'done',
    category: 'WhatsApp',
  },
  {
    id: 'e2e-lgpd',
    label: 'Fluxo end-to-end LGPD',
    description: 'PatientAgent cria usuário e envia LGPD confirmado',
    status: 'done',
    category: 'Agentes',
  },
  {
    id: 'bug-medicine-lost',
    label: 'Fix: medicamento perdido entre estados',
    description: 'Agora persistido em Redis (vita:pending_medicine:userId)',
    status: 'done',
    category: 'Bugs',
  },
  {
    id: 'bug-quote-never-created',
    label: 'Fix: cotação nunca criada',
    description: 'handleAwaitingConfirmation chamava startQuote(null) — corrigido para createAndStartQuote',
    status: 'done',
    category: 'Bugs',
  },
  {
    id: 'bug-location-loop',
    label: 'Fix: loop infinito localização texto',
    description: 'Fallback para coordenadas existentes se usuário digitar texto',
    status: 'done',
    category: 'Bugs',
  },
  {
    id: 'admin-backend',
    label: 'Backend admin (SSE logs, métricas, data)',
    description: '/admin/logs/stream, /admin/metrics, /admin/users, /admin/quotes',
    status: 'done',
    category: 'Dashboard',
  },
  {
    id: 'prompt-table',
    label: 'Tabela agent_prompts no Supabase',
    description: '6 prompts seedados, editor Monaco no dashboard',
    status: 'done',
    category: 'Dashboard',
  },
  {
    id: 'dashboard-frontend',
    label: 'Dashboard frontend (Vite + React + TailwindCSS)',
    description: 'Overview, Logs SSE, Workflow, Usuários, Cotações, Roadmap',
    status: 'done',
    category: 'Dashboard',
  },

  // IN PROGRESS / NEXT
  {
    id: 'test-full-flow',
    label: 'Testar fluxo completo end-to-end',
    description: 'Usuário → LGPD → remédio → localização → confirmação → cotação → resposta',
    status: 'in_progress',
    priority: 'high',
    category: 'Testes',
  },
  {
    id: 'pharmacy-agent-test',
    label: 'Testar PharmacyAgent (resposta cotação)',
    description: 'Farmácia recebe pedido e responde com preço via WhatsApp',
    status: 'pending',
    priority: 'high',
    category: 'Testes',
  },
  {
    id: 'orchestrator-timeout',
    label: 'Testar timeout e aggregateAndRespond',
    description: 'OrchestratorAgent envia resultado de preços ao usuário',
    status: 'pending',
    priority: 'high',
    category: 'Testes',
  },

  // PRODUCTION
  {
    id: 'railway-deploy',
    label: 'Deploy no Railway',
    description: 'Dockerfile + railway.toml prontos — URL fixa sem reconectar webhook',
    status: 'pending',
    priority: 'high',
    category: 'Produção',
  },
  {
    id: 'google-places',
    label: 'Google Places API Key',
    description: 'Busca automática de farmácias por raio — agora retorna [] sem chave',
    status: 'pending',
    priority: 'medium',
    category: 'Produção',
  },
  {
    id: 'real-pharmacies',
    label: 'Cadastrar farmácias reais no banco',
    description: 'Farmácias com WhatsApp, lat/lng, horário de funcionamento',
    status: 'pending',
    priority: 'high',
    category: 'Produção',
  },
  {
    id: 'remove-dev-bypass',
    label: 'Remover dev bypass do validator.ts',
    description: 'Restaurar validação do webhook secret em produção',
    status: 'pending',
    priority: 'medium',
    category: 'Produção',
  },
  {
    id: 'admin-secret',
    label: 'Configurar ADMIN_SECRET',
    description: 'Proteger rotas /admin com header x-admin-secret',
    status: 'pending',
    priority: 'medium',
    category: 'Produção',
  },
  {
    id: 'multi-instance',
    label: 'Redis pub/sub para logs multi-instância',
    description: 'Log buffer atual é in-process — escalar horizontalmente no Railway',
    status: 'pending',
    priority: 'low',
    category: 'Infraestrutura',
  },
]

const STATUS_CONFIG = {
  done: { icon: CheckCircle2, color: '#10b981', label: 'Concluído' },
  in_progress: { icon: Clock, color: '#3b82f6', label: 'Em andamento' },
  pending: { icon: Circle, color: '#6b7280', label: 'Pendente' },
  blocked: { icon: AlertCircle, color: '#ef4444', label: 'Bloqueado' },
}

const PRIORITY_COLORS = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#6b7280',
}

const CATEGORY_ICONS: Record<string, typeof Zap> = {
  Infraestrutura: Zap,
  WhatsApp: Package,
  Agentes: Zap,
  Bugs: AlertCircle,
  Dashboard: Cloud,
  Testes: CheckCircle2,
  Produção: Shield,
}

export function RoadmapPanel() {
  // Group by category
  const categories = Array.from(new Set(ITEMS.map(i => i.category)))

  const stats = {
    done: ITEMS.filter(i => i.status === 'done').length,
    total: ITEMS.length,
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Progresso geral</span>
          <span className="text-sm font-mono text-gray-300">
            {stats.done}/{stats.total}
          </span>
        </div>
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all"
            style={{ width: `${(stats.done / stats.total) * 100}%` }}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
          const Icon = cfg.icon
          const count = ITEMS.filter(i => i.status === key).length
          return (
            <div key={key} className="flex items-center gap-1.5">
              <Icon size={12} style={{ color: cfg.color }} />
              <span className="text-xs text-gray-500">
                {cfg.label} <span className="text-gray-600">({count})</span>
              </span>
            </div>
          )
        })}
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {categories.map(cat => {
          const items = ITEMS.filter(i => i.category === cat)
          const CatIcon = CATEGORY_ICONS[cat] ?? Zap
          return (
            <div key={cat}>
              <div className="flex items-center gap-2 mb-3">
                <CatIcon size={14} className="text-gray-500" />
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{cat}</h2>
                <span className="text-xs text-gray-700">
                  {items.filter(i => i.status === 'done').length}/{items.length}
                </span>
              </div>
              <div className="space-y-2">
                {items.map(item => {
                  const cfg = STATUS_CONFIG[item.status]
                  const Icon = cfg.icon
                  return (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 rounded-lg border border-gray-800 bg-gray-900/50 px-3 py-2.5"
                    >
                      <Icon
                        size={14}
                        className="mt-0.5 flex-shrink-0"
                        style={{ color: cfg.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-medium ${
                              item.status === 'done' ? 'text-gray-500 line-through' : 'text-gray-200'
                            }`}
                          >
                            {item.label}
                          </span>
                          {item.priority && item.status !== 'done' && (
                            <span
                              className="text-[9px] px-1.5 py-0.5 rounded font-mono uppercase"
                              style={{
                                color: PRIORITY_COLORS[item.priority],
                                backgroundColor: `${PRIORITY_COLORS[item.priority]}18`,
                              }}
                            >
                              {item.priority}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
