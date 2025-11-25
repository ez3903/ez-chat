# React + AntD 流式 Chat（SSE）开发文档

本项目实现一个基于 React + Ant Design 的简易 Chat 应用，使用 SSE（Server-Sent Events）进行模型回复的真实流式传输，覆盖多轮对话、打字机效果、停止生成等。

## 1. 目标与验收标准

- 支持多轮对话与消息列表，区分用户与 AI。
- 使用 SSE 真流式传输，逐段展示 AI 回复（打字机效果）。
- 正在生成时按钮变为“停止生成”，支持主动中断并保留已生成内容。
- 覆盖异常场景：网络中断、请求超时、服务端异常（4xx/5xx）、SSE 数据格式错误、用户主动中断、失败重试。

## 2. 技术栈与架构

- 前端：React 18、Vite、TypeScript、Ant Design、Zustand。
- 后端：NestJS、LangChain.js（对接 OpenAI/Anthropic/Ollama 等）。
- 通信：SSE（`text/event-stream`），前端使用 `fetch + ReadableStream` 解析事件并支持 Abort。
- 目录结构（pnpm monorepo）：

```
apps/
  web/            # 前端（React + Vite）
  api/            # 后端（NestJS + LangChain.js）
```

## 3. 数据与事件规范

- 消息类型（共享 `web/src/types.ts`）：

```ts
export type Role = "user" | "ai";
export type Message = {
  id: string;
  role: Role;
  text: string;
  status?: "generating" | "error" | "done";
};
```

- SSE 事件负载（服务端按如下 JSON 流式发送）：

```json
{"delta":"字符串增量","done":false}
{"delta":"最后一段","done":true}
```

- SSE 帧格式：按标准 `data: <json>\n\n` 连续发送；结束帧可使用 `event: done` 或 `done: true`。


## 4. README（启动与模拟）

### 4.1 环境准备

- Node.js 18+
- pnpm 8+
- 在项目根目录执行：

```
pnpm install
```

- 在 `apps/api` 配置 `.env`：

```
MODEL_PROVIDER=dashscope
MODEL_NAME=qwen3-max
DASHSCOPE_API_KEY=sk-...   (Your DashScope API key)
DASHSCOPE_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
TEMPERATURE=0.2
```

### 4.2 启动后端（NestJS）

```
pnpm dev:api
```

默认监听 `http://localhost:3000`，SSE 端点：`POST /chat/stream`。

### 4.3 启动前端（Vite）

```
pnpm dev:web
```

访问 `http://localhost:5173`。


### 4.4 接口说明

- `POST /chat/stream`
  - 请求体：`{ messages: Message[] }`
  - 响应：`text/event-stream`，按 `data: { delta, done }\n\n` 连续返回。

