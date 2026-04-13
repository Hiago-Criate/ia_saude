import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminFetch } from './client'

export interface PromptRecord {
  id: string
  agent: string
  prompt_key: string
  content: string
  description: string | null
  is_active: boolean
  version: number
  updated_by: string
  created_at: string
  updated_at: string
}

export function usePrompts() {
  return useQuery<PromptRecord[]>({
    queryKey: ['prompts'],
    queryFn: async () => {
      const res = await adminFetch<{ prompts: PromptRecord[] }>('/admin/prompts')
      return res.prompts
    },
    staleTime: 60_000,
  })
}

export function useUpdatePrompt() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) =>
      adminFetch(`/admin/prompts/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ content }),
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['prompts'] })
    },
  })
}
