import { memo } from 'react'
import { Handle, Position, type NodeProps } from 'reactflow'
import { Bot } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AgentNodeData {
  label: string
  subtitle: string
  color: string
  promptKey: string | null
}

export const AgentNode = memo(({ data, selected }: NodeProps<AgentNodeData>) => {
  const hasPrompt = !!data.promptKey

  return (
    <div
      className={cn(
        'rounded-xl border-2 px-4 py-3 min-w-[200px] shadow-lg transition-all cursor-pointer',
        selected ? 'ring-2 ring-white/40 ring-offset-1 ring-offset-transparent' : ''
      )}
      style={{
        backgroundColor: `${data.color}18`,
        borderColor: data.color,
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2 !h-2 !border-gray-500 !bg-gray-700"
      />
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2 !h-2 !border-gray-500 !bg-gray-700"
      />

      <div className="flex items-center gap-2 mb-1">
        <Bot size={16} style={{ color: data.color }} />
        <span
          className="text-sm font-bold tracking-tight"
          style={{ color: data.color }}
        >
          {data.label}
        </span>
        {hasPrompt && (
          <span
            className="ml-auto text-[10px] px-1.5 py-0.5 rounded font-mono"
            style={{ backgroundColor: `${data.color}30`, color: data.color }}
          >
            PROMPT
          </span>
        )}
      </div>
      <p className="text-[11px] text-gray-400 leading-tight">{data.subtitle}</p>

      <Handle
        type="source"
        position={Position.Right}
        className="!w-2 !h-2 !border-gray-500 !bg-gray-700"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2 !h-2 !border-gray-500 !bg-gray-700"
      />
    </div>
  )
})

AgentNode.displayName = 'AgentNode'
