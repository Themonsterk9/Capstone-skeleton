"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface ApiErrorCardProps {
  statusCode?: number;
  errorMessage?: string;
  onRetry: () => void;
  isRetrying?: boolean;
}

export default function ApiErrorCard({
  statusCode = 500,
  errorMessage = "Server processing error",
  onRetry,
  isRetrying = false,
}: ApiErrorCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const safeDetails = errorMessage
    .replace(/at\s+\w+[\s\S]*$/m, "") // Strip stack traces
    .slice(0, 200);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto my-3 p-5 rounded-2xl border border-red-500/25 bg-gradient-to-br from-red-950/40 to-slate-900/90 backdrop-blur-md text-red-200 space-y-4 shadow-xl shadow-red-950/20"
      role="alert"
      aria-live="assertive"
      aria-label={`Server error HTTP ${statusCode}`}
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center flex-shrink-0 text-red-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-white">Service Temporarily Unavailable</h4>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
              HTTP {statusCode}
            </span>
          </div>
          <p className="text-xs text-red-200/80 mt-1 leading-relaxed">
            The server encountered an error while processing your request. Please try again. Your input is safe.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-red-500/15">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs text-red-300/70 hover:text-white flex items-center gap-1 font-mono transition-colors"
        >
          <span>{showDetails ? "Hide Diagnostics" : "Show Diagnostics"}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className={`w-3.5 h-3.5 transition-transform ${showDetails ? "rotate-180" : ""}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>

        <button
          onClick={onRetry}
          disabled={isRetrying}
          className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-100 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-40"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-3.5 h-3.5 ${isRetrying ? "animate-spin" : ""}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          <span>{isRetrying ? "Retrying..." : "Retry Request"}</span>
        </button>
      </div>

      {showDetails && (
        <div className="pt-2 text-[11px] font-mono text-red-300/80 bg-black/30 p-3 rounded-lg border border-red-500/20">
          <p><span className="text-gray-500">Status:</span> {statusCode}</p>
          <p><span className="text-gray-500">Details:</span> {safeDetails}</p>
        </div>
      )}
    </motion.div>
  );
}
