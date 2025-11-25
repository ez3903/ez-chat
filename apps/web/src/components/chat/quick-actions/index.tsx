import { Space, Button } from "antd";
import { SmileOutlined, PaperClipOutlined } from "@ant-design/icons";
import styles from "./styles.module.css";
import { useChatStore } from "../../../store/chat";
import { useChatStream } from "../../../hooks/useChatStream";

const suggestions = ["介绍一下你自己", "帮我总结一段文本", "生成一份学习计划"];

export default function QuickActions() {
  const generating = useChatStore((s) => s.generating);
  const setInput = useChatStore((s) => s.setInput);
  const reset = useChatStore((s) => s.reset);
  const { stop } = useChatStream();

  function handleQuick(text: string) {
    setInput(text);
  }
  function handleClear() {
    reset();
  }
  function handleStop() {
    stop();
  }

  return (
    <div className={styles.qaRow}>
      <Space>
        {suggestions.map((s) => (
          <Button key={s} onClick={() => handleQuick(s)}>
            {s}
          </Button>
        ))}
      </Space>
      <Space>
        <Button icon={<SmileOutlined />} />
        <Button icon={<PaperClipOutlined />} />
        {generating ? (
          <Button danger onClick={handleStop}>
            停止生成
          </Button>
        ) : null}
        <Button onClick={handleClear}>清空</Button>
      </Space>
    </div>
  );
}
