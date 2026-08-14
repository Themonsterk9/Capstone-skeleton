"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Container from "@/components/Container";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    console.error("[FlyRank Route Error Boundary]", error);
  }, [error]);

  const sanitizedMessage = error?.message
    ? error.message.replace(/at\s+\w+[\s\S]*$/m, "").trim().slice(0, 250)
    : "An unexpected application error occurred.";

  return (
    <div className="flex-1 flex flex-col justify-center items-center py-16 px-4 bg-bg-dark text-text-primary">
      <Container className="max-w-xl text-center">
        {/* Glow backdrop */}
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto mb-6 shadow-lg shadow-red-950/40">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold font-display text-white tracking-tight mb-3">
          Something went wrong
        </h1>
        <p className="text-sm text-gray-300 leading-relaxed max-w-md mx-auto mb-6">
          We encountered an issue while processing this page. Don&apos;t worry — your data and active flight logs remain secure.
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-secondary to-primary text-white text-xs font-bold shadow-lg shadow-secondary/20 hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Try Again
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-semibold transition-colors"
          >
            Return Home
          </Link>
        </div>

        {/* Collapsible Technical Details (No stack traces) */}
        <div className="text-left rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-between text-xs font-medium text-gray-400 hover:text-white"
          >
            <span>Technical Details</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className={`w-4 h-4 transition-transform ${showDetails ? "rotate-180" : ""}`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>

          {showDetails && (
            <div className="pt-2 text-xs text-gray-400 font-mono space-y-1 border-t border-white/5">
              <p><span className="text-gray-500">Summary:</span> {sanitizedMessage}</p>
              {error?.digest && <p><span className="text-gray-500">Digest:</span> {error.digest}</p>}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
