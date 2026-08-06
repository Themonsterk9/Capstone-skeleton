"use client";

import React from "react";
import { motion } from "framer-motion";

interface SEOScoreCardProps {
  score: number;
  url: string;
}

function getScoreColor(score: number): { ring: string; fill: string; text: string; badge: string } {
  if (score >= 80) return {
    ring: "stroke-emerald-400",
    fill: "from-emerald-500 to-teal-400",
    text: "text-emerald-400",
    badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25",
  };
  if (score >= 50) return {
    ring: "stroke-amber-400",
    fill: "from-amber-500 to-orange-400",
    text: "text-amber-400",
    badge: "bg-amber-500/15 text-amber-300 border-amber-500/25",
  };
  return {
    ring: "stroke-red-400",
    fill: "from-red-500 to-rose-400",
    text: "text-red-400",
    badge: "bg-red-500/15 text-red-300 border-red-500/25",
  };
}

function getScoreLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Needs Work";
  return "Poor";
}

export default function SEOScoreCard({ score, url }: SEOScoreCardProps) {
  const colors = getScoreColor(score);
  const label = getScoreLabel(score);

  // SVG arc parameters
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="rounded-2xl border border-white/8 bg-gradient-to-br from-slate-900/90 to-slate-800/60 backdrop-blur-md p-6 flex flex-col items-center gap-5"
      role="region"
      aria-label={`SEO Score: ${score} out of 100`}
    >
      {/* Domain Label */}
      <div className="text-center">
        <p className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold mb-1">Overall SEO Score</p>
        <p className="text-xs text-gray-400 truncate max-w-[20ch]" title={url}>
          {(() => { try { return new URL(url).hostname; } catch { return url; } })()}
        </p>
      </div>

      {/* Circular Score Arc */}
      <div className="relative w-36 h-36" role="img" aria-label={`Score: ${score}/100`}>
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          {/* Background track */}
          <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
          {/* Score arc */}
          <motion.circle
            cx="60" cy="60" r={radius}
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            className={colors.ring}
          />
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" className="score-stop-1" />
              <stop offset="100%" className="score-stop-2" />
            </linearGradient>
          </defs>
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={`text-4xl font-black tabular-nums ${colors.text}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            {score}
          </motion.span>
          <span className="text-[10px] text-gray-500 font-semibold">/100</span>
        </div>
      </div>

      {/* Status badge */}
      <div className="text-center space-y-2">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${colors.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full bg-current`} />
          {label}
        </span>
      </div>

      {/* Style injected for gradient colors */}
      <style>{`
        .score-stop-1 {
          stop-color: ${score >= 80 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444"};
        }
        .score-stop-2 {
          stop-color: ${score >= 80 ? "#14b8a6" : score >= 50 ? "#f97316" : "#f43f5e"};
        }
      `}</style>
    </motion.div>
  );
}
