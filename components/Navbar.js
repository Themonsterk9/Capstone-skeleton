"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Container from "./Container";
import Button from "./Button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/features", label: "Features" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/chat", label: "AI Chat" },
  { href: "/button-demo", label: "Button Demo", badge: "Demo" },
  { href: "/seo-audit", label: "SEO Audit", badge: "New" },
  { href: "/contact", label: "Contact" },
  { href: "/health", label: "Health" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border-dark bg-[#07080d]/80 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-secondary to-primary flex items-center justify-center shadow-glow-secondary group-hover:scale-105 transition-all duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5 text-white"
                  width="20"
                  height="20"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L6 12zm0 0h7.5"
                  />
                </svg>
              </div>
              <span className="font-display font-black text-xl tracking-tight text-white group-hover:text-secondary transition-colors duration-300">
                FLY<span className="text-secondary">RANK</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "text-sm font-medium transition-all duration-200 relative py-1.5 flex items-center gap-1.5",
                    isActive
                      ? "text-white"
                      : "text-gray-400 hover:text-white"
                  )}
                >
                  {link.label}
                  {link.badge && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-semibold leading-none">
                      {link.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-secondary to-primary rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Action */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="secondary" size="sm" href="/dashboard">
              Launch Console
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-none"
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">Toggle navigation menu</span>
              {mobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  width="24"
                  height="24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  width="24"
                  height="24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Menu Panel */}
      <nav
        aria-label="Mobile navigation"
        className={cn(
          "md:hidden transition-all duration-300 ease-in-out border-b border-border-dark bg-[#07080d]",
          mobileMenuOpen ? "max-h-screen opacity-100 py-4" : "max-h-0 opacity-0 overflow-hidden"
        )}
      >
        <Container className="flex flex-col gap-3">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-secondary/15 to-primary/10 text-white border-l-2 border-secondary"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-4 border-t border-border-dark flex flex-col gap-2">
            <Button
              variant="primary"
              size="sm"
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
            >
              Launch Console
            </Button>
          </div>
        </Container>
      </nav>
    </header>
  );
}
