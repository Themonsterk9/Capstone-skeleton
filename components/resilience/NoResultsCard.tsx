"use client";

import React from "react";
import { motion } from "framer-motion";

interface NoResultsCardProps {
  onSelectPrompt: (promptText: string) => void;
  examples?: string[];
}

const DEFAULT_EXAMPLES = [
  "How do Star Alliance status levels map to Oneworld Emerald?",
  "Calculate qualification requirements for Delta Diamond Medallion.",
  "Run an SEO audit on https://example.com",
];

export default function NoResultsCard({
  onSelectPrompt,
  examples = DEFAULT_EXAMPLES,
}: NoResultsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-2xl mx-auto my-4 p-6 rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-md text-center space-y-4 shadow-xl"
      role="region"
      aria-label="No relevant results found"
    >
      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-cyan-400">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </div>

      <div>
        <h4 className="text-base font-bold text-white">No Relevant Results Found</h4>
        <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">
          We couldn&apos;t match your query with relevant flight telemetry or status records. Try one of these suggestions:
        </p>
      </div>

      {/* 3 Clickable Example Chips */}
      <div className="space-y-2 pt-2 text-left">
        {examples.slice(0, 3).map((promptText, idx) => (
          <button
            key={idx}
            onClick={() => onSelectPrompt(promptText)}
            className="w-full p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-cyan-500/30 text-xs text-gray-300 hover:text-white transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-cyan-400 font-mono text-[10px]">•</span>
              <span className="group-hover:text-cyan-200">{promptText}</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 text-gray-500 group-hover:text-cyan-400 transition-colors">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
