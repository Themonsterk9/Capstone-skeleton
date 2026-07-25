import React from "react";
import { cn } from "@/lib/utils";

/**
 * Premium loading spinner component with customizable full-page or inline styling.
 */
export default function Loading({ className, fullPage = false, text = "Loading dashboard data...", ...props }) {
  const containerClasses = cn(
    "flex flex-col items-center justify-center gap-4 text-center p-8",
    fullPage && "fixed inset-0 bg-[#07080d] z-50",
    className
  );

  return (
    <div className={containerClasses} {...props}>
      <div className="relative flex items-center justify-center">
        {/* Glow behind the spinner */}
        <div className="absolute inset-0 rounded-full bg-secondary/20 blur-md animate-pulse" />
        
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-white/5 border-t-secondary rounded-full animate-spin relative z-10" />
      </div>
      {text && (
        <p className="text-sm font-medium tracking-wide text-text-secondary animate-pulse mt-2">
          {text}
        </p>
      )}
    </div>
  );
}
