import React from "react";
import { cn } from "@/lib/utils";

/**
 * Premium glassmorphic Card component with visual hover effects.
 */
export default function Card({
  children,
  className,
  title,
  subtitle,
  footer,
  hoverable = true,
  ...props
}) {
  return (
    <div
      className={cn(
        "glass-panel rounded-xl overflow-hidden p-6 flex flex-col",
        hoverable && "glass-panel-hover",
        className
      )}
      {...props}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-bold text-white font-display tracking-tight">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-xs text-text-secondary mt-1">
              {subtitle}
            </p>
          )}
        </div>
      )}
      
      <div className="flex-1 text-sm text-text-secondary">{children}</div>

      {footer && (
        <div className="mt-6 pt-4 border-t border-border-dark flex items-center justify-between text-xs text-text-secondary">
          {footer}
        </div>
      )}
    </div>
  );
}
