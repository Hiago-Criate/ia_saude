import { useState } from 'react'
import { useQuotes, type QuoteRow } from '@/api/data'
import { formatDate, maskPhone } from '@/lib/utils'
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react'
import { QuoteTimeline } from './QuoteTimeline'

const STATUS_COLORS: Record<string, string> = {
  collecting: '#3b82f6',
  completed: '#10b981',
  timeout: '#f59e0b',
  failed: '#ef4444',
}

export function QuotesTable() {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const { data, isLoading } = useQuotes({ page, limit: 20, status: statusFilter || undefined })

  const quotes: QuoteRow[] = data?.data ?? []
  const total = data?.meta.total ?? 0

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center gap-3 p-4 border-b border-gray-800 flex-shrink-0">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
          className="text-sm bg-gray-900 border border-gray-700 rounded-lg px-2 py-1.5 text-gray-300 focus:outline-none"
        >
          {['', 'collecting', 'completed', 'timeout', 'failed'].map(s => (
            <option key={s} value={s}>{s || 'Todos os status'}</option>
          ))}
        </select>
        {data && (
          <span className="text-xs text-gray-600 ml-auto">{total} cotações</span>
        )}
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-gray-900 z-10">
            <tr className="border-b border-gray-800">
              <th className="text-left px-4 py-2.5 text-xs text-gray-500 font-medium w-8"></th>
              <th className="text-left px-4 py-2.5 text-xs text-gray-500 font-medium">ID</th>
              <th className="text-left px-4 py-2.5 text-xs text-gray-500 font-medium">Medicamento</th>
              <th className="text-left px-4 py-2.5 text-xs text-gray-500 font-medium">Usuário</th>
              <th className="text-left px-4 py-2.5 text-xs text-gray-500 font-medium">Status</th>
              <th className="text-left px-4 py-2.5 text-xs text-gray-500 font-medium">Farmácias</th>
              <th className="text-left px-4 py-2.5 text-xs text-gray-500 font-medium">Data</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={7} className="text-center py-12 text-gray-600">Carregando…</td>
              </tr>
            )}
            {quotes.map((quote: QuoteRow) => {
              const color = STATUS_COLORS[quote.status] ?? '#6b7280'
              const isExpanded = expandedId === quote.id
              return (
                <>
                  <tr
                    key={quote.id}
                    onClick={() => setExpandedId(isExpanded ? null : quote.id)}
                    className="border-b border-gray-800/50 hover:bg-gray-800/30 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-2.5 text-gray-600">
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-[10px] text-gray-600">
                      {quote.id.slice(0, 8)}…
                    </td>
                    <td className="px-4 py-2.5 text-gray-200 font-medium">
                      {quote.medicine_name}
                      {quote.medicine_dosage && (
                        <span className="ml-1 text-gray-500 font-normal">{quote.medicine_dosage}</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-xs text-gray-400">
                      {quote.user_id ? maskPhone(quote.user_id) : '—'}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono"
                        style={{ backgroundColor: `${color}20`, color }}
                      >
                        {quote.status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-gray-500 text-center">
                      {quote.pharmacies_contacted ?? 0}
                    </td>
                    <td className="px-4 py-2.5 text-gray-600 text-xs">
                      {formatDate(quote.created_at)}
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr key={`${quote.id}-detail`} className="border-b border-gray-800">
                      <td colSpan={7} className="px-4 py-3 bg-gray-900/50">
                        <QuoteTimeline quoteId={quote.id} />
                      </td>
                    </tr>
                  )}
                </>
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
  )
}
