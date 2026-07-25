import React from "react";
import Container from "./Container";
import { cn } from "@/lib/utils";

/**
 * Standardized header component for page heroes with gradient text.
 */
export default function PageHeader({
  title,
  subtitle,
  description,
  className,
  children,
  ...props
}) {
  return (
    <div className={cn("relative py-12 md:py-16 border-b border-border-dark bg-gradient-to-b from-[#0b0d18] to-transparent overflow-hidden", className)} {...props}>
      {/* Decorative backdrop glows */}
      <div className="glow-backdrop-cyan top-[-100px] left-[10%]" />
      <div className="glow-backdrop-indigo top-[-50px] right-[10%]" />

      <Container className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="max-w-3xl">
          {subtitle && (
            <span className="text-xs font-bold tracking-widest text-secondary uppercase block mb-2 font-display">
              {subtitle}
            </span>
          )}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight font-display">
            {title}
          </h1>
          {description && (
            <p className="text-base md:text-lg text-text-secondary mt-3 leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {children && <div className="flex items-center gap-3 shrink-0">{children}</div>}
      </Container>
    </div>
  );
}
