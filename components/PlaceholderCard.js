import React from "react";
import { cn } from "@/lib/utils";

/**
 * Reusable placeholder card with skeleton pulse animation.
 */
export default function PlaceholderCard({ className, lines = 3, ...props }) {
  return (
    <div
      className={cn(
        "glass-panel rounded-xl p-6 flex flex-col gap-4 animate-pulse",
        className
      )}
      {...props}
    >
      <div className="h-6 w-2/5 bg-white/10 rounded-md" />
      <div className="flex-1 flex flex-col gap-2.5">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-4 bg-white/5 rounded-md"
            style={{ width: `${100 - i * 15}%` }}
          />
        ))}
      </div>
      <div className="h-8 w-full bg-white/10 rounded-md mt-2" />
    </div>
  );
}
