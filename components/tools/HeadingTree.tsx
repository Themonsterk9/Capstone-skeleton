"use client";

import React from "react";
import { motion } from "framer-motion";
import { SEOAuditOutput } from "@/types/tools";

interface HeadingTreeProps {
  headings: SEOAuditOutput["headings"];
}

const levelColors: Record<number, string> = {
  1: "text-cyan-400 font-bold",
  2: "text-indigo-300 font-semibold",
  3: "text-purple-300 font-medium",
  4: "text-gray-300",
  5: "text-gray-400 text-xs",
  6: "text-gray-500 text-xs",
};

const levelBars: Record<number, string> = {
  1: "bg-cyan-500",
  2: "bg-indigo-500",
  3: "bg-purple-500",
  4: "bg-gray-500",
  5: "bg-gray-600",
  6: "bg-gray-700",
};

const levelIndent: Record<number, string> = {
  1: "ml-0",
  2: "ml-4",
  3: "ml-8",
  4: "ml-12",
  5: "ml-16",
  6: "ml-20",
};

export default function HeadingTree({ headings }: HeadingTreeProps) {
  // Check for H1 issues
  const h1Count = headings.filter((h) => h.level === 1).length;
  const hasH1Issue = h1Count === 0 || h1Count > 1;

  return (
    <div className="rounded-2xl border border-white/8 bg-slate-900/60 backdrop-blur-md overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-2.5">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4 text-purple-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.242 5.992h12m-12 6.003H20.24m-12 5.999h12M4.117 7.495v-3.75H2.99m1.125 3.75H2.99m1.125 0H5.24m-1.92 2.577a1.125 1.125 0 113.45 0 1.125 1.125 0 01-3.45 0z" />
          </svg>
          <span className="text-sm font-semibold text-white">Heading Structure</span>
        </div>
        {hasH1Issue && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/15 text-red-300 border border-red-500/20">
            {h1Count === 0 ? "No H1 found" : `${h1Count} H1 tags`}
          </span>
        )}
      </div>

      <div className="p-5 space-y-2 max-h-64 overflow-y-auto">
        {headings.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">No headings detected</p>
        ) : (
          headings.map((heading, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 + idx * 0.05, duration: 0.25 }}
              className={`flex items-center gap-2.5 ${levelIndent[heading.level]}`}
            >
              <div className={`w-0.5 h-4 rounded-full ${levelBars[heading.level]} flex-shrink-0 opacity-70`} />
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-gray-500 flex-shrink-0`}>
                H{heading.level}
              </span>
              <span className={`text-sm truncate ${levelColors[heading.level]}`}>
                {heading.text}
              </span>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
