"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { ChatMessage as ChatMessageType } from "@/types/chat";
import ChatMessage from "./ChatMessage";
import ScrollAnchor from "./ScrollAnchor";
import JumpToLatestButton from "./JumpToLatestButton";
import OnboardingState from "@/components/resilience/OnboardingState";
import SlowResponseCard from "@/components/resilience/SlowResponseCard";

interface ChatWindowProps {
  messages: ChatMessageType[];
  isStreaming: boolean;
  isSlowThinking?: boolean;
  isMounted?: boolean;
  onSelectPrompt?: (promptText: string) => void;
}

export default function ChatWindow({
  messages,
  isStreaming,
  isSlowThinking = false,
  isMounted = true,
  onSelectPrompt,
}: ChatWindowProps) {
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
  }, [messages, isStreaming, isSlowThinking, scrollToBottom]);

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
          <OnboardingState onSelectPrompt={(text) => onSelectPrompt && onSelectPrompt(text)} />
        ) : (
          <div className="max-w-4xl mx-auto space-y-4">
            {displayMessages.map((msg, idx) => (
              <ChatMessage
                key={msg.id || idx}
                message={msg}
                isStreamingMessage={isStreaming && idx === displayMessages.length - 1 && msg.role === "assistant"}
              />
            ))}

            {/* Slow Thinking Indicator (> 2 seconds) */}
            {isSlowThinking && isStreaming && (
              <SlowResponseCard />
            )}

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
