import { Button, Input, Space } from "antd"
import styles from "./styles.module.css"
import { useChatStore } from "../../../store/chat"
import { useChatStream } from "../../../hooks/useChatStream"

export default function ChatInputBox() {
  const input = useChatStore((s) => s.input)
  const setInput = useChatStore((s) => s.setInput)
  const generating = useChatStore((s) => s.generating)
  const addMessage = useChatStore((s) => s.addMessage)
  const { start, stop } = useChatStream()

  function handleChange(v: string) { setInput(v) }
  async function handleSend() {
    const text = input
    if (!text.trim() || generating) return
    const userMsg = { id: crypto.randomUUID(), role: "user", text } as const
    const aiMsg = { id: crypto.randomUUID(), role: "ai", text: "", status: "generating" } as const
    addMessage(userMsg)
    addMessage(aiMsg)
    setInput("")
    const history = useChatStore.getState().messages
    await start({ input: text, messages: history })
  }
  function handleStop() { stop() }
  function handleEnter(e: any) { if (!e.shiftKey) { e.preventDefault(); handleSend() } }

  const count = input.length
  return (
    <div className={styles.wrapper}>
      <div className={styles.box}>
        <Space className={styles.toolbar}>
          <Input.TextArea className={styles.textArea} value={input} onChange={(e) => handleChange(e.target.value)} autoSize={{ minRows: 2, maxRows: 6 }} placeholder="输入消息（Enter 发送，Shift+Enter 换行）" onPressEnter={handleEnter} />
          {generating ? <Button danger onClick={handleStop}>停止生成</Button> : <Button type="primary" onClick={handleSend}>发送</Button>}
        </Space>
        <div className={styles.counter}>{count}/2000</div>
      </div>
    </div>
  )
}
