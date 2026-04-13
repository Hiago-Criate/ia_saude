import { useQuery } from '@tanstack/react-query'
import { adminFetch } from './client'

export interface UserRow {
  id: string
  whatsapp: string
  name_enc?: string | null
  conversation_state: string
  last_message_at?: string | null
  total_requests: number
  profile_completeness: number
  created_at: string
  lat?: number | null
  lng?: number | null
  city?: string | null
  neighborhood?: string | null
}

export interface QuoteRow {
  id: string
  medicine_name: string
  medicine_dosage?: string | null
  status: string
  pharmacies_contacted?: number | null
  pharmacies_responded?: number | null
  final_price_brl?: number | null
  created_at: string
  completed_at?: string | null
  timeout_at?: string | null
  user_id: string
}

export interface PharmacyQuoteRow {
  id: string
  quote_request_id: string
  pharmacy_name: string
  pharmacy_whatsapp: string
  status: string
  price_brl?: number | null
  has_stock?: boolean | null
  delivery_available?: boolean | null
  delivery_minutes?: number | null
  response_time_ms?: number | null
  responded_at?: string | null
  conversation_log?: unknown
}

interface PaginatedResponse<T> {
  data: T[]
  meta: { page: number; limit: number; total: number; totalPages: number }
}

export function useUsers(params: { page?: number; limit?: number; state?: string; search?: string } = {}) {
  const search = new URLSearchParams()
  if (params.page) search.set('page', String(params.page))
  if (params.limit) search.set('limit', String(params.limit))
  if (params.state) search.set('state', params.state)
  if (params.search) search.set('search', params.search)

  return useQuery<PaginatedResponse<UserRow>>({
    queryKey: ['users', params],
    queryFn: () => adminFetch<PaginatedResponse<UserRow>>(`/admin/users?${search.toString()}`),
    staleTime: 10_000,
  })
}

export function useUser(id: string) {
  return useQuery<{ user: UserRow; quotes: QuoteRow[] }>({
    queryKey: ['user', id],
    queryFn: () => adminFetch(`/admin/users/${id}`),
    enabled: !!id,
  })
}

export function useQuotes(params: { page?: number; limit?: number; status?: string } = {}) {
  const search = new URLSearchParams()
  if (params.page) search.set('page', String(params.page))
  if (params.limit) search.set('limit', String(params.limit))
  if (params.status) search.set('status', params.status)

  return useQuery<PaginatedResponse<QuoteRow>>({
    queryKey: ['quotes', params],
    queryFn: () => adminFetch<PaginatedResponse<QuoteRow>>(`/admin/quotes?${search.toString()}`),
    staleTime: 10_000,
    refetchInterval: 15_000,
  })
}

export function useQuote(id: string) {
  return useQuery<{ quote: QuoteRow; pharmacy_quotes: PharmacyQuoteRow[] }>({
    queryKey: ['quote', id],
    queryFn: () => adminFetch(`/admin/quotes/${id}`),
    enabled: !!id,
    refetchInterval: 5_000,
  })
}
