import { WorkflowCanvas } from '@/components/workflow/WorkflowCanvas'

export function Workflow() {
  return (
    <div className="h-full flex flex-col">
      <div className="px-6 py-4 border-b border-gray-800 flex-shrink-0">
        <h1 className="text-xl font-bold text-gray-100">Workflow</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Visualizador do fluxo de agentes — clique em nós com{' '}
          <span className="text-violet-400 font-mono">PROMPT</span> ou{' '}
          <span className="text-violet-400">✦</span> para editar
        </p>
      </div>
      <div className="flex-1 overflow-hidden">
        <WorkflowCanvas />
      </div>
    </div>
  )
}
