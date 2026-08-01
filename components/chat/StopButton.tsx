"use client";

import React from "react";

interface StopButtonProps {
  onStop: () => void;
}

export default function StopButton({ onStop }: StopButtonProps) {
  return (
    <button
      type="button"
      onClick={onStop}
      aria-label="Stop Generating"
      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30 focus:outline-none focus:ring-2 focus:ring-red-400 active:scale-95 transition-all text-xs font-semibold"
    >
      <span className="w-2.5 h-2.5 rounded-sm bg-red-400 animate-pulse" />
      <span>Stop generating</span>
    </button>
  );
}
