import { useQuote, type PharmacyQuoteRow } from '@/api/data'
import { formatDate } from '@/lib/utils'
import { Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react'

const PQ_COLORS: Record<string, string> = {
  pending: '#6b7280',
  sent: '#3b82f6',
  responded: '#10b981',
  timeout: '#f59e0b',
  failed: '#ef4444',
}

interface QuoteTimelineProps {
  quoteId: string
}

export function QuoteTimeline({ quoteId }: QuoteTimelineProps) {
  const { data, isLoading } = useQuote(quoteId)

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-gray-600 text-xs py-2">
        <Loader2 size={12} className="animate-spin" /> Carregando detalhes…
      </div>
    )
  }

  if (!data) return null

  const { quote, pharmacy_quotes } = data

  return (
    <div className="space-y-2">
      <div className="text-[10px] text-gray-600 font-mono mb-2">
        Timeout: {quote.timeout_at ? formatDate(quote.timeout_at) : '—'}
        {' · '}
        Farmácias contactadas: {quote.pharmacies_contacted ?? 0}
        {' · '}
        Respondidas: {quote.pharmacies_responded ?? 0}
        {quote.final_price_brl != null && ` · Melhor: R$ ${quote.final_price_brl.toFixed(2)}`}
      </div>

      {pharmacy_quotes.length === 0 && (
        <p className="text-xs text-gray-600 italic">Nenhuma farmácia contatada ainda.</p>
      )}

      <div className="grid grid-cols-1 gap-2">
        {pharmacy_quotes.map((pq: PharmacyQuoteRow) => {
          const color = PQ_COLORS[pq.status] ?? '#6b7280'
          const Icon = pq.status === 'responded' ? CheckCircle
            : (pq.status === 'failed' || pq.status === 'timeout') ? XCircle
            : pq.status === 'sent' ? Loader2
            : Clock

          return (
            <div
              key={pq.id}
              className="flex items-start gap-3 rounded-lg border border-gray-800 bg-gray-950 px-3 py-2"
            >
              <Icon size={14} className="mt-0.5 flex-shrink-0" style={{ color }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-300 truncate">{pq.pharmacy_name}</span>
                  <span
                    className="text-[9px] px-1.5 py-0.5 rounded-full font-mono flex-shrink-0"
                    style={{ backgroundColor: `${color}20`, color }}
                  >
                    {pq.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                  <span className="text-[10px] text-gray-600">{pq.pharmacy_whatsapp}</span>
                  {pq.price_brl != null && (
                    <span className="text-[10px] text-green-400 font-mono">R$ {pq.price_brl.toFixed(2)}</span>
                  )}
                  {pq.has_stock === false && (
                    <span className="text-[10px] text-red-400">sem estoque</span>
                  )}
                  {pq.delivery_available && pq.delivery_minutes != null && (
                    <span className="text-[10px] text-blue-400">{pq.delivery_minutes}min entrega</span>
                  )}
                  {pq.responded_at && (
                    <span className="text-[10px] text-gray-600">{formatDate(pq.responded_at)}</span>
                  )}
                </div>

                {pq.conversation_log != null && (
                  <details className="mt-1">
                    <summary className="text-[9px] text-gray-600 cursor-pointer hover:text-gray-400">
                      Ver conversa
                    </summary>
                    <pre className="mt-1 text-[9px] text-gray-600 bg-gray-900 rounded p-2 overflow-auto max-h-32">
                      {JSON.stringify(pq.conversation_log, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
