"use client";

import React from "react";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-[#07080d] text-white flex flex-col items-center justify-center min-h-screen p-4 font-sans">
        <div className="max-w-md w-full p-8 rounded-2xl bg-slate-900 border border-white/10 text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold font-display">System Recovery Required</h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            FlyRank AI encountered a critical error. Click below to reload the application console safely.
          </p>
          <button
            onClick={() => reset()}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors"
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
