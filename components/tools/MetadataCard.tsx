"use client";

import React from "react";
import { motion } from "framer-motion";
import { SEOAuditOutput } from "@/types/tools";

interface MetadataCardProps {
  data: Pick<SEOAuditOutput, "title" | "metaDescription" | "canonical" | "robots" | "language">;
}

interface MetaFieldProps {
  label: string;
  value: string;
  status?: "good" | "warning" | "error";
  maxLength?: number;
  index: number;
}

function MetaField({ label, value, status = "good", maxLength, index }: MetaFieldProps) {
  const isEmpty = !value;
  const isTooLong = maxLength ? value.length > maxLength : false;
  const effectiveStatus = isEmpty ? "error" : isTooLong ? "warning" : status;

  const statusColors = {
    good: "text-emerald-400",
    warning: "text-amber-400",
    error: "text-red-400",
  };

  const dotColors = {
    good: "bg-emerald-400",
    warning: "bg-amber-400",
    error: "bg-red-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 + index * 0.07, duration: 0.3 }}
      className="space-y-1.5"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${dotColors[effectiveStatus]} flex-shrink-0`} />
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{label}</span>
        </div>
        {maxLength && value && (
          <span className={`text-[10px] font-mono ${effectiveStatus === "warning" ? "text-amber-400" : "text-gray-600"}`}>
            {value.length}/{maxLength}
          </span>
        )}
      </div>
      <div className={`text-sm rounded-lg px-3 py-2 border ${isEmpty ? "border-red-500/15 bg-red-500/5 text-red-400 italic" : "border-white/5 bg-white/[0.03] text-gray-200"}`}>
        {isEmpty ? "Not set" : value}
      </div>
      {isTooLong && (
        <p className={`text-[10px] ${statusColors.warning}`}>
          ⚠ Exceeds recommended length of {maxLength} characters
        </p>
      )}
    </motion.div>
  );
}

export default function MetadataCard({ data }: MetadataCardProps) {
  return (
    <div className="rounded-2xl border border-white/8 bg-slate-900/60 backdrop-blur-md overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-white/5 bg-white/[0.02]">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4 text-indigo-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
        </svg>
        <span className="text-sm font-semibold text-white">Page Metadata</span>
      </div>

      <div className="p-5 space-y-4">
        <MetaField label="Title Tag" value={data.title} maxLength={60} index={0} />
        <MetaField label="Meta Description" value={data.metaDescription} maxLength={160} index={1} status={data.metaDescription ? "good" : "error"} />
        <MetaField label="Canonical URL" value={data.canonical} index={2} status={data.canonical ? "good" : "warning"} />
        <div className="grid grid-cols-2 gap-3">
          <MetaField label="Robots" value={data.robots} index={3} status={data.robots.includes("noindex") ? "warning" : "good"} />
          <MetaField label="Language" value={data.language} index={4} />
        </div>
      </div>
    </div>
  );
}
