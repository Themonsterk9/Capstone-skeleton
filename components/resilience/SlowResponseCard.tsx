"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function SlowResponseCard() {
  const [progress, setProgress] = useState<number>(15);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 92) return prev;
        return prev + Math.floor(Math.random() * 8 + 3);
      });
    }, 400);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto my-3 p-4 rounded-2xl border border-cyan-500/20 bg-slate-900/80 backdrop-blur-md space-y-3 shadow-lg shadow-cyan-950/20"
      role="status"
      aria-label="Still thinking, request processing"
    >
      <div className="flex items-center justify-between text-xs text-gray-300">
        <div className="flex items-center gap-2">
          <motion.div
            className="w-2 h-2 rounded-full bg-cyan-400"
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          <span className="font-semibold text-white">Still thinking...</span>
        </div>
        <span className="font-mono text-[11px] text-cyan-400">{progress}%</span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>

      {/* Layout-matching skeleton */}
      <div className="space-y-2 pt-1 animate-pulse">
        <div className="h-3 w-3/4 bg-white/10 rounded" />
        <div className="h-3 w-1/2 bg-white/5 rounded" />
      </div>
    </motion.div>
  );
}
