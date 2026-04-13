import { memo } from 'react'
import { Handle, Position, type NodeProps } from 'reactflow'
import { Terminal, Wand2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FunctionNodeData {
  label: string
  promptKey: string | null
  file: string
}

export const FunctionNode = memo(({ data, selected }: NodeProps<FunctionNodeData>) => {
  const hasPrompt = !!data.promptKey

  return (
    <div
      className={cn(
        'rounded-lg border bg-gray-900 px-3 py-2 min-w-[200px] shadow transition-all',
        hasPrompt
          ? 'border-violet-500/60 cursor-pointer hover:border-violet-400'
          : 'border-gray-700',
        selected && hasPrompt ? 'ring-1 ring-violet-400/40 border-violet-400' : '',
        selected && !hasPrompt ? 'border-gray-500' : ''
      )}
    >
      <Handle type="target" position={Position.Left} className="!w-1.5 !h-1.5 !border-gray-600 !bg-gray-600" />
      <Handle type="target" position={Position.Top} className="!w-1.5 !h-1.5 !border-gray-600 !bg-gray-600" />

      <div className="flex items-center gap-2 mb-1">
        <Terminal size={12} className="text-gray-400 flex-shrink-0" />
        <span className="text-[11px] font-mono text-gray-200 leading-tight">{data.label}</span>
        {hasPrompt && (
          <Wand2 size={10} className="text-violet-400 ml-auto flex-shrink-0" aria-label="Has editable prompt" />
        )}
      </div>
      <p className="text-[9px] text-gray-600 font-mono truncate">{data.file}</p>

      <Handle type="source" position={Position.Right} className="!w-1.5 !h-1.5 !border-gray-600 !bg-gray-600" />
      <Handle type="source" position={Position.Bottom} className="!w-1.5 !h-1.5 !border-gray-600 !bg-gray-600" />
    </div>
  )
})

FunctionNode.displayName = 'FunctionNode'
