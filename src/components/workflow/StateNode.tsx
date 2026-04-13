import { memo } from 'react'
import { Handle, Position, type NodeProps } from 'reactflow'
import { Circle } from 'lucide-react'

interface StateNodeData {
  label: string
  description: string
}

export const StateNode = memo(({ data, selected }: NodeProps<StateNodeData>) => {
  return (
    <div
      className={`rounded-full border border-gray-600 bg-gray-800 px-3 py-1.5 text-center shadow transition-all min-w-[160px] ${
        selected ? 'border-blue-400 ring-1 ring-blue-400/40' : ''
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-1.5 !h-1.5 !border-gray-600 !bg-gray-600"
      />
      <Handle
        type="target"
        position={Position.Top}
        className="!w-1.5 !h-1.5 !border-gray-600 !bg-gray-600"
      />

      <div className="flex items-center justify-center gap-1.5">
        <Circle size={6} className="text-gray-500 fill-gray-500 flex-shrink-0" />
        <span className="text-[11px] font-mono font-medium text-gray-200 whitespace-nowrap">
          {data.label}
        </span>
      </div>
      {data.description && (
        <p className="text-[9px] text-gray-500 mt-0.5 leading-tight max-w-[180px]">
          {data.description}
        </p>
      )}

      <Handle
        type="source"
        position={Position.Right}
        className="!w-1.5 !h-1.5 !border-gray-600 !bg-gray-600"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-1.5 !h-1.5 !border-gray-600 !bg-gray-600"
      />
    </div>
  )
})

StateNode.displayName = 'StateNode'
