// Dev: Vite proxy redireciona /admin → localhost:3000
// Produção: VITE_API_BASE aponta para backend no Railway (ex: https://vita-core.railway.app)
const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? ''

export async function adminFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`${res.status}: ${text}`)
  }
  return res.json() as Promise<T>
}
