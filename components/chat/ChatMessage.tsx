"use client";

import React from "react";
import { ChatMessage as ChatMessageType } from "@/types/chat";
import UserBubble from "./UserBubble";
import AssistantBubble from "./AssistantBubble";

interface ChatMessageProps {
  message: ChatMessageType;
  isStreamingMessage?: boolean;
}

export default function ChatMessage({ message, isStreamingMessage = false }: ChatMessageProps) {
  if (message.role === "user") {
    return <UserBubble message={message} />;
  }

  return <AssistantBubble message={message} isStreamingMessage={isStreamingMessage} />;
}
