import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { Overview } from '@/pages/Overview'
import { Logs } from '@/pages/Logs'
import { Workflow } from '@/pages/Workflow'
import { Users } from '@/pages/Users'
import { Quotes } from '@/pages/Quotes'
import { Roadmap } from '@/pages/Roadmap'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 15_000,
    },
  },
})

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="flex h-screen bg-gray-950 text-gray-100 overflow-hidden">
          <Sidebar />
          <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
            <TopBar />
            <main className="flex-1 overflow-hidden">
              <Routes>
                <Route path="/" element={<Navigate to="/overview" replace />} />
                <Route path="/overview" element={<Overview />} />
                <Route path="/logs" element={<Logs />} />
                <Route path="/workflow" element={<Workflow />} />
                <Route path="/users" element={<Users />} />
                <Route path="/quotes" element={<Quotes />} />
                <Route path="/roadmap" element={<Roadmap />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
