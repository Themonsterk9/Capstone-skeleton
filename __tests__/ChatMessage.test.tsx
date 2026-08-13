import React from "react";
import { render, screen } from "@testing-library/react";
import ChatMessage from "@/components/chat/ChatMessage";
import { ChatMessage as ChatMessageType } from "@/types/chat";

describe("ChatMessage Component Tests", () => {
  test("renders user message bubble with correct text content", () => {
    const userMessage: ChatMessageType = {
      id: "msg-1",
      role: "user",
      content: "Can you analyze the SEO of my site?",
      timestamp: "",
    };

    render(<ChatMessage message={userMessage} />);

    // Query by content text and role labels
    expect(screen.getByText("Can you analyze the SEO of my site?")).toBeInTheDocument();
    expect(screen.getByText("You")).toBeInTheDocument();
  });

  test("renders assistant message bubble with markdown bold text", () => {
    const assistantMessage: ChatMessageType = {
      id: "msg-2",
      role: "assistant",
      content: "Yes, I can check your **metadata** tags.",
      timestamp: "",
      status: "completed",
    };

    render(<ChatMessage message={assistantMessage} />);

    expect(screen.getByText("FlyRank AI")).toBeInTheDocument();
    expect(screen.getByText(/Yes, I can check your/i)).toBeInTheDocument();
    
    // In react-markdown **metadata** becomes strong
    const boldEl = screen.getByText("metadata");
    expect(boldEl.tagName.toLowerCase()).toBe("strong");
  });

  test("renders code block correctly", () => {
    const codeMessage: ChatMessageType = {
      id: "msg-3",
      role: "assistant",
      content: "Here is code:\n```javascript\nconsole.log('hello');\n```",
      timestamp: "",
    };

    render(<ChatMessage message={codeMessage} />);

    expect(screen.getByText("Copy code")).toBeInTheDocument();
    expect(screen.getByText("javascript")).toBeInTheDocument();
    expect(screen.getByText("console.log('hello');")).toBeInTheDocument();
  });

  test("renders thinking/pending state correctly", () => {
    const thinkingMessage: ChatMessageType = {
      id: "msg-4",
      role: "assistant",
      content: "",
      timestamp: "",
      status: "thinking",
    };

    render(<ChatMessage message={thinkingMessage} />);

    // Asserts typing/thinking state is rendered (TypingIndicator renders animate dots)
    // Check for "thinking" or "TypingIndicator" related elements
    expect(screen.queryByText("FlyRank AI")).toBeInTheDocument();
    // The TypingIndicator component uses animate dots
    const bubbleParent = screen.getByText("FlyRank AI").closest("div");
    expect(bubbleParent).toBeInTheDocument();
  });

  test("renders error and stopped badges correctly", () => {
    const errorMessage: ChatMessageType = {
      id: "msg-5",
      role: "assistant",
      content: "Server failed to respond.",
      timestamp: "",
      status: "error",
    };

    const { rerender } = render(<ChatMessage message={errorMessage} />);
    expect(screen.getByText("Error")).toBeInTheDocument();

    const stoppedMessage: ChatMessageType = {
      id: "msg-6",
      role: "assistant",
      content: "Generation was cut short.",
      timestamp: "",
      status: "stopped",
    };

    rerender(<ChatMessage message={stoppedMessage} />);
    expect(screen.getByText("Stopped")).toBeInTheDocument();
  });
});
