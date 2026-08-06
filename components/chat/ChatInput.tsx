"use client";

import React, { useRef, useEffect } from "react";
import SendButton from "./SendButton";
import StopButton from "./StopButton";

interface ChatInputProps {
  input: string;
  setInput: (val: string) => void;
  onSend: () => void;
  onStop: () => void;
  isStreaming: boolean;
  disabled?: boolean;
}

export default function ChatInput({
  input,
  setInput,
  onSend,
  onStop,
  isStreaming,
  disabled = false,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea height as content expands
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isStreaming && input.trim()) {
        onSend();
      }
    } else if (e.key === "Escape" && isStreaming) {
      e.preventDefault();
      onStop();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStreaming && input.trim()) {
      onSend();
    }
  };

  const isOnlyWhitespace = input.length > 0 && !input.trim();

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative w-full max-w-4xl mx-auto rounded-xl bg-[#0d101c]/90 border shadow-2xl p-2.5 backdrop-blur-lg transition-all ${
        isOnlyWhitespace
          ? "border-amber-500/50 shadow-amber-950/20"
          : "border-white/10 focus-within:border-cyan-500/50"
      }`}
    >
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isStreaming ? "AI is generating a response..." : "Ask FlyRank AI about status tiers, alliance matching, status runs..."}
          rows={1}
          disabled={disabled || isStreaming}
          className="w-full bg-transparent text-sm text-text-primary placeholder-gray-500 focus:outline-none resize-none py-2 px-3 min-h-[44px] max-h-[180px] leading-relaxed disabled:opacity-50"
          aria-label="Chat message input field"
          aria-invalid={isOnlyWhitespace}
        />

        <div className="flex items-center gap-2 pb-1 pr-1 shrink-0">
          {isStreaming ? (
            <StopButton onStop={onStop} />
          ) : (
            <SendButton disabled={disabled || !input.trim()} />
          )}
        </div>
      </div>

      {/* Footer helper info & validation alert */}
      <div className="flex items-center justify-between px-3 pt-1 text-[11px] text-gray-500 border-t border-white/5 mt-1">
        {isOnlyWhitespace ? (
          <span className="text-amber-400 font-medium flex items-center gap-1">
            ⚠️ Please enter a message (whitespace-only input cannot be sent)
          </span>
        ) : (
          <span>Use <kbd className="px-1 py-0.5 rounded bg-white/10 text-gray-300 font-mono text-[10px]">Enter</kbd> to send, <kbd className="px-1 py-0.5 rounded bg-white/10 text-gray-300 font-mono text-[10px]">Shift+Enter</kbd> for line break</span>
        )}
        <span>{input.length} chars</span>
      </div>
    </form>
  );
}
