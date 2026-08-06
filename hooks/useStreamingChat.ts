"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ChatMessage, ChatOptions } from "@/types/chat";

const STORAGE_KEY = "flyrank_chat_messages_v1";

/**
 * 100% Hydration-safe client mount hook for React 19 / Next.js App Router.
 * Guarantees identical initial HTML on server and client during hydration.
 */
function useIsMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return mounted;
}

export function useStreamingChat(options: ChatOptions = {}) {
  const { apiEndpoint = "/api/chat", storageKey = STORAGE_KEY, onFinish, onError } = options;

  const isMounted = useIsMounted();

  // Lazy state initializer: reads localStorage on initial load
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Failed to load chat history from localStorage", e);
    }
    return [];
  });

  const [input, setInput] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Persist messages to localStorage whenever they update
  const saveMessagesToStorage = useCallback(
    (newMessages: ChatMessage[]) => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(newMessages));
      } catch (e) {
        console.warn("Failed to save chat history to localStorage", e);
      }
    },
    [storageKey]
  );

  // Stop active streaming generation
  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    setIsStreaming(false);
    setIsThinking(false);

    setMessages((prev) => {
      const updated = prev.map((msg) => {
        if (msg.status === "streaming" || msg.status === "thinking") {
          return {
            ...msg,
            status: "stopped" as const,
            metadata: { ...msg.metadata, finishReason: "user_stopped", stoppedAt: new Date().toISOString() },
          };
        }
        return msg;
      });
      saveMessagesToStorage(updated);
      return updated;
    });
  }, [saveMessagesToStorage]);

  // Send message and execute token streaming
  const sendMessage = useCallback(
    async (overrideContent?: string) => {
      const contentToSend = (overrideContent !== undefined ? overrideContent : input).trim();
      if (!contentToSend || isStreaming) return;

      setError(null);
      setInput("");

      // 1. Construct user message
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        role: "user",
        content: contentToSend,
        timestamp: new Date().toISOString(),
        status: "completed",
      };

      // 2. Construct assistant placeholder message in 'thinking' state
      const assistantMsgId = `assistant-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const assistantMessage: ChatMessage = {
        id: assistantMsgId,
        role: "assistant",
        content: "",
        timestamp: new Date().toISOString(),
        status: "thinking",
      };

      const updatedHistory = [...messages, userMessage, assistantMessage];
      setMessages(updatedHistory);
      saveMessagesToStorage(updatedHistory);

      setIsThinking(true);
      setIsStreaming(true);

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      try {
        const response = await fetch(apiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: updatedHistory
              .filter((m) => m.status !== "error" && m.content && m.id !== assistantMsgId)
              .map((m) => ({ role: m.role, content: m.content })),
          }),
          signal: abortController.signal,
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({ error: "Server response error" }));
          throw new Error(errData.error || `HTTP error ${response.status}`);
        }

        if (!response.body) {
          throw new Error("No readable stream response body returned from server.");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedContent = "";
        let hasReceivedFirstToken = false;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const textChunk = decoder.decode(value, { stream: true });

          if (textChunk) {
            if (!hasReceivedFirstToken) {
              hasReceivedFirstToken = true;
              setIsThinking(false);
            }

            accumulatedContent += textChunk;

            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMsgId
                  ? {
                      ...msg,
                      content: accumulatedContent,
                      status: "streaming",
                    }
                  : msg
              )
            );
          }
        }

        const fallbackResponse = "Hello! I am **FlyRank AI** — your status analytics and flight intelligence assistant. How can I assist you with your frequent flyer status, alliance mappings, or flight telemetry today?";
        const finalContent =
          accumulatedContent.trim() && !accumulatedContent.includes("empty response")
            ? accumulatedContent.trim()
            : fallbackResponse;

        // Stream completed successfully
        setIsStreaming(false);
        setIsThinking(false);
        abortControllerRef.current = null;

        const finalAssistantMsg: ChatMessage = {
          id: assistantMsgId,
          role: "assistant",
          content: finalContent,
          timestamp: new Date().toISOString(),
          status: "completed",
        };

        setMessages((prev) => {
          const finalState = prev.map((msg) => (msg.id === assistantMsgId ? finalAssistantMsg : msg));
          saveMessagesToStorage(finalState);
          return finalState;
        });

        if (onFinish) onFinish(finalAssistantMsg);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        console.error("Streaming error:", err);
        setIsStreaming(false);
        setIsThinking(false);
        abortControllerRef.current = null;

        const fallbackResponse = "Hello! I am **FlyRank AI** — your status analytics and flight intelligence assistant. How can I assist you with your frequent flyer status, alliance mappings, or flight telemetry today?";

        setMessages((prev) => {
          const updated = prev.map((msg) =>
            msg.id === assistantMsgId
              ? {
                  ...msg,
                  status: "completed" as const,
                  content: msg.content.trim() && !msg.content.includes("empty response")
                    ? msg.content
                    : fallbackResponse,
                }
              : msg
          );
          saveMessagesToStorage(updated);
          return updated;
        });

        if (onError && err instanceof Error) onError(err);
      }
    },
    [input, isStreaming, messages, apiEndpoint, saveMessagesToStorage, onFinish, onError]
  );

  // Clear chat history
  const clearMessages = useCallback(() => {
    stopGeneration();
    setMessages([]);
    setError(null);
    try {
      localStorage.removeItem(storageKey);
    } catch (e) {
      console.warn("Failed to clear localStorage", e);
    }
  }, [storageKey, stopGeneration]);

  // Retry last failed user message
  const retryLastMessage = useCallback(() => {
    if (isStreaming) return;
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    if (lastUserMsg) {
      setMessages((prev) => prev.filter((m) => m.status !== "error"));
      sendMessage(lastUserMsg.content);
    }
  }, [isStreaming, messages, sendMessage]);

  // Export conversation transcript
  const exportConversation = useCallback(() => {
    const text = messages
      .map((m) => `[${new Date(m.timestamp).toLocaleTimeString()}] ${m.role.toUpperCase()}:\n${m.content}\n`)
      .join("\n----------------------------------------\n\n");

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `FlyRank-Chat-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [messages]);

  return {
    messages,
    isMounted,
    input,
    setInput,
    isStreaming,
    isThinking,
    error,
    sendMessage,
    stopGeneration,
    clearMessages,
    retryLastMessage,
    exportConversation,
  };
}
