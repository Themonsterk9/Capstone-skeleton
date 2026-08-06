import React from "react";

export default function Loading() {
  return (
    <div className="flex-1 w-full h-[calc(100vh-4rem)] flex flex-col bg-bg-dark text-text-primary p-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/10" />
          <div className="space-y-1.5">
            <div className="w-32 h-4 rounded bg-white/10" />
            <div className="w-48 h-3 rounded bg-white/5" />
          </div>
        </div>
        <div className="w-20 h-8 rounded-lg bg-white/5" />
      </div>

      {/* Main layout skeleton */}
      <div className="flex-1 space-y-4 max-w-4xl mx-auto w-full">
        <div className="h-20 rounded-2xl bg-white/5 border border-white/5" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="h-44 rounded-2xl bg-white/5 border border-white/5" />
          <div className="sm:col-span-2 h-44 rounded-2xl bg-white/5 border border-white/5" />
        </div>
        <div className="h-32 rounded-2xl bg-white/5 border border-white/5" />
      </div>
    </div>
  );
}
