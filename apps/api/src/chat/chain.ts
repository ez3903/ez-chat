import { ChatOpenAI } from "@langchain/openai";

import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

export async function buildModel() {
  const provider = process.env.MODEL_PROVIDER;
  const name = process.env.MODEL_NAME;
  const temperature = Number(process.env.TEMPERATURE ?? 0);

  if (provider === "dashscope") {
    const base =
      process.env.DASHSCOPE_BASE_URL ||
      "https://dashscope.aliyuncs.com/compatible-mode/v1";
    const apiKey = process.env.DASHSCOPE_API_KEY;
    if (!apiKey) return null;
    return new ChatOpenAI({
      model: name || "qwen-flash",
      temperature,
      streaming: true,
      streamUsage: false,
      apiKey,
      configuration: { baseURL: base },
    });
  }
  return null;
}

export async function buildChain() {
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", "你是有帮助的助手"],
    new MessagesPlaceholder("history"),
    ["user", "{input}"],
  ]);
  const model = await buildModel();
  if (!model) return null as any;
  const parser = new StringOutputParser();
  return prompt.pipe(model).pipe(parser);
}

export async function* mockStream(input: string) {
  const text = input || "这是一个本地模拟的流式输出";
  const parts = Array.from(text);
  for (const ch of parts) {
    yield ch;
    await new Promise((r) => setTimeout(r, 30));
  }
}
