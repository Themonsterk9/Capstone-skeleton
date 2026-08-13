import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Reusable premium button component that automatically acts as a Next.js Link if `href` is provided.
 */
export default function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  href,
  onClick,
  disabled = false,
  type = "button",
  ...props
}) {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-bg-dark disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

  const variants = {
    primary: "bg-gradient-to-r from-secondary to-primary hover:from-secondary-hover hover:to-primary-hover text-white shadow-glow-primary hover:shadow-[0_0_30px_rgba(99,102,241,0.35)]",
    secondary: "glass-panel hover:bg-white/10 text-white border-white/10 hover:border-white/20",
    outline: "border border-white/20 hover:border-secondary text-white hover:text-secondary bg-transparent",
    ghost: "text-gray-400 hover:text-white hover:bg-white/5 bg-transparent",
  };

  const sizes = {
    sm: "px-3.5 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-base font-semibold",
  };

  const buttonClasses = cn(baseStyles, variants[variant], sizes[size], className);

  if (href) {
    return (
      <Link href={href} className={buttonClasses} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
