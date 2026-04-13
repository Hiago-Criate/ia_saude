import { useState, useEffect } from 'react'
import MonacoEditor from '@monaco-editor/react'
import { X, Save, RotateCcw, Loader2, CheckCircle } from 'lucide-react'
import { useUpdatePrompt, type PromptRecord } from '@/api/prompts'

interface PromptPanelProps {
  prompt: PromptRecord
  onClose: () => void
}

export function PromptPanel({ prompt, onClose }: PromptPanelProps) {
  const [value, setValue] = useState(prompt.content)
  const [saved, setSaved] = useState(false)
  const updatePrompt = useUpdatePrompt()

  useEffect(() => {
    setValue(prompt.content)
    setSaved(false)
  }, [prompt.id, prompt.content])

  const isDirty = value !== prompt.content

  async function handleSave() {
    await updatePrompt.mutateAsync({ id: prompt.id, content: value })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  function handleReset() {
    setValue(prompt.content)
    setSaved(false)
  }

  return (
    <div className="flex flex-col h-full bg-gray-900">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 flex-shrink-0">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-mono text-violet-400 truncate">
            {prompt.agent}:{prompt.prompt_key}
          </p>
          {prompt.description && (
            <p className="text-[11px] text-gray-500 truncate mt-0.5">{prompt.description}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="ml-2 text-gray-500 hover:text-gray-300 transition-colors flex-shrink-0"
        >
          <X size={16} />
        </button>
      </div>

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
              Saved
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
