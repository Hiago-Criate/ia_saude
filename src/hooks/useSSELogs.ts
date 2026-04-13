import { useEffect, useRef } from 'react'
import { useLogStore, type LogEntry } from '../stores/logStore'

export function useSSELogs(enabled = true) {
  const addLog = useLogStore((s) => s.addLog)
  const esRef = useRef<EventSource | null>(null)

  useEffect(() => {
    if (!enabled) return

    let reconnectTimeout: ReturnType<typeof setTimeout>

    function connect() {
      const es = new EventSource('/admin/logs/stream')
      esRef.current = es

      es.onmessage = (e) => {
        try {
          const entry = JSON.parse(e.data as string) as LogEntry
          addLog(entry)
        } catch {
          // Ignore malformed messages
        }
      }

      es.onerror = () => {
        es.close()
        esRef.current = null
        // Reconnect after 3 seconds
        reconnectTimeout = setTimeout(connect, 3_000)
      }
    }

    connect()

    return () => {
      clearTimeout(reconnectTimeout)
      esRef.current?.close()
      esRef.current = null
    }
  }, [enabled, addLog])
}
