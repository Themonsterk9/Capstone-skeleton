import React from "react";
import { cn } from "@/lib/utils";

/**
 * Responsive container wrapper for consistent horizontal layout alignments.
 */
export default function Container({ children, className, clean = false, ...props }) {
  return (
    <div
      className={cn(
        "w-full mx-auto px-4 sm:px-6 lg:px-8",
        !clean && "max-w-7xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
