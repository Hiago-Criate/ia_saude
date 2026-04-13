import { LogViewer } from '@/components/logs/LogViewer'

export function Logs() {
  return (
    <div className="h-full flex flex-col">
      <div className="px-6 py-4 border-b border-gray-800 flex-shrink-0">
        <h1 className="text-xl font-bold text-gray-100">Logs</h1>
        <p className="text-sm text-gray-500 mt-0.5">Stream em tempo real do servidor</p>
      </div>
      <div className="flex-1 overflow-hidden">
        <LogViewer />
      </div>
    </div>
  )
}
