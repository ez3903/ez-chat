import ReactDOM from "react-dom/client";
import { ConfigProvider, App } from "antd";
import ChatPage from "./pages/chat-page";
import "antd/dist/reset.css";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ConfigProvider theme={{ token: { colorPrimary: "#4f46e5" } }}>
    <App>
      <ChatPage />
    </App>
  </ConfigProvider>
);
