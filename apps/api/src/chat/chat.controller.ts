import { Controller, Post, Body, Res, Header } from "@nestjs/common";
import type { Response } from "express";
import { ChatService } from "./chat.service";

@Controller("chat")
export class ChatController {
  constructor(private readonly chat: ChatService) {}
  @Post("stream")
  @Header("Content-Type", "text/event-stream")
  @Header("Cache-Control", "no-cache")
  @Header("Connection", "keep-alive")
  async stream(@Body() body: any, @Res() res: Response) {
    res.flushHeaders();
    const input =
      typeof body?.input === "string"
        ? body.input
        : body?.messages?.[body?.messages?.length - 1]?.text || "";
    const messages = Array.isArray(body?.messages) ? body.messages : [];
    try {
      const it = await this.chat.streamChunks({ input, messages });
      for await (const chunk of it) {
        const line = `data: ${JSON.stringify({
          delta: chunk,
          done: false,
        })}\n\n`;
        res.write(line);
      }
      res.write(`data: ${JSON.stringify({ delta: "", done: true })}\n\n`);
    } catch (e) {
      res.write(`data: ${JSON.stringify({ error: String(e) })}\n\n`);
    } finally {
      res.end();
    }
  }
}
