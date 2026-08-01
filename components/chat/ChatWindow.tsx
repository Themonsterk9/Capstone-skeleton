"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { ChatMessage as ChatMessageType } from "@/types/chat";
import ChatMessage from "./ChatMessage";
import ScrollAnchor from "./ScrollAnchor";
import JumpToLatestButton from "./JumpToLatestButton";

interface ChatWindowProps {
  messages: ChatMessageType[];
  isStreaming: boolean;
  isMounted?: boolean;
  onSelectPrompt?: (promptText: string) => void;
}

const SUGGESTED_PROMPTS = [
  "How do Star Alliance status levels map to Oneworld Emerald and Sapphire?",
  "Calculate status qualification requirements for Delta Diamond Medallion.",
  "What is the best mileage run strategy for BA Executive Club Tier Points?",
  "Explain airport lounge access policies for Star Alliance Gold members.",
];

export default function ChatWindow({ messages, isStreaming, isMounted = true, onSelectPrompt }: ChatWindowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [showJumpToBottom, setShowJumpToBottom] = useState(false);
  const userHasScrolledUp = useRef(false);

  // Scroll smooth to bottom
  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior, block: "end" });
    }
  }, []);

  // Check scroll position to determine whether auto-scroll should follow or show Jump button
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 80;

    if (isAtBottom) {
      userHasScrolledUp.current = false;
      setShowJumpToBottom(false);
    } else {
      userHasScrolledUp.current = true;
      setShowJumpToBottom(true);
    }
  }, []);

  // Auto-scroll when new token arrives if user has not manually scrolled up
  useEffect(() => {
    if (!userHasScrolledUp.current) {
      scrollToBottom("smooth");
    }
  }, [messages, isStreaming, scrollToBottom]);

  // Determine effective messages list based on client mount state to prevent SSR/client hydration mismatch
  const displayMessages = isMounted ? messages : [];

  return (
    <div className="relative flex-1 w-full h-full flex flex-col min-h-0 overflow-hidden">
      {/* Scrollable Message Container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 w-full overflow-y-auto px-4 py-6 sm:px-6 space-y-4 scroll-smooth"
        role="log"
        aria-live="polite"
        aria-label="Chat conversation history"
      >
        {displayMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-secondary/20 to-primary/20 border border-secondary/30 flex items-center justify-center text-cyan-400 mb-6 shadow-glow-secondary animate-pulse">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-bold font-display text-white mb-2">
              FlyRank AI Intelligence Console
            </h2>
            <p className="text-sm text-gray-400 max-w-md mb-8">
              Ask anything about frequent flyer tiers, alliance matching, status run calculations, or airport lounge access policies.
            </p>

            {/* Suggested Prompt Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl w-full">
              {SUGGESTED_PROMPTS.map((promptText, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectPrompt && onSelectPrompt(promptText)}
                  className="p-3.5 rounded-xl glass-panel glass-panel-hover text-left text-xs text-gray-300 hover:text-white border border-white/10 hover:border-cyan-500/40 transition-all flex items-start gap-2.5 group"
                >
                  <span className="text-cyan-400 font-mono text-[10px] shrink-0 mt-0.5">0{idx + 1}.</span>
                  <span className="leading-relaxed group-hover:text-cyan-200">{promptText}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-4">
            {displayMessages.map((msg, idx) => (
              <ChatMessage
                key={msg.id || idx}
                message={msg}
                isStreamingMessage={isStreaming && idx === displayMessages.length - 1 && msg.role === "assistant"}
              />
            ))}
            <ScrollAnchor ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Floating Jump to Latest Button */}
      <JumpToLatestButton
        onClick={() => {
          userHasScrolledUp.current = false;
          scrollToBottom("smooth");
        }}
        visible={showJumpToBottom}
      />
    </div>
  );
}
