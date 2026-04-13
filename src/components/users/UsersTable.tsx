import { useState } from 'react'
import { useUsers, type UserRow } from '@/api/data'
import { maskPhone, formatDate, STATE_COLORS } from '@/lib/utils'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { UserDetail } from './UserDetail'

const STATES = ['', 'idle', 'done', 'awaiting_medicine', 'awaiting_location', 'awaiting_confirmation', 'quoting', 'presenting_results']

export function UsersTable() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [stateFilter, setStateFilter] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { data, isLoading } = useUsers({ page, limit: 20, state: stateFilter || undefined, search: search || undefined })

  const users: UserRow[] = data?.data ?? []
  const total = data?.meta.total ?? 0

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b border-gray-800 flex-shrink-0">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar telefone…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-900 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-600 focus:outline-none focus:border-gray-500"
            />
          </div>
          <select
            value={stateFilter}
            onChange={(e) => { setStateFilter(e.target.value); setPage(1) }}
            className="text-sm bg-gray-900 border border-gray-700 rounded-lg px-2 py-1.5 text-gray-300 focus:outline-none"
          >
            {STATES.map(s => (
              <option key={s} value={s}>{s || 'Todos os estados'}</option>
            ))}
          </select>
          {data && (
            <span className="text-xs text-gray-600 ml-auto">{total} usuários</span>
          )}
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-gray-900 z-10">
              <tr className="border-b border-gray-800">
                <th className="text-left px-4 py-2.5 text-xs text-gray-500 font-medium">WhatsApp</th>
                <th className="text-left px-4 py-2.5 text-xs text-gray-500 font-medium">Estado</th>
                <th className="text-left px-4 py-2.5 text-xs text-gray-500 font-medium">Pedidos</th>
                <th className="text-left px-4 py-2.5 text-xs text-gray-500 font-medium">Cidade</th>
                <th className="text-left px-4 py-2.5 text-xs text-gray-500 font-medium">Último contato</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-600">Carregando…</td>
                </tr>
              )}
              {users.map((user: UserRow) => {
                const color = STATE_COLORS[user.conversation_state] ?? '#6b7280'
                return (
                  <tr
                    key={user.id}
                    onClick={() => setSelectedId(user.id === selectedId ? null : user.id)}
                    className="border-b border-gray-800/50 hover:bg-gray-800/50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-2.5 font-mono text-xs text-gray-300">
                      {maskPhone(user.whatsapp)}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-medium"
                        style={{ backgroundColor: `${color}20`, color }}
                      >
                        {user.conversation_state}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-gray-500 text-center">{user.total_requests}</td>
                    <td className="px-4 py-2.5 text-gray-500 text-xs">{user.city ?? '—'}</td>
                    <td className="px-4 py-2.5 text-gray-600 text-xs">
                      {user.last_message_at ? formatDate(user.last_message_at) : '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {total > 20 && (
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-800 flex-shrink-0">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 text-xs text-gray-400 disabled:text-gray-700 hover:text-gray-200 transition-colors"
            >
              <ChevronLeft size={14} /> Anterior
            </button>
            <span className="text-xs text-gray-600">Página {page} de {data?.meta.totalPages ?? 1}</span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={!data || page >= (data.meta.totalPages)}
              className="flex items-center gap-1 text-xs text-gray-400 disabled:text-gray-700 hover:text-gray-200 transition-colors"
            >
              Próxima <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      {selectedId && (
        <div className="w-96 shrink-0 border-l border-gray-800 overflow-auto">
          <UserDetail userId={selectedId} onClose={() => setSelectedId(null)} />
        </div>
      )}
    </div>
  )
}
