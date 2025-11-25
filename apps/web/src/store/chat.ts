import { create } from "zustand";
import type { Message } from "../types";

type ChatState = {
  messages: Message[];
  generating: boolean;
  input: string;
  addMessage: (m: Message) => void;
  appendToLastAI: (chunk: string) => void;
  setGenerating: (v: boolean) => void;
  setLastAIStatus: (s: Message["status"]) => void;
  setInput: (v: string) => void;
  reset: () => void;
};

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  generating: false,
  input: "",
  addMessage: (m) => set({ messages: [...get().messages, m] }),
  appendToLastAI: (chunk) => {
    const msgs = get().messages;
    for (let i = msgs.length - 1; i >= 0; i--) {
      if (msgs[i].role === "ai") {
        msgs[i] = { ...msgs[i], text: (msgs[i].text ?? "") + chunk };
        break;
      }
    }
    set({ messages: [...msgs] });
  },
  setGenerating: (v) => set({ generating: v }),
  setLastAIStatus: (s) => {
    const msgs = get().messages;
    for (let i = msgs.length - 1; i >= 0; i--) {
      if (msgs[i].role === "ai") {
        msgs[i] = { ...msgs[i], status: s };
        break;
      }
    }
    set({ messages: [...msgs] });
  },
  setInput: (v) => set({ input: v }),
  reset: () => set({ messages: [], generating: false }),
}));
