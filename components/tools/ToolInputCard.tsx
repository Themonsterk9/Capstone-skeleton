"use client";

import React from "react";
import { motion } from "framer-motion";

interface ToolInputCardProps {
  toolName: string;
  input: Record<string, string | undefined>;
}

const TOOL_DISPLAY_NAMES: Record<string, string> = {
  seoAudit: "SEO Audit",
};

const TOOL_ICONS: Record<string, React.ReactNode> = {
  seoAudit: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4 text-white">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  ),
};

export default function ToolInputCard({ toolName, input }: ToolInputCardProps) {
  const displayName = TOOL_DISPLAY_NAMES[toolName] ?? toolName;
  const icon = TOOL_ICONS[toolName];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full max-w-2xl rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-slate-900/80 to-indigo-950/40 backdrop-blur-md overflow-hidden shadow-lg"
      role="region"
      aria-label={`Tool selected: ${displayName}`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">Tool Selected</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 font-mono">
              {toolName}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{displayName} — preparing to execute</p>
        </div>
      </div>

      {/* Input fields */}
      <div className="p-5 space-y-3">
        <p className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold">Input Parameters</p>
        {Object.entries(input).map(([key, value]) => (
          <div key={key} className="flex items-start gap-3 rounded-xl bg-white/[0.03] border border-white/5 p-3">
            <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md flex-shrink-0 mt-0.5 border border-indigo-500/15">
              {key}
            </span>
            <span className="text-sm text-gray-200 break-all font-medium">{value ?? "—"}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
