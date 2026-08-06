"use client";

import React from "react";
import { motion } from "framer-motion";
import { SEOAuditOutput } from "@/types/tools";

interface FindingsTableProps {
  imagesWithoutAlt: SEOAuditOutput["imagesWithoutAlt"];
  brokenLinks: SEOAuditOutput["brokenLinks"];
}

const statusCodeColors: Record<number, string> = {
  404: "bg-red-500/15 text-red-300 border-red-500/20",
  410: "bg-orange-500/15 text-orange-300 border-orange-500/20",
  500: "bg-rose-500/15 text-rose-300 border-rose-500/20",
  301: "bg-amber-500/15 text-amber-300 border-amber-500/20",
  302: "bg-amber-500/15 text-amber-300 border-amber-500/20",
};

function getStatusColor(code: number): string {
  return statusCodeColors[code] ?? "bg-gray-500/15 text-gray-300 border-gray-500/20";
}

export default function FindingsTable({ imagesWithoutAlt, brokenLinks }: FindingsTableProps) {
  return (
    <div className="space-y-4">
      {/* Images Without Alt */}
      <div className="rounded-2xl border border-white/8 bg-slate-900/60 backdrop-blur-md overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4 text-amber-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <span className="text-sm font-semibold text-white">Images Without Alt Text</span>
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${imagesWithoutAlt.length > 0 ? "bg-amber-500/15 text-amber-300 border-amber-500/20" : "bg-emerald-500/15 text-emerald-300 border-emerald-500/20"}`}>
            {imagesWithoutAlt.length} {imagesWithoutAlt.length === 1 ? "issue" : "issues"}
          </span>
        </div>

        {imagesWithoutAlt.length === 0 ? (
          <div className="flex items-center gap-2.5 px-5 py-4 text-sm text-emerald-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            All images have alt text — great accessibility!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="text-left px-5 py-2.5 font-semibold text-gray-400 uppercase tracking-wider">#</th>
                  <th className="text-left px-5 py-2.5 font-semibold text-gray-400 uppercase tracking-wider">Image Source</th>
                  <th className="text-left px-5 py-2.5 font-semibold text-gray-400 uppercase tracking-wider">Context</th>
                </tr>
              </thead>
              <tbody>
                {imagesWithoutAlt.map((img, idx) => (
                  <motion.tr
                    key={idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.08 }}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-3 text-gray-600 font-mono">{idx + 1}</td>
                    <td className="px-5 py-3">
                      <span className="text-amber-300/90 font-mono text-[11px] break-all">{img.src}</span>
                    </td>
                    <td className="px-5 py-3 text-gray-400">{img.context}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Broken Links */}
      <div className="rounded-2xl border border-white/8 bg-slate-900/60 backdrop-blur-md overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4 text-red-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
            </svg>
            <span className="text-sm font-semibold text-white">Broken Links</span>
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${brokenLinks.length > 0 ? "bg-red-500/15 text-red-300 border-red-500/20" : "bg-emerald-500/15 text-emerald-300 border-emerald-500/20"}`}>
            {brokenLinks.length} {brokenLinks.length === 1 ? "issue" : "issues"}
          </span>
        </div>

        {brokenLinks.length === 0 ? (
          <div className="flex items-center gap-2.5 px-5 py-4 text-sm text-emerald-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            No broken links detected — excellent link integrity!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="text-left px-5 py-2.5 font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-2.5 font-semibold text-gray-400 uppercase tracking-wider">URL</th>
                  <th className="text-left px-5 py-2.5 font-semibold text-gray-400 uppercase tracking-wider">Link Text</th>
                </tr>
              </thead>
              <tbody>
                {brokenLinks.map((link, idx) => (
                  <motion.tr
                    key={idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.08 }}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-mono font-bold border ${getStatusColor(link.statusCode)}`}>
                        {link.statusCode}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-red-300/80 font-mono text-[11px] break-all">{link.href}</span>
                    </td>
                    <td className="px-5 py-3 text-gray-400">{link.text}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
