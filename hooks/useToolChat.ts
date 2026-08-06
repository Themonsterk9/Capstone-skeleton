"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { ToolChatMessage, SEOAuditToolPart, KnownToolPart } from "@/types/tools";
import { seoAuditOutputSchema, seoAuditInputSchema } from "@/server/tools/seoAudit";

const TOOL_STORAGE_KEY = "flyrank_tool_chat_messages_v1";
const TOOL_API_ENDPOINT = "/api/tool-chat";

function useIsMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);
  return mounted;
}

/**
 * Parse a line from the AI SDK UI message stream.
 * The stream format uses SSE-like lines: "<type>:<json>\n"
 *
 * Known types in AI SDK v7 toUIMessageStream output:
 *   "0" = text delta
 *   "a" = tool-call-streaming-start  { toolCallId, toolName }
 *   "b" = tool-call-delta           { toolCallId, argsTextDelta }
 *   "9" = tool-call                 { toolCallId, toolName, args }
 *   "a" = tool-result               { toolCallId, result }  (re-used type "a" or "c")
 *   "d" = finish
 *   "e" = error
 *
 * We parse them and update the message state.
 */
interface StreamChunk {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

function parseStreamLine(line: string): StreamChunk | null {
  if (!line.trim()) return null;
  const colonIdx = line.indexOf(":");
  if (colonIdx === -1) return null;
  const type = line.slice(0, colonIdx).trim();
  const rawData = line.slice(colonIdx + 1).trim();
  try {
    return { type, data: JSON.parse(rawData) };
  } catch {
    return { type, data: rawData };
  }
}

export function useToolChat() {
  const isMounted = useIsMounted();

  const [messages, setMessages] = useState<ToolChatMessage[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(TOOL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      /* ignore */
    }
    return [];
  });

  const [input, setInput] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [isSlowThinking, setIsSlowThinking] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const thinkingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const clearThinkingTimer = useCallback(() => {
    if (thinkingTimerRef.current) {
      clearTimeout(thinkingTimerRef.current);
      thinkingTimerRef.current = null;
    }
    setIsSlowThinking(false);
  }, []);

  const saveMessages = useCallback(
    (msgs: ToolChatMessage[]) => {
      try {
        localStorage.setItem(TOOL_STORAGE_KEY, JSON.stringify(msgs));
      } catch (e) {
        console.warn("Failed to save tool chat history", e);
      }
    },
    []
  );

  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    clearThinkingTimer();
    setIsStreaming(false);

    setMessages((prev) => {
      const updated = prev.map((m) =>
        m.status === "thinking" || m.status === "streaming"
          ? { ...m, status: "stopped" as const }
          : m
      );
      saveMessages(updated);
      return updated;
    });
  }, [saveMessages, clearThinkingTimer]);

  const sendMessage = useCallback(
    async (overrideContent?: string) => {
      const content = (overrideContent !== undefined ? overrideContent : input).trim();
      if (!content || isStreaming) return;

      setError(null);
      setInput("");

      const userMsg: ToolChatMessage = {
        id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        role: "user",
        content,
        timestamp: new Date().toISOString(),
        status: "completed",
      };

      const assistantId = `assistant-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const assistantMsg: ToolChatMessage = {
        id: assistantId,
        role: "assistant",
        content: "",
        timestamp: new Date().toISOString(),
        status: "thinking",
        toolParts: [],
      };

      const nextMessages = [...messages, userMsg, assistantMsg];
      setMessages(nextMessages);
      saveMessages(nextMessages);
      setIsStreaming(true);

      // Start 2-second slow thinking timer
      clearThinkingTimer();
      thinkingTimerRef.current = setTimeout(() => {
        setIsSlowThinking(true);
      }, 2000);

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      try {
        // Build payload using only the text messages (tool parts live client-side)
        const payload = nextMessages
          .filter((m) => m.id !== assistantId && m.content)
          .map((m) => ({ role: m.role, content: m.content }));

        const response = await fetch(TOOL_API_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: payload }),
          signal: abortController.signal,
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({ error: "Server error" }));
          throw new Error(errData.error || `HTTP ${response.status}`);
        }

        if (!response.body) throw new Error("No stream body");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        // Track tool states per toolCallId
        const toolCallArgs: Record<string, string> = {};
        const toolCallNames: Record<string, string> = {};

        // Process line-by-line from stream
        const processLine = (line: string) => {
          const chunk = parseStreamLine(line);
          if (!chunk) return;

          const { type, data } = chunk;

          setMessages((prev) =>
            prev.map((msg) => {
              if (msg.id !== assistantId) return msg;

              let toolParts = [...(msg.toolParts ?? [])];

              // type "0" = text delta
              if (type === "0") {
                const textDelta = typeof data === "string" ? data : String(data ?? "");
                return {
                  ...msg,
                  content: msg.content + textDelta,
                  status: "streaming" as const,
                };
              }

              // type "a" = tool-call-streaming-start OR tool-result (distinguish by shape)
              if (type === "a") {
                if (data && typeof data === "object" && "toolCallId" in data && "toolName" in data && !("result" in data)) {
                  // Tool streaming start
                  const { toolCallId, toolName } = data as { toolCallId: string; toolName: string };
                  toolCallNames[toolCallId] = toolName;
                  toolCallArgs[toolCallId] = "";

                  const newPart: SEOAuditToolPart = {
                    toolCallId,
                    toolName: toolName as "seoAudit",
                    state: "streaming",
                  };
                  toolParts = [...toolParts.filter((p) => p.toolCallId !== toolCallId), newPart];
                  return { ...msg, toolParts, status: "streaming" as const };
                }

                if (data && typeof data === "object" && "toolCallId" in data && "result" in data) {
                  // Tool result
                  const { toolCallId, result } = data as { toolCallId: string; result: unknown };
                  const toolName = toolCallNames[toolCallId] ?? "seoAudit";

                  try {
                    if (toolName === "seoAudit") {
                      const parsedOutput = seoAuditOutputSchema.parse(result);
                      const argsStr = toolCallArgs[toolCallId] ?? "{}";
                      const parsedInput = (() => {
                        try { return seoAuditInputSchema.parse(JSON.parse(argsStr)); }
                        catch { return { url: parsedOutput.url }; }
                      })();

                      const resultPart: SEOAuditToolPart = {
                        toolCallId,
                        toolName: "seoAudit",
                        state: "output",
                        input: parsedInput,
                        output: parsedOutput,
                      };
                      toolParts = [...toolParts.filter((p) => p.toolCallId !== toolCallId), resultPart];
                    }
                  } catch {
                    const errPart: SEOAuditToolPart = {
                      toolCallId,
                      toolName: "seoAudit",
                      state: "error",
                      error: "Failed to parse tool result",
                    };
                    toolParts = [...toolParts.filter((p) => p.toolCallId !== toolCallId), errPart];
                  }
                  return { ...msg, toolParts };
                }
              }

              // type "b" = tool-call-delta (args streaming)
              if (type === "b") {
                const { toolCallId, argsTextDelta } = data as { toolCallId: string; argsTextDelta: string };
                toolCallArgs[toolCallId] = (toolCallArgs[toolCallId] ?? "") + (argsTextDelta ?? "");

                // Update the streaming part with partial input
                toolParts = toolParts.map((p) => {
                  if (p.toolCallId !== toolCallId) return p;
                  try {
                    const partialArgs = JSON.parse(toolCallArgs[toolCallId]);
                    return {
                      ...p,
                      state: "streaming" as const,
                      input: partialArgs,
                    } as KnownToolPart;
                  } catch {
                    return p;
                  }
                });
                return { ...msg, toolParts };
              }

              // type "9" = tool-call (full, non-streaming)
              if (type === "9") {
                const { toolCallId, toolName, args } = data as {
                  toolCallId: string;
                  toolName: string;
                  args: unknown;
                };
                toolCallNames[toolCallId] = toolName;
                const argsStr = typeof args === "string" ? args : JSON.stringify(args ?? {});
                toolCallArgs[toolCallId] = argsStr;

                try {
                  if (toolName === "seoAudit") {
                    const parsedInput = seoAuditInputSchema.parse(
                      typeof args === "object" ? args : JSON.parse(argsStr)
                    );
                    const inputPart: SEOAuditToolPart = {
                      toolCallId,
                      toolName: "seoAudit",
                      state: "input",
                      input: parsedInput,
                    };
                    toolParts = [...toolParts.filter((p) => p.toolCallId !== toolCallId), inputPart];
                  }
                } catch {
                  const streamPart: SEOAuditToolPart = {
                    toolCallId,
                    toolName: "seoAudit",
                    state: "input",
                    input: { url: String((args as Record<string, unknown>)?.url ?? "") },
                  };
                  toolParts = [...toolParts.filter((p) => p.toolCallId !== toolCallId), streamPart];
                }
                return { ...msg, toolParts, status: "streaming" as const };
              }

              // type "c" = tool-result (alternative encoding)
              if (type === "c") {
                const { toolCallId, result } = data as { toolCallId: string; result: unknown };
                const toolName = toolCallNames[toolCallId] ?? "seoAudit";

                try {
                  if (toolName === "seoAudit") {
                    const parsedOutput = seoAuditOutputSchema.parse(result);
                    const argsStr = toolCallArgs[toolCallId] ?? "{}";
                    const parsedInput = (() => {
                      try { return seoAuditInputSchema.parse(JSON.parse(argsStr)); }
                      catch { return { url: parsedOutput.url }; }
                    })();

                    const resultPart: SEOAuditToolPart = {
                      toolCallId,
                      toolName: "seoAudit",
                      state: "output",
                      input: parsedInput,
                      output: parsedOutput,
                    };
                    toolParts = [...toolParts.filter((p) => p.toolCallId !== toolCallId), resultPart];
                  }
                } catch (parseErr) {
                  console.error("Failed to parse tool result:", parseErr);
                  const errPart: SEOAuditToolPart = {
                    toolCallId,
                    toolName: "seoAudit",
                    state: "error",
                    error: "Failed to parse tool result data",
                  };
                  toolParts = [...toolParts.filter((p) => p.toolCallId !== toolCallId), errPart];
                }
                return { ...msg, toolParts };
              }

              // type "e" = error
              if (type === "e") {
                const errorMessage = typeof data === "string" ? data : data?.message ?? "Tool execution failed";
                toolParts = toolParts.map((p) =>
                  p.state === "streaming" || p.state === "input"
                    ? ({ ...p, state: "error" as const, error: errorMessage } as KnownToolPart)
                    : p
                );
                return { ...msg, toolParts, status: "error" as const };
              }

              return msg;
            })
          );
        };

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            processLine(line);
          }
        }

        // Process any remaining buffer
        if (buffer.trim()) processLine(buffer);

        // Mark as completed
        setMessages((prev) => {
          const updated = prev.map((m) =>
            m.id === assistantId ? { ...m, status: "completed" as const } : m
          );
          saveMessages(updated);
          return updated;
        });
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;

        const errorMessage = err instanceof Error ? err.message : "An error occurred.";
        setError(errorMessage);

        setMessages((prev) => {
          const updated = prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  status: "completed" as const,
                  content:
                    m.content ||
                    (m.toolParts && m.toolParts.length > 0
                      ? ""
                      : "Hello! I am **FlyRank AI SEO Assistant**. Ask me to audit any website URL (e.g. `Audit https://example.com`) to generate an interactive SEO report!"),
                }
              : m
          );
          saveMessages(updated);
          return updated;
        });
      } finally {
        clearThinkingTimer();
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [input, isStreaming, messages, saveMessages, clearThinkingTimer]
  );

  const clearMessages = useCallback(() => {
    stopGeneration();
    setMessages([]);
    setError(null);
    try { localStorage.removeItem(TOOL_STORAGE_KEY); } catch { /* ignore */ }
  }, [stopGeneration]);

  const retryLastMessage = useCallback(() => {
    if (isStreaming) return;
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (lastUser) {
      setMessages((prev) => prev.filter((m) => m.status !== "error"));
      sendMessage(lastUser.content);
    }
  }, [isStreaming, messages, sendMessage]);

  return {
    messages,
    isMounted,
    input,
    setInput,
    isStreaming,
    isSlowThinking,
    error,
    sendMessage,
    stopGeneration,
    clearMessages,
    retryLastMessage,
  };
}
