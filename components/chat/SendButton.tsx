"use client";

import React from "react";

interface SendButtonProps {
  disabled: boolean;
  onClick?: () => void;
}

export default function SendButton({ disabled, onClick }: SendButtonProps) {
  return (
    <button
      type="submit"
      onClick={onClick}
      disabled={disabled}
      aria-label="Send Message"
      className="inline-flex items-center justify-center p-2.5 rounded-lg bg-gradient-to-r from-secondary to-primary text-white shadow-glow-secondary hover:from-secondary-hover hover:to-primary-hover disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none focus:outline-none focus:ring-2 focus:ring-secondary active:scale-95 transition-all duration-200"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-5 h-5"
        width="20"
        height="20"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L6 12zm0 0h7.5"
        />
      </svg>
    </button>
  );
}
