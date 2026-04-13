import { useState, useCallback, useEffect } from 'react'
import ReactFlow, {
  type Node,
  type Edge,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  type NodeTypes,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { AgentNode } from './AgentNode'
import { StateNode } from './StateNode'
import { FunctionNode } from './FunctionNode'
import { InfraNode } from './InfraNode'
import { PromptPanel } from './PromptPanel'
import { usePrompts } from '@/api/prompts'

const nodeTypes: NodeTypes = {
  agentNode: AgentNode,
  stateNode: StateNode,
  functionNode: FunctionNode,
  infraNode: InfraNode,
}

const initialNodes: Node[] = [
  // ─── AGENT NODES ───
  {
    id: 'agent-patient', type: 'agentNode', position: { x: 60, y: 60 },
    data: { label: 'Patient Agent', subtitle: 'Lara — Conversa com paciente', color: '#3B82F6', promptKey: 'patient:system_prompt' },
  },
  {
    id: 'agent-orchestrator', type: 'agentNode', position: { x: 500, y: 60 },
    data: { label: 'Orchestrator Agent', subtitle: 'Criação e gerenciamento de cotações', color: '#8B5CF6', promptKey: null },
  },
  {
    id: 'agent-pharmacy', type: 'agentNode', position: { x: 940, y: 60 },
    data: { label: 'Pharmacy Agent', subtitle: 'Contato e parsing de respostas', color: '#10B981', promptKey: 'pharmacy:parsing_prompt' },
  },

  // ─── PATIENT STATE MACHINE ───
  { id: 's-idle', type: 'stateNode', position: { x: 60, y: 220 }, data: { label: 'idle / done', description: 'Estado inicial ou concluído' } },
  { id: 's-medicine', type: 'stateNode', position: { x: 60, y: 310 }, data: { label: 'awaiting_medicine', description: 'Aguardando nome do remédio' } },
  { id: 's-location', type: 'stateNode', position: { x: 60, y: 400 }, data: { label: 'awaiting_location', description: 'Aguardando localização (pin WhatsApp)' } },
  { id: 's-confirm', type: 'stateNode', position: { x: 60, y: 490 }, data: { label: 'awaiting_confirmation', description: 'Usuário confirma busca (Sim/Não)' } },
  { id: 's-quoting', type: 'stateNode', position: { x: 280, y: 490 }, data: { label: 'quoting', description: 'BullMQ jobs ativos — buscando farmácias' } },
  { id: 's-results', type: 'stateNode', position: { x: 280, y: 400 }, data: { label: 'presenting_results', description: 'Mostrando cotações ao usuário' } },

  // ─── FUNCTION NODES ───
  { id: 'fn-extract-text', type: 'functionNode', position: { x: 60, y: 620 }, data: { label: 'extractMedicineFromText()', promptKey: 'vision:medicine_text_prompt', file: 'agents/patient/vision.ts' } },
  { id: 'fn-extract-rx', type: 'functionNode', position: { x: 280, y: 620 }, data: { label: 'extractFromPrescription()', promptKey: 'vision:prescription_prompt', file: 'agents/patient/vision.ts' } },
  { id: 'fn-signals', type: 'functionNode', position: { x: 500, y: 620 }, data: { label: 'extractAndMergeSignals()', promptKey: null, file: 'agents/patient/event-extractor.ts' } },
  { id: 'fn-create-quote', type: 'functionNode', position: { x: 500, y: 220 }, data: { label: 'createAndStartQuote()', promptKey: null, file: 'agents/orchestrator/index.ts' } },
  { id: 'fn-aggregate', type: 'functionNode', position: { x: 720, y: 220 }, data: { label: 'aggregateAndRespond()', promptKey: null, file: 'agents/orchestrator/aggregator.ts' } },
  { id: 'fn-parse-pharmacy', type: 'functionNode', position: { x: 940, y: 220 }, data: { label: 'parsePharmacyResponse()', promptKey: 'pharmacy:parsing_prompt', file: 'agents/pharmacy/parser.ts' } },

  // ─── INFRA NODES ───
  { id: 'infra-redis', type: 'infraNode', position: { x: 720, y: 360 }, data: { label: 'Redis + BullMQ', subtitle: 'Queue: pharmacy-quotes', color: '#EF4444' } },
  { id: 'infra-supabase', type: 'infraNode', position: { x: 720, y: 460 }, data: { label: 'Supabase (PostgreSQL)', subtitle: '12 tables', color: '#22D3EE' } },
  { id: 'infra-gemini', type: 'infraNode', position: { x: 720, y: 560 }, data: { label: 'Google Gemini', subtitle: 'gemini-flash-latest', color: '#F59E0B' } },
  { id: 'infra-uazapi', type: 'infraNode', position: { x: 940, y: 460 }, data: { label: 'UazAPI / WhatsApp', subtitle: 'patients + pharmacies', color: '#22C55E' } },
]

const initialEdges: Edge[] = [
  { id: 'e1', source: 's-idle', target: 's-medicine', label: 'LGPD aceita', animated: false, style: { stroke: '#4b5563' } },
  { id: 'e2', source: 's-medicine', target: 's-location', label: 'sem localização', style: { stroke: '#4b5563' } },
  { id: 'e3', source: 's-medicine', target: 's-confirm', label: 'tem localização', style: { stroke: '#4b5563' } },
  { id: 'e4', source: 's-location', target: 's-confirm', label: 'pin recebido', style: { stroke: '#4b5563' } },
  { id: 'e5', source: 's-confirm', target: 's-quoting', label: 'Sim', animated: true, style: { stroke: '#3b82f6' } },
  { id: 'e6', source: 's-confirm', target: 's-medicine', label: 'Não', style: { stroke: '#6b7280' } },
  { id: 'e7', source: 's-quoting', target: 's-results', label: 'quotes prontos', style: { stroke: '#10b981' } },
  { id: 'e8', source: 's-results', target: 's-idle', label: 'done', style: { stroke: '#6b7280' } },
  { id: 'e9', source: 's-confirm', target: 'fn-create-quote', animated: true, style: { stroke: '#8b5cf6' } },
  { id: 'e10', source: 'fn-create-quote', target: 'agent-orchestrator', style: { stroke: '#8b5cf6' } },
  { id: 'e11', source: 'agent-orchestrator', target: 'infra-redis', label: 'enqueue jobs', style: { stroke: '#ef4444' } },
  { id: 'e12', source: 'infra-redis', target: 'agent-pharmacy', label: 'pharmacy-quotes queue', animated: true, style: { stroke: '#ef4444' } },
  { id: 'e13', source: 'agent-pharmacy', target: 'infra-uazapi', label: 'send to pharmacy', style: { stroke: '#22c55e' } },
  { id: 'e14', source: 'infra-uazapi', target: 'agent-pharmacy', label: 'pharmacy reply', style: { stroke: '#22c55e' } },
  { id: 'e15', source: 'agent-pharmacy', target: 'fn-parse-pharmacy', style: { stroke: '#10b981' } },
  { id: 'e16', source: 'fn-parse-pharmacy', target: 'fn-aggregate', label: 'min respostas', style: { stroke: '#10b981' } },
  { id: 'e17', source: 'fn-aggregate', target: 'infra-uazapi', label: 'resultados → usuário', style: { stroke: '#22c55e' } },
  { id: 'e18', source: 'agent-patient', target: 'infra-supabase', label: 'user_profiles', style: { stroke: '#22d3ee', strokeDasharray: '4 2' } },
  { id: 'e19', source: 'agent-patient', target: 'infra-gemini', label: 'chat/structured', style: { stroke: '#f59e0b', strokeDasharray: '4 2' } },
  { id: 'e20', source: 'agent-pharmacy', target: 'infra-gemini', label: 'parse response', style: { stroke: '#f59e0b', strokeDasharray: '4 2' } },
  { id: 'e21', source: 'agent-orchestrator', target: 'infra-supabase', label: 'quote_requests', style: { stroke: '#22d3ee', strokeDasharray: '4 2' } },
  { id: 'e22', source: 'agent-patient', target: 'fn-extract-text', style: { stroke: '#3b82f6', strokeDasharray: '3 3' } },
  { id: 'e23', source: 'agent-patient', target: 'fn-extract-rx', style: { stroke: '#3b82f6', strokeDasharray: '3 3' } },
  { id: 'e24', source: 'infra-uazapi', target: 'agent-patient', label: 'patient webhook', style: { stroke: '#22c55e' } },
]

export function WorkflowCanvas() {
  const [selectedPromptKey, setSelectedPromptKey] = useState<string | null>(null)
  const { data: prompts, isLoading: promptsLoading, error: promptsError } = usePrompts()

  // Resolve o prompt completo a partir da chave selecionada
  const selectedPrompt = prompts?.find(
    (p) => `${p.agent}:${p.prompt_key}` === selectedPromptKey
  ) ?? null

  // Clique num node: abre painel se tem promptKey, fecha se não tem
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    const promptKey = (node.data?.promptKey as string | null) ?? null
    setSelectedPromptKey(promptKey)
  }, [])

  // Tecla Escape fecha o painel
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedPromptKey(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="flex h-full">
      <div className="flex-1 h-full relative">
        <ReactFlow
          nodes={initialNodes}
          edges={initialEdges}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          fitView
          fitViewOptions={{ padding: 0.1 }}
          className="bg-gray-950"
          defaultEdgeOptions={{ type: 'smoothstep' }}
        >
          <Background color="#1f2937" variant={BackgroundVariant.Dots} />
          <Controls className="!bg-gray-800 !border-gray-700 !rounded-lg" />
          <MiniMap
            className="!bg-gray-900 !border-gray-700 !rounded-lg"
            nodeColor={(node: Node) => (node.data?.color as string | undefined) ?? '#374151'}
          />
        </ReactFlow>
      </div>

      {/* Painel de prompt: abre quando selectedPromptKey está setado (independente de prompt ter carregado) */}
      {selectedPromptKey && (
        <div className="w-96 shrink-0 border-l border-gray-800">
          <PromptPanel
            promptKey={selectedPromptKey}
            prompt={selectedPrompt}
            isLoading={promptsLoading}
            error={promptsError ? 'Backend offline — inicie o vita-core' : null}
            onClose={() => setSelectedPromptKey(null)}
          />
        </div>
      )}
    </div>
  )
}
