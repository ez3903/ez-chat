import { Injectable } from "@nestjs/common";
import { buildChain, mockStream } from "./chain";
import { AIMessage, HumanMessage } from "@langchain/core/messages";

@Injectable()
export class ChatService {
  async streamChunks(payload: { input: string; messages?: any[] }) {
    const input = payload?.input ?? "";
    const historyArr = Array.isArray(payload?.messages) ? payload.messages : [];
    const history = historyArr
      .filter((m) => typeof m?.text === "string" && m?.text.length > 0)
      .map((m) =>
        m?.role === "user" ? new HumanMessage(m.text) : new AIMessage(m.text)
      );
    const chain = await buildChain();
    if (chain && typeof chain.stream === "function") {
      return await chain.stream({ input, history });
    }
    return mockStream(input);
  }
}
