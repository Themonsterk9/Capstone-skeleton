"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SEOAuditOutput } from "@/types/tools";
import SEOScoreCard from "./SEOScoreCard";
import MetadataCard from "./MetadataCard";
import HeadingTree from "./HeadingTree";
import FindingsTable from "./FindingsTable";
import RecommendationCard from "./RecommendationCard";
import AuditSummary from "./AuditSummary";

interface SEOAuditResultProps {
  data: SEOAuditOutput;
}

export default function SEOAuditResult({ data }: SEOAuditResultProps) {
  const displayUrl = (() => {
    try {
      return new URL(data.url).hostname;
    } catch {
      return data.url;
    }
  })();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full max-w-3xl space-y-5"
        role="region"
        aria-label={`SEO Audit Results for ${displayUrl}`}
      >
        {/* Title bar */}
        <div className="flex items-center gap-3 rounded-2xl border border-cyan-500/15 bg-gradient-to-r from-cyan-950/60 to-indigo-950/40 px-5 py-4 backdrop-blur-md">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-white">SEO Audit Complete</h3>
            <p className="text-xs text-gray-400 truncate">{data.url}</p>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/20">
              seoAudit
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
              ✓ Complete
            </span>
          </div>
        </div>

        {/* Score + Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-1">
            <SEOScoreCard score={data.seoScore} url={data.url} />
          </div>
          <div className="sm:col-span-2">
            <AuditSummary data={data} />
          </div>
        </div>

        {/* Metadata */}
        <MetadataCard data={data} />

        {/* Heading Structure */}
        <HeadingTree headings={data.headings} />

        {/* Findings: Images + Broken Links */}
        <FindingsTable
          imagesWithoutAlt={data.imagesWithoutAlt}
          brokenLinks={data.brokenLinks}
        />

        {/* Recommendations */}
        <RecommendationCard recommendations={data.recommendations} />
      </motion.div>
    </AnimatePresence>
  );
}
