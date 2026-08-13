import React from "react";
import Link from "next/link";
import Container from "./Container";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border-dark bg-[#040509] py-12 md:py-16 text-text-secondary mt-auto relative z-10">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-12">
          {/* Brand block */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 group w-fit">
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
            <p className="text-sm leading-relaxed max-w-sm mb-6">
              Empowering frequent flyers and aviation analysts with state-of-the-art rank computations, flight tracking, and tier status optimizations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm font-display uppercase tracking-widest mb-4">
              Platform
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors duration-200">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-white transition-colors duration-200">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/health" className="hover:text-white transition-colors duration-200">
                  Health Check
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-bold text-sm font-display uppercase tracking-widest mb-4">
              Company
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors duration-200">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border-dark flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>&copy; {currentYear} FlyRank. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors duration-200">
              Terms of Service
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
