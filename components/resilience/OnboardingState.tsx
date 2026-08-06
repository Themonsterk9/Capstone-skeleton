"use client";

import React from "react";
import { motion } from "framer-motion";

interface OnboardingStateProps {
  onSelectPrompt: (promptText: string) => void;
  title?: string;
  description?: string;
  prompts?: string[];
}

const DEFAULT_PROMPTS = [
  "How do Star Alliance status levels map to Oneworld Emerald?",
  "Calculate status qualification for Delta Diamond Medallion.",
  "Run an SEO audit on https://example.com",
  "What are the lounge access rules for Star Alliance Gold?",
];

export default function OnboardingState({
  onSelectPrompt,
  title = "FlyRank AI Intelligence Console",
  description = "Ask anything about frequent flyer tiers, alliance matching, status run calculations, or airport lounge access policies.",
  prompts = DEFAULT_PROMPTS,
}: OnboardingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[55vh] text-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center max-w-2xl w-full"
      >
        {/* Animated illustration / icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-secondary/20 to-primary/20 border border-secondary/30 flex items-center justify-center text-cyan-400 mb-5 shadow-glow-secondary">
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8"
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
            />
          </motion.svg>
        </div>

        <h2 className="text-2xl font-bold font-display text-white mb-2 tracking-tight">
          {title}
        </h2>
        <p className="text-sm text-gray-400 max-w-md mb-8 leading-relaxed">
          {description}
        </p>

        {/* Quick action chips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          {prompts.map((promptText, idx) => (
            <button
              key={idx}
              onClick={() => onSelectPrompt(promptText)}
              className="p-3.5 rounded-xl glass-panel glass-panel-hover text-left text-xs text-gray-300 hover:text-white border border-white/10 hover:border-cyan-500/40 transition-all flex items-start gap-2.5 group"
            >
              <span className="text-cyan-400 font-mono text-[10px] shrink-0 mt-0.5">0{idx + 1}.</span>
              <span className="leading-relaxed group-hover:text-cyan-200">{promptText}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
