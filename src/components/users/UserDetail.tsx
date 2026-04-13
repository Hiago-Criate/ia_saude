import { useUser, type QuoteRow } from '@/api/data'
import { maskPhone, formatDate, STATE_COLORS } from '@/lib/utils'
import { X, MapPin, Phone, User as UserIcon } from 'lucide-react'

interface UserDetailProps {
  userId: string
  onClose: () => void
}

export function UserDetail({ userId, onClose }: UserDetailProps) {
  const { data, isLoading } = useUser(userId)

  if (isLoading) {
    return <div className="p-4 text-center text-gray-600 text-sm mt-12">Carregando…</div>
  }
  if (!data) return null

  const { user, quotes } = data
  const stateColor = STATE_COLORS[user.conversation_state] ?? '#6b7280'

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-2">
          <UserIcon size={14} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-200">Usuário</span>
        </div>
        <button onClick={onClose} className="text-gray-600 hover:text-gray-300 transition-colors">
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Phone size={12} className="text-gray-600" />
            <span className="font-mono">{maskPhone(user.whatsapp)}</span>
          </div>
          {(user.neighborhood || user.city) && (
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <MapPin size={12} className="text-gray-600" />
              <span>{[user.neighborhood, user.city].filter(Boolean).join(', ')}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">Estado:</span>
            <span
              className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono"
              style={{ backgroundColor: `${stateColor}20`, color: stateColor }}
            >
              {user.conversation_state}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Perfil:</span>
            <span className="text-gray-300">{user.profile_completeness}% completo</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Criado:</span>
            <span>{formatDate(user.created_at)}</span>
          </div>
        </div>

        {quotes.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Cotações ({quotes.length})
            </h3>
            <div className="space-y-2">
              {quotes.map((q: QuoteRow) => (
                <div key={q.id} className="rounded-lg border border-gray-800 bg-gray-900/50 px-3 py-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-gray-300 truncate">{q.medicine_name}</span>
                    <span className="text-[10px] text-gray-600">{q.status}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-gray-600">{formatDate(q.created_at)}</span>
                    {(q.pharmacies_contacted ?? 0) > 0 && (
                      <span className="text-[10px] text-gray-600">· {q.pharmacies_contacted} farmácias</span>
                    )}
                    {q.final_price_brl != null && (
                      <span className="text-[10px] text-green-400 font-mono">R$ {q.final_price_brl.toFixed(2)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Perfil (JSON)
          </h3>
          <pre className="text-[10px] text-gray-500 bg-gray-950 rounded-lg p-3 overflow-auto max-h-60 leading-relaxed">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}
