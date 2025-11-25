import { Avatar, Typography } from "antd";
import type { Message } from "../../../types";
import { ShoppingFilled, UserOutlined } from "@ant-design/icons";
import styles from "./styles.module.css";

type Props = { m: Message };

export default function MessageBubble({ m }: Props) {
  const isAI = m.role === "ai";
  return (
    <div className={`${styles.row} ${isAI ? styles.rowAI : styles.rowUser}`}>
      <div
        className={`${styles.inner} ${
          isAI ? styles.innerAI : styles.innerUser
        }`}
      >
        {isAI ? (
          <Avatar style={{ background: "#d946ef" }} icon={<ShoppingFilled />} />
        ) : (
          <Avatar style={{ background: "#4096ff" }} icon={<UserOutlined />} />
        )}
        <div
          className={`${styles.bubble} ${
            isAI ? styles.bubbleAI : styles.bubbleUser
          }`}
        >
          <div className={`${styles.content} chat-scroll`}>
            <Typography.Text style={{ whiteSpace: "pre-wrap" }}>
              {m.text}
            </Typography.Text>
          </div>
        </div>
      </div>
    </div>
  );
}
