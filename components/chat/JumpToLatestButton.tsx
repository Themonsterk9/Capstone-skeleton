"use client";

import React from "react";

interface JumpToLatestButtonProps {
  onClick: () => void;
  visible: boolean;
}

export default function JumpToLatestButton({ onClick, visible }: JumpToLatestButtonProps) {
  if (!visible) return null;

  return (
    <div className="absolute bottom-24 right-6 z-30 transition-all duration-300 animate-in fade-in slide-in-from-bottom-3">
      <button
        onClick={onClick}
        type="button"
        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900/90 border border-cyan-500/40 rounded-full shadow-lg shadow-cyan-900/40 hover:bg-slate-800 hover:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 backdrop-blur-md active:scale-95 transition-all"
        aria-label="Scroll to latest messages"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="w-4 h-4 text-cyan-400 animate-bounce"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
        </svg>
        <span>Jump to latest</span>
      </button>
    </div>
  );
}
