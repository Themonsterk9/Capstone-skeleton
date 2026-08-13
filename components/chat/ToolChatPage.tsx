"use client";

import React, { useRef, useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToolChat } from "@/hooks/useToolChat";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { ToolChatMessage } from "@/types/tools";
import ToolRenderer from "@/components/tools/ToolRenderer";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import OfflineBanner from "@/components/resilience/OfflineBanner";
import SlowResponseCard from "@/components/resilience/SlowResponseCard";
import OnboardingState from "@/components/resilience/OnboardingState";
import AriaLiveAnnouncer from "./AriaLiveAnnouncer";
import StopButton from "./StopButton";

// ─── Suggested Prompts ─────────────────────────────────────────────────────────
const SUGGESTED_PROMPTS = [
  "Audit https://example.com for SEO issues",
  "Analyze https://github.com and give me an SEO report",
  "Run an SEO audit on https://nextjs.org",
  "Check the SEO health of https://vercel.com",
];

// ─── User Message Bubble ───────────────────────────────────────────────────────
function UserBubble({ message }: { message: ToolChatMessage }) {
  const time = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-end gap-3 my-3"
    >
      <div className="flex flex-col items-end max-w-[80%] sm:max-w-[75%]">
        <div className="flex items-center gap-2 mb-1">
          <span suppressHydrationWarning className="text-[11px] text-gray-500 font-mono">{time}</span>
          <span className="text-xs font-bold text-white">You</span>
        </div>
        <div className="px-4 py-3 rounded-2xl rounded-tr-none bg-gradient-to-br from-indigo-600 to-indigo-700 text-white text-sm leading-relaxed shadow-lg shadow-indigo-900/30">
          {message.content}
        </div>
      </div>
      <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-5 shadow-md">
        U
      </div>
    </motion.div>
  );
}

// ─── Assistant Message Bubble ─────────────────────────────────────────────────
function AssistantBubble({
  message,
  isStreaming,
  onRetry,
}: {
  message: ToolChatMessage;
  isStreaming: boolean;
  onRetry?: () => void;
}) {
  const time = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";

  const isThinking = message.status === "thinking";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start gap-3 my-3 group"
    >
      <div className="w-8 h-8 rounded-full bg-slate-900 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-black text-xs flex-shrink-0 shadow-glow-secondary mt-5">
        AI
      </div>
      <div className="flex flex-col items-start max-w-[92%] sm:max-w-[88%]">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-white tracking-wide">FlyRank AI</span>
          {time && <span suppressHydrationWarning className="text-[11px] text-gray-400 font-mono">{time}</span>}
        </div>

        <div className="w-full space-y-4">
          {/* Thinking state */}
          {isThinking && (!message.toolParts || message.toolParts.length === 0) && (
            <div className="px-5 py-4 rounded-2xl rounded-tl-none glass-panel border border-white/10 shadow-xl">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-cyan-400"
                      animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-400">Thinking…</span>
              </div>
            </div>
          )}

          {/* Tool Call Parts */}
          {message.toolParts && message.toolParts.length > 0 && (
            <div className="space-y-3">
              {message.toolParts.map((part) => (
                <ToolRenderer key={part.toolCallId} part={part} onRetry={onRetry} />
              ))}
            </div>
          )}

          {/* Text content */}
          {message.content && (
            <div className="px-5 py-4 rounded-2xl rounded-tl-none glass-panel border border-white/10 text-text-primary text-sm shadow-xl leading-relaxed">
              <div className="prose prose-invert max-w-none text-sm">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
              </div>
              {isStreaming && (
                <motion.span
                  className="inline-block w-0.5 h-4 bg-cyan-400 ml-1 align-text-bottom"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main ToolChatPage ─────────────────────────────────────────────────────────
export default function ToolChatPage() {
  const {
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
  } = useToolChat();

  const { isOnline } = useNetworkStatus();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll
  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming, isSlowThinking, scrollToBottom]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) {
        sendMessage();
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStreaming && input.trim()) {
      sendMessage();
    }
  };

  const displayMessages = isMounted ? messages : [];
  const lastAssistantMessage = [...displayMessages].reverse().find((m) => m.role === "assistant");

  return (
    <div className="flex-1 flex flex-col w-full h-[calc(100vh-4rem)] bg-bg-dark text-text-primary overflow-hidden">
      {/* Header */}
      <header className="shrink-0 border-b border-border-dark bg-[#0a0c16]/90 backdrop-blur-md px-4 py-3 z-20">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center shadow-glow-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5 text-white" width="20" height="20">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-bold text-base text-white tracking-tight">SEO Audit Assistant</h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Tool Calling
                </span>
              </div>
              <p className="text-[11px] text-gray-400">AI-powered SEO analysis with Generative UI</p>
            </div>
          </div>

          {isMounted && messages.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors"
              aria-label="Clear conversation"
            >
              Clear
            </button>
          )}
        </div>
      </header>

      {/* Network Offline Banner */}
      {!isOnline && (
        <div className="px-4 py-1">
          <OfflineBanner onRetry={retryLastMessage} isRetrying={isStreaming} />
        </div>
      )}

      {/* Error Toast */}
      <AnimatePresence>
        {error && isOnline && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="shrink-0 bg-red-950/80 border-b border-red-800/50 px-4 py-2 text-xs text-red-200 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>{error}</span>
            </div>
            <button
              onClick={retryLastMessage}
              className="px-2.5 py-1 rounded bg-red-900/60 hover:bg-red-800 text-red-100 font-semibold border border-red-700/50 text-xs"
            >
              Retry
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <div
        ref={containerRef}
        className="flex-1 w-full overflow-y-auto px-4 py-6 sm:px-6 scroll-smooth"
        role="log"
        aria-label="SEO Audit chat conversation"
      >
        <div className="max-w-4xl mx-auto">
          {displayMessages.length === 0 ? (
            /* First Run Onboarding State */
            <OnboardingState
              title="SEO Audit Assistant"
              description="Ask me to audit any website URL. I'll analyze its SEO health and generate an interactive report with scores, findings, and recommendations."
              prompts={SUGGESTED_PROMPTS}
              onSelectPrompt={(text) => sendMessage(text)}
            />
          ) : (
            <div className="space-y-2 pb-4">
              {displayMessages.map((msg, idx) =>
                msg.role === "user" ? (
                  <UserBubble key={msg.id || idx} message={msg} />
                ) : (
                  <AssistantBubble
                    key={msg.id || idx}
                    message={msg}
                    isStreaming={isStreaming && idx === displayMessages.length - 1}
                    onRetry={retryLastMessage}
                  />
                )
              )}

              {/* Slow Thinking Indicator (> 2 seconds) */}
              {isSlowThinking && isStreaming && (
                <SlowResponseCard />
              )}

              <div ref={bottomRef} />
            </div>
          )}
        </div>
      </div>

      {/* Visually hidden screen reader announcer */}
      <AriaLiveAnnouncer
        content={lastAssistantMessage?.content || ""}
        isStreaming={isStreaming && lastAssistantMessage?.status === "streaming"}
        status={lastAssistantMessage?.status}
      />

      {/* Input Bar */}
      <div className="shrink-0 p-4 border-t border-border-dark bg-[#07080d]/95 backdrop-blur-md">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="flex items-end gap-3 glass-panel rounded-2xl border border-white/10 px-4 py-3 focus-within:border-cyan-500/30 transition-colors">
            <textarea
              ref={textareaRef}
              id="tool-chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isStreaming}
              rows={1}
              placeholder={isStreaming ? "Analyzing…" : "Ask me to audit a URL — e.g. 'Audit https://example.com'"}
              className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 resize-none outline-none leading-relaxed min-h-[1.5rem] max-h-40 disabled:opacity-50"
              aria-label="Message input for SEO audit chat"
            />
            {isStreaming ? (
              <div className="pb-1 pr-1 shrink-0">
                <StopButton onStop={stopGeneration} />
              </div>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                className="flex-shrink-0 p-2.5 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-900/30 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all"
                aria-label="Send message"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4" width="16" height="16">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            )}
          </form>
          <p className="text-center text-[10px] text-gray-600 mt-2">
            Press Enter to send · Shift+Enter for new line · Powered by AI SDK Tool Calling
          </p>
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      <AnimatePresence>
        {showClearConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md p-6 rounded-2xl glass-panel border border-white/10 shadow-2xl space-y-4"
            >
              <h3 className="text-lg font-bold text-white">Clear Conversation?</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                This will erase all messages from this SEO audit session.
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={() => { clearMessages(); setShowClearConfirm(false); }}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-red-600 hover:bg-red-500 shadow-lg shadow-red-900/40"
                >
                  Confirm Clear
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
