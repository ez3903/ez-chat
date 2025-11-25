import { Row, Col, Typography, Space, Avatar, Dropdown, App } from "antd"
import { ThunderboltOutlined, EllipsisOutlined, CheckCircleFilled, DeleteOutlined, DownloadOutlined, SettingOutlined } from "@ant-design/icons"
import styles from "./styles.module.css"
import { useChatStore } from "../../../store/chat"

export default function ChatHeader() {
  const reset = useChatStore((s) => s.reset)
  const messages = useChatStore((s) => s.messages)
  const { message } = App.useApp()

  function handleExport() {
    const data = JSON.stringify(messages, null, 2)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `chat-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleOpenSettings() {
    message.info("设置功能待扩展")
  }

  return (
    <div className={styles.header}>
      <div className={styles.headerInner}>
        <Row align="middle" justify="space-between">
          <Col>
            <Space size={12}>
              <Avatar style={{ background: "#7c3aed" }} icon={<ThunderboltOutlined />} />
              <Space direction="vertical" size={0}>
                <Typography.Text className={styles.title}>AI 智能助手</Typography.Text>
                <Typography.Text type="secondary" className={styles.status}>
                  <CheckCircleFilled style={{ color: "#52c41a" }} /> 在线 · 随时为您服务
                </Typography.Text>
              </Space>
            </Space>
          </Col>
          <Col>
            <Dropdown menu={{ items: [
              { key: "clear", icon: <DeleteOutlined />, label: "清空对话", onClick: reset },
              { key: "export", icon: <DownloadOutlined />, label: "导出对话", onClick: handleExport },
              { key: "settings", icon: <SettingOutlined />, label: "设置", onClick: handleOpenSettings },
            ] }} placement="bottomRight" trigger={["click"]}>
              <EllipsisOutlined className={styles.more} />
            </Dropdown>
          </Col>
        </Row>
      </div>
    </div>
  )
}
