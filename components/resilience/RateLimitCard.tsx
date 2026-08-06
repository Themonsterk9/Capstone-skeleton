"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface RateLimitCardProps {
  onRetry: () => void;
  isRetrying?: boolean;
  initialCountdownSeconds?: number;
}

export default function RateLimitCard({
  onRetry,
  isRetrying = false,
  initialCountdownSeconds = 10,
}: RateLimitCardProps) {
  const [countdown, setCountdown] = useState<number>(initialCountdownSeconds);

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const isReady = countdown === 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-2xl mx-auto my-3 p-5 rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-950/50 to-slate-900/90 backdrop-blur-md text-orange-200 space-y-4 shadow-xl shadow-orange-950/20"
      role="alert"
      aria-live="polite"
      aria-label="Rate limit reached warning"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center flex-shrink-0 text-orange-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-white">Rate Limit Reached (HTTP 429)</h4>
          <p className="text-xs text-orange-200/80 mt-1 leading-relaxed">
            You&apos;ve sent several requests in a short period. Please wait a moment before trying again.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-orange-500/15">
        <div className="text-xs text-orange-300/80 font-mono">
          {!isReady ? (
            <span>Cooldown: <strong className="text-white">{countdown}s</strong> remaining</span>
          ) : (
            <span className="text-emerald-400 font-semibold">✓ Ready to retry</span>
          )}
        </div>

        <button
          onClick={onRetry}
          disabled={!isReady || isRetrying}
          className="px-4 py-2 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-100 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-3.5 h-3.5 ${isRetrying ? "animate-spin" : ""}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          <span>{isRetrying ? "Retrying..." : "Retry Request"}</span>
        </button>
      </div>
    </motion.div>
  );
}
