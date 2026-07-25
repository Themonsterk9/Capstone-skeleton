import React from "react";
import Button from "./Button";
import { cn } from "@/lib/utils";

/**
 * Reusable empty state display for lists, tables, or filters with no results.
 */
export default function EmptyState({
  title = "No records found",
  description = "Get started by adding your first flight or configuring a ranking search.",
  actionText,
  onAction,
  className,
  ...props
}) {
  return (
    <div
      className={cn(
        "glass-panel rounded-xl p-8 md:p-12 text-center flex flex-col items-center justify-center max-w-xl mx-auto my-6 border border-dashed border-white/10",
        className
      )}
      {...props}
    >
      <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-5 text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8 opacity-70"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25-2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-white font-display tracking-tight mb-2">
        {title}
      </h3>
      <p className="text-sm text-text-secondary mb-6 max-w-sm leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <Button variant="secondary" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
}
