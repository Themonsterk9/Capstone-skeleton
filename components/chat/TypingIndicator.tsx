"use client";

import React from "react";

export default function TypingIndicator() {
  return (
    <div
      className="flex items-center gap-3 py-2 px-3 rounded-lg bg-white/5 border border-white/10 text-xs text-cyan-300 font-medium w-fit animate-pulse"
      role="status"
      aria-live="polite"
      aria-label="Thinking..."
    >
      <div className="flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
      <span className="tracking-wide">Thinking...</span>
    </div>
  );
}
