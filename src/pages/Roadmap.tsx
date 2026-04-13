import { RoadmapPanel } from '@/components/roadmap/RoadmapPanel'

export function Roadmap() {
  return (
    <div className="h-full flex flex-col">
      <div className="px-6 py-4 border-b border-gray-800 flex-shrink-0">
        <h1 className="text-xl font-bold text-gray-100">Roadmap</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Progresso do projeto, bugs corrigidos e próximos passos
        </p>
      </div>
      <div className="flex-1 overflow-hidden">
        <RoadmapPanel />
      </div>
    </div>
  )
}
