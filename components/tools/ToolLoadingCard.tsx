"use client";

import React from "react";
import { motion } from "framer-motion";

export default function ToolLoadingCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full max-w-2xl rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-md overflow-hidden shadow-xl shadow-cyan-500/5"
      role="status"
      aria-label="Analyzing website, please wait"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5 bg-white/[0.02]">
        <div className="relative flex-shrink-0">
          <motion.div
            className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center"
            animate={{ boxShadow: ["0 0 0px rgba(6,182,212,0.3)", "0 0 20px rgba(6,182,212,0.6)", "0 0 0px rgba(6,182,212,0.3)"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </motion.div>
          <motion.div
            className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-900"
            animate={{ backgroundColor: ["#06b6d4", "#6366f1", "#06b6d4"] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">SEO Audit</span>
            <motion.span
              className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/20"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block" />
              Analyzing…
            </motion.span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">Scanning website structure and SEO signals</p>
        </div>
        {/* Spinner */}
        <motion.div
          className="w-6 h-6 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 flex-shrink-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Animated skeleton body */}
      <div className="p-5 space-y-4">
        {/* Progress track */}
        <div>
          <div className="flex justify-between text-[11px] text-gray-500 mb-1.5">
            <span>Analyzing website…</span>
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Processing
            </motion.span>
          </div>
          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              style={{ width: "60%" }}
            />
          </div>
        </div>

        {/* Skeleton rows */}
        {[80, 60, 90, 50, 70].map((width, i) => (
          <motion.div
            key={i}
            className="h-3 rounded-lg bg-white/5"
            style={{ width: `${width}%` }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}

        {/* Sub-cards skeleton */}
        <div className="grid grid-cols-3 gap-3 pt-1">
          {["Metadata", "Performance", "Links"].map((label, i) => (
            <motion.div
              key={label}
              className="rounded-xl border border-white/5 bg-white/[0.03] p-3"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 1.4, repeat: Infinity, delay: 0.5 + i * 0.2 }}
            >
              <div className="h-2.5 rounded bg-white/10 mb-2" />
              <div className="h-6 rounded bg-white/5" />
              <p className="text-[10px] text-gray-600 mt-1.5">{label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
