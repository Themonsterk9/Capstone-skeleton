"use client";

import React from "react";

export default function StreamingCursor() {
  return (
    <span
      className="inline-block w-2 h-4 ml-1 translate-y-0.5 rounded-sm bg-gradient-to-t from-secondary to-primary shadow-[0_0_8px_rgba(6,182,212,0.8)] animate-pulse"
      aria-hidden="true"
    />
  );
}
