"use client";

import React, { useState } from "react";
import { useStreamingChat } from "@/hooks/useStreamingChat";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";
import Container from "@/components/Container";
import OfflineBanner from "@/components/resilience/OfflineBanner";

export default function ChatPage() {
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
    exportConversation,
  } = useStreamingChat();

  const { isOnline } = useNetworkStatus();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  return (
    <div className="flex-1 flex flex-col w-full h-[calc(100vh-4rem)] bg-bg-dark text-text-primary overflow-hidden">
      {/* Top Header & Toolbar */}
      <header className="shrink-0 border-b border-border-dark bg-[#0a0c16]/90 backdrop-blur-md px-4 py-3 z-20">
        <Container className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-secondary to-primary flex items-center justify-center shadow-glow-secondary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 text-white"
                width="20"
                height="20"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-bold text-base text-white tracking-tight">
                  FlyRank AI Assistant
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Gemini 2.0 Streaming
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                Real-time Status Analytics & Flight Telemetry Engine
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2">
            {isMounted && messages.length > 0 && (
              <>
                <button
                  onClick={exportConversation}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-1.5"
                  title="Export conversation history"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  <span>Export</span>
                </button>

                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors flex items-center gap-1.5"
                  title="Clear conversation history"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                  <span>Clear</span>
                </button>
              </>
            )}
          </div>
        </Container>
      </header>

      {/* Network Offline Banner */}
      {!isOnline && (
        <div className="px-4 py-1">
          <OfflineBanner onRetry={retryLastMessage} isRetrying={isStreaming} />
        </div>
      )}

      {/* Network Error Toast / Banner */}
      {error && isOnline && (
        <div className="shrink-0 bg-red-950/80 border-b border-red-800/50 px-4 py-2 text-xs text-red-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>{error}</span>
          </div>
          <button
            onClick={retryLastMessage}
            className="px-2.5 py-1 rounded bg-red-900/60 hover:bg-red-800 text-red-100 font-semibold border border-red-700/50"
          >
            Retry Last Message
          </button>
        </div>
      )}

      {/* Main Chat Stream Container */}
      <ChatWindow
        messages={messages}
        isStreaming={isStreaming}
        isSlowThinking={isSlowThinking}
        isMounted={isMounted}
        onSelectPrompt={(text) => sendMessage(text)}
      />

      {/* Sticky Bottom Input Bar */}
      <div className="shrink-0 p-4 border-t border-border-dark bg-[#07080d]/95 backdrop-blur-md">
        <ChatInput
          input={input}
          setInput={setInput}
          onSend={() => sendMessage()}
          onStop={stopGeneration}
          isStreaming={isStreaming}
        />
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md p-6 rounded-2xl glass-panel border border-white/10 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Clear Conversation?</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              This will erase all messages in this session from your local storage. This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  clearMessages();
                  setShowClearConfirm(false);
                }}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-red-600 hover:bg-red-500 shadow-lg shadow-red-900/40"
              >
                Confirm Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
