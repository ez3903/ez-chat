import { Layout } from "antd";
import ChatHeader from "../../components/chat/chat-header";
import ChatMessages from "../../components/chat/chat-messages";
import QuickActions from "../../components/chat/quick-actions";
import ChatInputBox from "../../components/chat/chat-input-box";
import styles from "./styles.module.css";

const { Header, Content } = Layout;

export default function ChatPage() {
  return (
    <Layout className={styles.pageLayout}>
      <Header className={styles.pageHeader}>
        <ChatHeader />
      </Header>
      <Content className={styles.pageContent}>
        <div className={styles.pageContainer}>
          <ChatMessages />
          <QuickActions />
          <ChatInputBox />
        </div>
      </Content>
    </Layout>
  );
}
