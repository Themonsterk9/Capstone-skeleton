"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChatMessage } from "@/types/chat";
import TypingIndicator from "./TypingIndicator";
import StreamingCursor from "./StreamingCursor";
import { sanitizeStreamingMarkdown } from "@/utils/markdown";

interface AssistantBubbleProps {
  message: ChatMessage;
  isStreamingMessage?: boolean;
}

export default function AssistantBubble({ message, isStreamingMessage = false }: AssistantBubbleProps) {
  const [copied, setCopied] = useState(false);

  const formattedTime = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";

  const isThinking = message.status === "thinking";
  const isStreaming = message.status === "streaming" || isStreamingMessage;
  const isStopped = message.status === "stopped";
  const isError = message.status === "error";

  const displayMarkdown = sanitizeStreamingMarkdown(message.content, isStreaming);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex justify-start gap-3 my-4 group">
      <div className="w-8 h-8 rounded-full bg-slate-900 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-black text-xs shrink-0 shadow-glow-secondary mt-5">
        AI
      </div>

      <div className="flex flex-col items-start max-w-[90%] sm:max-w-[85%]">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-white tracking-wide">FlyRank AI</span>
          {formattedTime && <span suppressHydrationWarning className="text-[11px] text-gray-400 font-mono">{formattedTime}</span>}
          {isStopped && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Stopped
            </span>
          )}
          {isError && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
              Error
            </span>
          )}
        </div>

        <div className="relative w-full px-5 py-4 rounded-2xl rounded-tl-none glass-panel border border-white/10 text-text-primary text-sm shadow-xl leading-relaxed">
          {/* Thinking indicator state */}
          {isThinking && !message.content ? (
            <TypingIndicator />
          ) : (
            <div className="prose prose-invert max-w-none space-y-3 text-sm font-sans">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-3 rounded-lg border border-white/10">
                      <table className="min-w-full divide-y divide-white/10 text-xs text-left">
                        {children}
                      </table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="px-3 py-2 bg-white/10 font-bold text-cyan-300">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="px-3 py-2 border-t border-white/5 text-gray-300">
                      {children}
                    </td>
                  ),
                  code: ({ className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || "");
                    const isInline = !match;
                    if (isInline) {
                      return (
                        <code className="px-1.5 py-0.5 rounded bg-white/10 text-cyan-300 font-mono text-xs" {...props}>
                          {children}
                        </code>
                      );
                    }
                    return (
                      <div className="my-3 rounded-lg border border-white/10 bg-[#060812] overflow-hidden text-xs">
                        <div className="flex items-center justify-between px-3 py-1.5 bg-white/5 border-b border-white/10 text-[11px] text-gray-400 font-mono">
                          <span>{match[1]}</span>
                          <button
                            onClick={() => navigator.clipboard.writeText(String(children))}
                            className="hover:text-white transition-colors"
                          >
                            Copy code
                          </button>
                        </div>
                        <pre className="p-3 overflow-x-auto font-mono text-gray-200 leading-relaxed">
                          <code>{children}</code>
                        </pre>
                      </div>
                    );
                  },
                  ul: ({ children }) => <ul className="list-disc pl-5 space-y-1 my-2">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-5 space-y-1 my-2">{children}</ol>,
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:underline underline-offset-2"
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {displayMarkdown}
              </ReactMarkdown>

              {/* Streaming Cursor attached to text end */}
              {isStreaming && <StreamingCursor />}
            </div>
          )}

          {/* Copy Message Action button */}
          {message.content && !isStreaming && (
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleCopy}
                className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white text-xs transition-colors"
                title="Copy message"
              >
                {copied ? "✓ Copied" : "Copy"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
