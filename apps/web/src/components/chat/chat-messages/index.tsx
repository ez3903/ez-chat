import { useEffect, useRef } from "react";
import { Card } from "antd";
import MessageBubble from "../message-bubble";
import styles from "./styles.module.css";
import { useChatStore } from "../../../store/chat";

export default function ChatMessages() {
  const messages = useChatStore((s) => s.messages)
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);
  return (
    <Card className={styles.card}>
      <div ref={listRef} className={`${styles.list} chat-scroll`}>
        {messages.map((m) => (
          <MessageBubble key={m.id} m={m} />
        ))}
      </div>
    </Card>
  );
}
