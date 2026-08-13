"use client";

import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useRef,
  useEffect,
} from "react";
import { motion, AnimatePresence, useReducedMotion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export type ButtonState = "idle" | "loading" | "success" | "error";

export interface AnimatedStatefulButtonProps
  extends HTMLMotionProps<"button"> {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => Promise<any> | any;
  onStateChange?: (state: ButtonState) => void;
  idleLabel?: string;
  loadingLabel?: string;
  successLabel?: string;
  errorLabel?: string;
  successDuration?: number;
  errorDuration?: number;
  variant?: "primary" | "secondary";
  className?: string;
}

export interface AnimatedStatefulButtonRef {
  triggerSuccess: (delay?: number) => Promise<void>;
  triggerError: (delay?: number) => Promise<void>;
  reset: () => void;
  getState: () => ButtonState;
}

export const AnimatedStatefulButton = forwardRef<
  AnimatedStatefulButtonRef,
  AnimatedStatefulButtonProps
>(
  (
    {
      onClick,
      onStateChange,
      disabled = false,
      idleLabel = "Send Message",
      loadingLabel = "Sending...",
      successLabel = "Message Sent",
      errorLabel = "Error / Retry",
      successDuration = 2500,
      errorDuration = 3000,
      variant = "primary",
      className,
      type = "button",
      ...props
    },
    ref
  ) => {
    const [state, setState] = useState<ButtonState>("idle");
    const shouldReduceMotion = useReducedMotion();

    // Keep state ref updated to check current state in async callbacks
    const stateRef = useRef<ButtonState>("idle");
    useEffect(() => {
      stateRef.current = state;
      if (onStateChange) {
        onStateChange(state);
      }
    }, [state, onStateChange]);

    const successTimerRef = useRef<NodeJS.Timeout | null>(null);
    const errorTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Clean up timers on unmount
    useEffect(() => {
      return () => {
        if (successTimerRef.current) clearTimeout(successTimerRef.current);
        if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      };
    }, []);

    const resetTimers = () => {
      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current);
        successTimerRef.current = null;
      }
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
        errorTimerRef.current = null;
      }
    };

    // Main interaction handler
    const handleInteraction = async (e: React.MouseEvent<HTMLButtonElement>) => {
      // Spam clicking prevention: only allow clicking when idle or in error state
      if (disabled || (state !== "idle" && state !== "error")) {
        return;
      }

      resetTimers();
      setState("loading");

      if (onClick) {
        try {
          await onClick(e);
          setState("success");
          successTimerRef.current = setTimeout(() => {
            setState("idle");
          }, successDuration);
        } catch (err) {
          setState("error");
          errorTimerRef.current = setTimeout(() => {
            setState("idle");
          }, errorDuration);
        }
      } else {
        // Fallback if no onClick prop: default success behavior
        setState("success");
        successTimerRef.current = setTimeout(() => {
          setState("idle");
        }, successDuration);
      }
    };

    // Expose control API for Demo controls or parent components
    useImperativeHandle(ref, () => ({
      triggerSuccess: async (delay = 1500) => {
        if (stateRef.current !== "idle" && stateRef.current !== "error") return;
        resetTimers();
        setState("loading");
        await new Promise((resolve) => setTimeout(resolve, delay));
        setState("success");
        successTimerRef.current = setTimeout(() => {
          setState("idle");
        }, successDuration);
      },
      triggerError: async (delay = 1500) => {
        if (stateRef.current !== "idle" && stateRef.current !== "error") return;
        resetTimers();
        setState("loading");
        await new Promise((resolve) => setTimeout(resolve, delay));
        setState("error");
        errorTimerRef.current = setTimeout(() => {
          setState("idle");
        }, errorDuration);
      },
      reset: () => {
        resetTimers();
        setState("idle");
      },
      getState: () => stateRef.current,
    }));

    // Motion configuration values
    const hoverScale = shouldReduceMotion ? 1 : 1.02;
    const tapScale = shouldReduceMotion ? 1 : 0.97;

    // Background transition animations
    const bgVariants = {
      visible: { opacity: 1, transition: { duration: 0.25 } },
      hidden: { opacity: 0, transition: { duration: 0.25 } },
    };

    // Content fade/slide variants
    const contentVariants: any = {
      initial: { opacity: 0, y: shouldReduceMotion ? 0 : 8 },
      animate: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
      exit: { opacity: 0, y: shouldReduceMotion ? 0 : -8, transition: { duration: 0.15, ease: "easeIn" } },
    };

    // Error shake variants (bypassed if reduced motion is enabled)
    const shakeVariants: any = {
      idle: { x: 0 },
      loading: { x: 0 },
      success: { x: 0 },
      error: {
        x: shouldReduceMotion ? 0 : [0, -6, 6, -6, 6, -4, 4, 0],
        transition: {
          duration: 0.4,
          ease: "easeInOut",
        },
      },
    };

    // Base button classes
    const baseStyles =
      "relative overflow-hidden inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-dark select-none min-h-[44px] px-6 py-2.5 text-sm";

    const isInteractionDisabled = disabled || state === "loading" || state === "success";

    return (
      <motion.button
        type={type}
        onClick={handleInteraction}
        disabled={isInteractionDisabled}
        whileHover={isInteractionDisabled ? {} : { scale: hoverScale }}
        whileTap={isInteractionDisabled ? {} : { scale: tapScale }}
        animate={state}
        variants={shakeVariants}
        className={cn(
          baseStyles,
          state === "idle" && "text-white cursor-pointer",
          state === "loading" && "text-gray-400 cursor-wait",
          state === "success" && "text-white cursor-default",
          state === "error" && "text-white cursor-pointer",
          disabled && "opacity-40 cursor-not-allowed",
          className
        )}
        aria-live="assertive"
        aria-busy={state === "loading"}
        aria-label={
          state === "idle"
            ? idleLabel
            : state === "loading"
            ? loadingLabel
            : state === "success"
            ? successLabel
            : errorLabel
        }
        {...props}
      >
        {/* Background Layer Overlays for smooth cross-fading */}
        {/* 1. Idle Background (Cyan/Indigo neon gradient or Secondary outline) */}
        {variant === "primary" ? (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-secondary to-primary shadow-glow-primary z-0"
            animate={state === "idle" ? "visible" : "hidden"}
            variants={bgVariants}
            initial="visible"
          />
        ) : (
          <motion.div
            className="absolute inset-0 border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 z-0"
            animate={state === "idle" ? "visible" : "hidden"}
            variants={bgVariants}
            initial="visible"
          />
        )}

        {/* 2. Loading Background (Semi-transparent dark glass panel) */}
        <motion.div
          className="absolute inset-0 bg-[#0d101c]/90 border border-white/5 z-0"
          animate={state === "loading" ? "visible" : "hidden"}
          variants={bgVariants}
          initial="hidden"
        />

        {/* 3. Success Background (Emerald/Green neon gradient) */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-600 shadow-[0_0_25px_rgba(16,185,129,0.25)] z-0"
          animate={state === "success" ? "visible" : "hidden"}
          variants={bgVariants}
          initial="hidden"
        />

        {/* 4. Error Background (Amber/Red gradient) */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-amber-600 to-red-600 shadow-[0_0_25px_rgba(239,68,68,0.25)] z-0"
          animate={state === "error" ? "visible" : "hidden"}
          variants={bgVariants}
          initial="hidden"
        />

        {/* Text and Icon Content Layer */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          <AnimatePresence mode="wait">
            {state === "idle" && (
              <motion.span
                key="idle"
                variants={contentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex items-center gap-2"
              >
                <span>{idleLabel}</span>
                {/* Paper plane send icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.2}
                  stroke="currentColor"
                  className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L6 12zm0 0h7.5"
                  />
                </svg>
              </motion.span>
            )}

            {state === "loading" && (
              <motion.span
                key="loading"
                variants={contentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex items-center gap-2"
              >
                {/* Loader Spinner */}
                <svg
                  className="animate-spin h-4 w-4 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="3.5"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>{loadingLabel}</span>
              </motion.span>
            )}

            {state === "success" && (
              <motion.span
                key="success"
                variants={contentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex items-center gap-2"
              >
                {/* Checkmark icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={3}
                  stroke="currentColor"
                  className="w-4 h-4 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
                <span>{successLabel}</span>
              </motion.span>
            )}

            {state === "error" && (
              <motion.span
                key="error"
                variants={contentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex items-center gap-2"
              >
                {/* Warning icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.2}
                  stroke="currentColor"
                  className="w-4 h-4 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                  />
                </svg>
                <span>{errorLabel}</span>
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </motion.button>
    );
  }
);

AnimatedStatefulButton.displayName = "AnimatedStatefulButton";

export default AnimatedStatefulButton;
