"use client";

import React from "react";
import { motion } from "framer-motion";
import { SEOAuditOutput } from "@/types/tools";

interface AuditSummaryProps {
  data: SEOAuditOutput;
}

interface MetricProps {
  label: string;
  value: string | number;
  unit?: string;
  status: "good" | "warning" | "error";
  index: number;
}

function Metric({ label, value, unit, status, index }: MetricProps) {
  const colors = {
    good: { text: "text-emerald-400", bar: "bg-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/15" },
    warning: { text: "text-amber-400", bar: "bg-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/15" },
    error: { text: "text-red-400", bar: "bg-red-400", bg: "bg-red-500/10", border: "border-red-500/15" },
  };

  const c = colors[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.06, duration: 0.3 }}
      className={`rounded-xl border ${c.border} ${c.bg} p-3.5 space-y-1`}
    >
      <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className={`text-xl font-black tabular-nums ${c.text}`}>{value}</span>
        {unit && <span className="text-[10px] text-gray-500">{unit}</span>}
      </div>
    </motion.div>
  );
}

function PerformanceBar({ label, value, maxGood, maxOk, unit = "ms" }: {
  label: string;
  value: number;
  maxGood: number;
  maxOk: number;
  unit?: string;
}) {
  const status = value <= maxGood ? "good" : value <= maxOk ? "warning" : "error";
  const barColors = { good: "bg-emerald-400", warning: "bg-amber-400", error: "bg-red-400" };
  // Normalize to 0-100% for display, cap at 200% of maxOk = full bar
  const pct = Math.min((value / (maxOk * 2)) * 100, 100);

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-gray-400 font-medium">{label}</span>
        <span className={status === "good" ? "text-emerald-400" : status === "warning" ? "text-amber-400" : "text-red-400"}>
          {value.toLocaleString()}{unit}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${barColors[status]}`}
          initial={{ width: "0%" }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
        />
      </div>
    </div>
  );
}

export default function AuditSummary({ data }: AuditSummaryProps) {
  const { pageSpeedEstimate: ps, recommendations, imagesWithoutAlt, brokenLinks } = data;

  const criticalCount = recommendations.filter((r) => r.priority === "critical").length;
  const highCount = recommendations.filter((r) => r.priority === "high").length;

  return (
    <div className="space-y-4">
      {/* Summary Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Metric
          label="Broken Links"
          value={brokenLinks.length}
          status={brokenLinks.length === 0 ? "good" : "error"}
          index={0}
        />
        <Metric
          label="Missing Alt"
          value={imagesWithoutAlt.length}
          status={imagesWithoutAlt.length === 0 ? "good" : "warning"}
          index={1}
        />
        <Metric
          label="Critical Issues"
          value={criticalCount}
          status={criticalCount === 0 ? "good" : "error"}
          index={2}
        />
        <Metric
          label="High Priority"
          value={highCount}
          status={highCount === 0 ? "good" : "warning"}
          index={3}
        />
      </div>

      {/* Core Web Vitals */}
      <div className="rounded-2xl border border-white/8 bg-slate-900/60 backdrop-blur-md overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-white/5 bg-white/[0.02]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4 text-cyan-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
          </svg>
          <span className="text-sm font-semibold text-white">Core Web Vitals Estimate</span>
          <span className="text-[10px] text-gray-500 ml-auto">Simulated</span>
        </div>
        <div className="p-5 space-y-4">
          <PerformanceBar label="First Contentful Paint (FCP)" value={ps.fcp} maxGood={1800} maxOk={3000} />
          <PerformanceBar label="Largest Contentful Paint (LCP)" value={ps.lcp} maxGood={2500} maxOk={4000} />
          <PerformanceBar label="Time to First Byte (TTFB)" value={ps.ttfb} maxGood={800} maxOk={1800} />
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400 font-medium">Cumulative Layout Shift (CLS)</span>
              <span className={ps.cls <= 0.1 ? "text-emerald-400" : ps.cls <= 0.25 ? "text-amber-400" : "text-red-400"}>
                {ps.cls.toFixed(3)}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${ps.cls <= 0.1 ? "bg-emerald-400" : ps.cls <= 0.25 ? "bg-amber-400" : "bg-red-400"}`}
                initial={{ width: "0%" }}
                animate={{ width: `${Math.min((ps.cls / 0.5) * 100, 100)}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
