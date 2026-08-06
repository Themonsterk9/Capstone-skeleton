"use client";

import React from "react";
import { motion } from "framer-motion";

interface ToolErrorCardProps {
  toolName: string;
  errorMessage: string;
  onRetry?: () => void;
}

const TOOL_DISPLAY_NAMES: Record<string, string> = {
  seoAudit: "SEO Audit",
};

export default function ToolErrorCard({ toolName, errorMessage, onRetry }: ToolErrorCardProps) {
  const displayName = TOOL_DISPLAY_NAMES[toolName] ?? toolName;

  // Sanitize error message — never show stack traces
  const safeMessage = errorMessage
    .replace(/at\s+\w+[\s\S]*$/m, "") // strip stack traces
    .replace(/Error:\s*/i, "")
    .trim()
    .slice(0, 300);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full max-w-2xl rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-950/40 to-slate-900/80 backdrop-blur-md overflow-hidden shadow-xl shadow-red-900/10"
      role="alert"
      aria-live="assertive"
      aria-label={`Tool error: ${displayName}`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-red-500/10 bg-red-500/5">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center flex-shrink-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4.5 h-4.5 text-red-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </motion.div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">Tool Execution Failed</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/15 text-red-300 border border-red-500/20 font-mono">
              {toolName}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{displayName} encountered an error</p>
        </div>
      </div>

      {/* Error Body */}
      <div className="p-5 space-y-4">
        <div className="rounded-xl bg-red-500/5 border border-red-500/15 p-4">
          <p className="text-[11px] font-semibold text-red-300 uppercase tracking-wider mb-2">What went wrong</p>
          <p className="text-sm text-gray-300 leading-relaxed">
            {safeMessage || "An unexpected error occurred while running the tool. Please check your input and try again."}
          </p>
        </div>

        {/* Troubleshooting tips */}
        <div className="space-y-2">
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Possible Causes</p>
          <ul className="space-y-1.5">
            {["The URL may be malformed or unreachable", "The website may block automated requests", "A network timeout may have occurred"].map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-400">
                <span className="text-red-400 mt-0.5 flex-shrink-0">·</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Retry button */}
        {onRetry && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRetry}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/25 text-red-300 hover:text-red-200 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/40"
            aria-label="Retry the failed tool call"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Retry Analysis
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
