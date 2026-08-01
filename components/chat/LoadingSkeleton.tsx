"use client";

import React from "react";

export default function LoadingSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 py-8 px-4 animate-pulse">
      {/* User Bubble Skeleton */}
      <div className="flex justify-end gap-3">
        <div className="w-2/3 h-16 rounded-2xl bg-white/5 border border-white/10" />
        <div className="w-8 h-8 rounded-full bg-white/10 shrink-0" />
      </div>

      {/* Assistant Bubble Skeleton */}
      <div className="flex justify-start gap-3">
        <div className="w-8 h-8 rounded-full bg-cyan-500/20 shrink-0" />
        <div className="w-3/4 space-y-3 p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="w-1/3 h-4 rounded bg-white/10" />
          <div className="w-full h-3 rounded bg-white/5" />
          <div className="w-4/5 h-3 rounded bg-white/5" />
        </div>
      </div>
    </div>
  );
}
