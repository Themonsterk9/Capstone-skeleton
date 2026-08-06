"use client";

import React from "react";
import { motion } from "framer-motion";
import { SEOAuditOutput } from "@/types/tools";

interface RecommendationCardProps {
  recommendations: SEOAuditOutput["recommendations"];
}

type Priority = SEOAuditOutput["recommendations"][number]["priority"];

const priorityConfig: Record<Priority, { label: string; color: string; bg: string; border: string; icon: string; order: number }> = {
  critical: {
    label: "Critical",
    color: "text-red-300",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    icon: "🔴",
    order: 0,
  },
  high: {
    label: "High",
    color: "text-orange-300",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    icon: "🟠",
    order: 1,
  },
  medium: {
    label: "Medium",
    color: "text-amber-300",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    icon: "🟡",
    order: 2,
  },
  low: {
    label: "Low",
    color: "text-blue-300",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    icon: "🔵",
    order: 3,
  },
};

export default function RecommendationCard({ recommendations }: RecommendationCardProps) {
  const sorted = [...recommendations].sort(
    (a, b) => priorityConfig[a.priority].order - priorityConfig[b.priority].order
  );

  const criticalCount = recommendations.filter((r) => r.priority === "critical").length;
  const highCount = recommendations.filter((r) => r.priority === "high").length;

  return (
    <div className="rounded-2xl border border-white/8 bg-slate-900/60 backdrop-blur-md overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-2.5">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4 text-emerald-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
          <span className="text-sm font-semibold text-white">Recommendations</span>
        </div>
        <div className="flex items-center gap-1.5">
          {criticalCount > 0 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/15 text-red-300 border border-red-500/20 font-semibold">
              {criticalCount} critical
            </span>
          )}
          {highCount > 0 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-300 border border-orange-500/20 font-semibold">
              {highCount} high
            </span>
          )}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {sorted.map((rec, idx) => {
          const config = priorityConfig[rec.priority];
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 + idx * 0.07, duration: 0.3 }}
              className={`rounded-xl border ${config.border} ${config.bg} p-4 space-y-2`}
            >
              <div className="flex items-start gap-3">
                <span className="text-[10px] mt-0.5" role="img" aria-label={config.label}>
                  {config.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${config.color}`}>
                      {config.label}
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium">·</span>
                    <span className="text-[10px] text-gray-400 font-medium">{rec.category}</span>
                  </div>
                  <p className="text-sm font-semibold text-white mt-1">{rec.title}</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed pl-5">{rec.description}</p>
            </motion.div>
          );
        })}

        {recommendations.length === 0 && (
          <div className="text-center py-8 text-sm text-emerald-400">
            🎉 No recommendations — this page is well optimized!
          </div>
        )}
      </div>
    </div>
  );
}
