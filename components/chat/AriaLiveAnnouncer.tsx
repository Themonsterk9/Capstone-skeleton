"use client";

import React, { useEffect, useRef, useState } from "react";

interface AriaLiveAnnouncerProps {
  content: string;
  isStreaming: boolean;
  status?: "thinking" | "streaming" | "completed" | "stopped" | "error";
  assistantName?: string;
}

export default function AriaLiveAnnouncer({
  content,
  isStreaming,
  status,
  assistantName = "FlyRank AI",
}: AriaLiveAnnouncerProps) {
  const [announcement, setAnnouncement] = useState("");
  const lastAnnouncedLength = useRef(0);
  const wasStreaming = useRef(false);

  useEffect(() => {
    // 1. Handle transitions from idle/thinking to active streaming
    if (isStreaming && !wasStreaming.current) {
      setAnnouncement(`${assistantName} is generating a response...`);
      lastAnnouncedLength.current = 0;
      wasStreaming.current = true;
      return;
    }

    // 2. Handle when streaming stops, completes, or errors
    if (!isStreaming && wasStreaming.current) {
      wasStreaming.current = false;
      const remainingText = content.slice(lastAnnouncedLength.current).trim();
      
      let suffix = "";
      if (status === "completed") {
        suffix = " (Response complete.)";
      } else if (status === "stopped") {
        suffix = " (Generation stopped by user.)";
      } else if (status === "error") {
        suffix = " (Generation failed.)";
      }

      if (remainingText) {
        setAnnouncement(remainingText + suffix);
      } else if (suffix) {
        setAnnouncement(suffix.trim());
      }
      return;
    }

    // 3. During streaming, identify completed sentences and announce them
    if (isStreaming && content) {
      const pendingText = content.slice(lastAnnouncedLength.current);
      
      // Match completed sentences (any characters ending with . ? or ! followed by space or newline)
      const sentenceRegex = /[^.!?]+[.!?]+(?=\s+)/g;
      let match;
      let lastIndex = 0;
      let sentencesAnnounced = "";

      while ((match = sentenceRegex.exec(pendingText)) !== null) {
        sentencesAnnounced += match[0];
        lastIndex = sentenceRegex.lastIndex;
      }

      if (sentencesAnnounced) {
        setAnnouncement(sentencesAnnounced.trim());
        lastAnnouncedLength.current += lastIndex;
      }
    }
  }, [content, isStreaming, status, assistantName]);

  useEffect(() => {
    // Reset when content is cleared between conversations
    if (!content && !isStreaming) {
      const timer = setTimeout(() => {
        setAnnouncement("");
        lastAnnouncedLength.current = 0;
        wasStreaming.current = false;
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [content, isStreaming]);

  return (
    <div
      className="sr-only"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {announcement}
    </div>
  );
}
