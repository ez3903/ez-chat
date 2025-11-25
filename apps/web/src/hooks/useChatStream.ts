import { useRef } from "react"
import { useChatStore } from "../store/chat"

export function useChatStream() {
  const controllerRef = useRef<AbortController | null>(null)
  const { appendToLastAI, setGenerating, setLastAIStatus } = useChatStore.getState()

  async function start(payload: unknown, opts: { timeoutMs?: number; retries?: number } = {}) {
    const controller = new AbortController()
    controllerRef.current = controller
    setGenerating(true)
    setLastAIStatus("generating")
    const timeoutMs = opts.timeoutMs ?? 90000
    let retries = Math.max(0, opts.retries ?? 1)

    async function attempt() {
      const timer = setTimeout(() => controller.abort(), timeoutMs)
      try {
        const res = await fetch("/chat/stream", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
          body: JSON.stringify(payload),
          signal: controller.signal,
        })
        if (!res.ok || !res.body) {
          throw new Error(`HTTP ${res.status}`)
        }
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ""
        while (true) {
          const { value, done } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          let idx
          while ((idx = buffer.indexOf("\n\n")) !== -1) {
            const frame = buffer.slice(0, idx)
            buffer = buffer.slice(idx + 2)
            if (frame.startsWith("data:")) {
              const json = frame.slice(5).trim()
              if (!json) continue
              try {
                const obj = JSON.parse(json)
                if (obj.delta) appendToLastAI(obj.delta)
                if (obj.done) { setGenerating(false); setLastAIStatus("done") }
              } catch {
                setGenerating(false)
                setLastAIStatus("error")
                throw new Error("SSE 数据格式错误")
              }
            }
          }
        }
      } finally {
        clearTimeout(timer)
      }
    }

    try {
      await attempt()
    } catch (e) {
      if (retries > 0 && !controller.signal.aborted) {
        retries -= 1
        await attempt()
      } else {
        setGenerating(false)
        setLastAIStatus("error")
        throw e
      }
    }
  }

  function stop() {
    controllerRef.current?.abort()
    setGenerating(false)
  }

  return { start, stop }
}
