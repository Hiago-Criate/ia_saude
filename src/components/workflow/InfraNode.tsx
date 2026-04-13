import { memo } from 'react'
import { Handle, Position, type NodeProps } from 'reactflow'
import { Server } from 'lucide-react'

interface InfraNodeData {
  label: string
  subtitle: string
  color: string
}

export const InfraNode = memo(({ data, selected }: NodeProps<InfraNodeData>) => {
  return (
    <div
      className={`rounded-lg border bg-gray-950 px-3 py-2 min-w-[170px] shadow transition-all ${
        selected ? 'ring-1' : ''
      }`}
      style={{
        borderColor: `${data.color}55`,
        ...(selected ? { boxShadow: `0 0 0 1px ${data.color}44` } : {}),
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-1.5 !h-1.5 !border-gray-700 !bg-gray-700"
      />
      <Handle
        type="target"
        position={Position.Top}
        className="!w-1.5 !h-1.5 !border-gray-700 !bg-gray-700"
      />

      <div className="flex items-center gap-2">
        <div
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: data.color }}
        />
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-medium text-gray-300 truncate">{data.label}</p>
          <p className="text-[9px] text-gray-600 truncate">{data.subtitle}</p>
        </div>
        <Server size={10} className="text-gray-700 flex-shrink-0" />
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!w-1.5 !h-1.5 !border-gray-700 !bg-gray-700"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-1.5 !h-1.5 !border-gray-700 !bg-gray-700"
      />
    </div>
  )
})

InfraNode.displayName = 'InfraNode'
