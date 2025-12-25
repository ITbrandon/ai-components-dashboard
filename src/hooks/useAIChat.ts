import { useState, useCallback } from "react";
import { streamAIResponse } from "../lib/mockAI";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export type ChatStatus = "idle" | "loading" | "streaming" | "error";

export function useAIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your AI dashboard assistant. I can help you analyze data, generate reports, and provide insights. What would you like to explore today?",
      timestamp: new Date(),
    },
  ]);
  const [status, setStatus] = useState<ChatStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setStatus("loading");
    setError(null);

    const assistantId = `assistant-${Date.now()}`;

    try {
      // Add placeholder message for streaming
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: "assistant",
          content: "",
          timestamp: new Date(),
          isStreaming: true,
        },
      ]);

      setStatus("streaming");

      for await (const chunk of streamAIResponse(content)) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId
              ? { ...msg, content: chunk.content, isStreaming: !chunk.isComplete }
              : msg
          )
        );
      }

      setStatus("idle");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setStatus("error");
      // Remove the failed message
      setMessages((prev) => prev.filter((msg) => msg.id !== assistantId));
    }
  }, []);

  const retry = useCallback(() => {
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
    if (lastUserMessage) {
      // Remove the last user message and resend
      setMessages((prev) => prev.filter((m) => m.id !== lastUserMessage.id));
      sendMessage(lastUserMessage.content);
    }
  }, [messages, sendMessage]);

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Chat cleared. How can I help you?",
        timestamp: new Date(),
      },
    ]);
    setStatus("idle");
    setError(null);
  }, []);

  return {
    messages,
    status,
    error,
    sendMessage,
    retry,
    clearChat,
  };
}
