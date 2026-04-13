import { useState, useEffect } from 'react'
import MonacoEditor from '@monaco-editor/react'
import { X, Save, RotateCcw, Loader2, CheckCircle, WifiOff } from 'lucide-react'
import { useUpdatePrompt, type PromptRecord } from '@/api/prompts'

interface PromptPanelProps {
  /** Chave composta "agent:prompt_key" para identificação e exibição no header */
  promptKey: string
  /** Prompt completo — null quando ainda carregando ou backend offline */
  prompt: PromptRecord | null
  isLoading: boolean
  error: string | null
  onClose: () => void
}

export function PromptPanel({ promptKey, prompt, isLoading, error, onClose }: PromptPanelProps) {
  const [value, setValue] = useState(prompt?.content ?? '')
  const [saved, setSaved] = useState(false)
  const updatePrompt = useUpdatePrompt()

  // Sincroniza o editor quando o prompt carrega (pode chegar depois do painel abrir)
  useEffect(() => {
    if (prompt) {
      setValue(prompt.content)
      setSaved(false)
    }
  }, [prompt?.id, prompt?.content])

  const isDirty = prompt ? value !== prompt.content : false

  async function handleSave() {
    if (!prompt) return
    await updatePrompt.mutateAsync({ id: prompt.id, content: value })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  function handleReset() {
    if (!prompt) return
    setValue(prompt.content)
    setSaved(false)
  }

  // ─── HEADER (sempre visível) ─────────────────────────────────────────────
  const header = (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 flex-shrink-0">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-mono text-violet-400 truncate">{promptKey}</p>
        {prompt?.description && (
          <p className="text-[11px] text-gray-500 truncate mt-0.5">{prompt.description}</p>
        )}
      </div>
      <button
        onClick={onClose}
        className="ml-2 text-gray-500 hover:text-gray-300 transition-colors flex-shrink-0"
        aria-label="Fechar painel"
      >
        <X size={16} />
      </button>
    </div>
  )

  // ─── LOADING ─────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-gray-900">
        {header}
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-6">
          <Loader2 size={28} className="animate-spin text-violet-500/60" />
          <p className="text-sm text-gray-400">Carregando prompt...</p>
          <p className="text-xs text-gray-600">Conectando ao vita-core</p>
        </div>
      </div>
    )
  }

  // ─── ERRO / OFFLINE ──────────────────────────────────────────────────────
  if (error || !prompt) {
    return (
      <div className="flex flex-col h-full bg-gray-900">
        {header}
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-6">
          <WifiOff size={32} className="text-gray-600" />
          <p className="text-sm text-gray-400">
            {error ?? 'Prompt não encontrado'}
          </p>
          <p className="text-xs text-gray-600">
            Inicie o vita-core para editar prompts ao vivo
          </p>
          <code className="mt-2 text-[10px] bg-gray-800 text-gray-500 px-3 py-2 rounded font-mono">
            npm run dev
          </code>
        </div>
      </div>
    )
  }

  // ─── EDITOR MONACO (prompt disponível) ───────────────────────────────────
  return (
    <div className="flex flex-col h-full bg-gray-900">
      {header}

      <div className="flex-1 overflow-hidden">
        <MonacoEditor
          height="100%"
          language="markdown"
          theme="vs-dark"
          value={value}
          onChange={(v) => setValue(v ?? '')}
          options={{
            minimap: { enabled: false },
            fontSize: 12,
            lineNumbers: 'off',
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            padding: { top: 12, bottom: 12 },
            renderLineHighlight: 'none',
            overviewRulerLanes: 0,
            folding: false,
            glyphMargin: false,
          }}
        />
      </div>

      <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-800 flex-shrink-0 gap-2">
        <div className="text-[10px] text-gray-600 font-mono">
          v{prompt.version} · {prompt.updated_by}
        </div>
        <div className="flex items-center gap-2">
          {isDirty && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors px-2 py-1 rounded"
            >
              <RotateCcw size={12} />
              Reset
            </button>
          )}

          {saved && !isDirty && (
            <span className="flex items-center gap-1 text-xs text-green-400">
              <CheckCircle size={12} />
              Salvo
            </span>
          )}

          <button
            onClick={handleSave}
            disabled={!isDirty || updatePrompt.isPending}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md font-medium transition-all
              bg-violet-600 hover:bg-violet-500 text-white
              disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {updatePrompt.isPending ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Save size={12} />
            )}
            Salvar
          </button>
        </div>
      </div>
    </div>
  )
}
