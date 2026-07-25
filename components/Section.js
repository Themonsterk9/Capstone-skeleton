import React from "react";
import { cn } from "@/lib/utils";

/**
 * Standardized section wrapper for consistent vertical spacing and semantic html.
 */
export default function Section({
  children,
  className,
  id,
  variant = "default",
  ...props
}) {
  const backgrounds = {
    default: "",
    accent: "bg-[#0b0d18] border-y border-border-dark",
    gradient: "bg-gradient-to-b from-bg-dark to-[#0c0e1a]",
    glass: "glass-panel border-y border-border-dark",
  };

  return (
    <section
      id={id}
      className={cn("py-12 md:py-20 lg:py-28 relative overflow-hidden", backgrounds[variant], className)}
      {...props}
    >
      {children}
    </section>
  );
}
