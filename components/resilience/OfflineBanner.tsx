"use client";

import React from "react";
import { motion } from "framer-motion";

interface OfflineBannerProps {
  onRetry: () => void;
  isRetrying?: boolean;
}

export default function OfflineBanner({ onRetry, isRetrying = false }: OfflineBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto my-3 p-4 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/60 to-slate-900/90 backdrop-blur-md text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg shadow-amber-950/20"
      role="alert"
      aria-live="polite"
      aria-label="Offline network connection warning"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4 text-amber-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Network Disconnected</h4>
          <p className="text-xs text-amber-200/80 mt-0.5">
            You are currently offline. Check your internet connection and try again. Your input has been saved.
          </p>
        </div>
      </div>

      <button
        onClick={onRetry}
        disabled={isRetrying}
        className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-100 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 flex-shrink-0"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-3.5 h-3.5 ${isRetrying ? "animate-spin" : ""}`}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
        <span>{isRetrying ? "Retrying..." : "Retry Request"}</span>
      </button>
    </motion.div>
  );
}
