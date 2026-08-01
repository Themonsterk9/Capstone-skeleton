"use client";

import React from "react";
import { ChatMessage } from "@/types/chat";

interface UserBubbleProps {
  message: ChatMessage;
}

export default function UserBubble({ message }: UserBubbleProps) {
  const formattedTime = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";

  return (
    <div className="flex justify-end gap-3 my-4 group">
      <div className="flex flex-col items-end max-w-[85%] sm:max-w-[75%]">
        <div className="flex items-center gap-2 mb-1">
          {formattedTime && <span suppressHydrationWarning className="text-[11px] text-gray-400 font-mono">{formattedTime}</span>}
          <span className="text-xs font-semibold text-cyan-300">You</span>
        </div>
        <div className="px-4 py-3 rounded-2xl rounded-tr-none bg-gradient-to-r from-secondary/20 to-primary/30 border border-secondary/30 text-text-primary text-sm shadow-md leading-relaxed break-words">
          {message.content}
        </div>
      </div>
      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-secondary to-primary flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-glow-secondary mt-5">
        U
      </div>
    </div>
  );
}
