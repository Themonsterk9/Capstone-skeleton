"use client";

import React, { useState, useRef } from "react";
import PageHeader from "@/components/PageHeader";
import Container from "@/components/Container";
import Section from "@/components/Section";
import Card from "@/components/Card";
import Button from "@/components/Button";
import AnimatedStatefulButton from "@/components/AnimatedStatefulButton";

export default function ButtonDemo() {
  // Real-time state tracking for both button instances
  const [button1State, setButton1State] = useState("idle");
  const [button2State, setButton2State] = useState("idle");

  // Disabled state checkbox
  const [buttonsDisabled, setButtonsDisabled] = useState(false);

  // Refs for calling imperative controls
  const button1Ref = useRef(null);
  const button2Ref = useRef(null);

  // Stats / Telemetry counters for the fake async operations
  const [attempts, setAttempts] = useState(0);
  const [successes, setSuccesses] = useState(0);
  const [failures, setFailures] = useState(0);

  // Fake async operation with a 20% failure probability and 1-3 seconds delay
  const handleFakeAsyncClick = async () => {
    setAttempts((prev) => prev + 1);

    // Random delay between 1000ms and 3000ms
    const randomDelay = Math.floor(Math.random() * 2000) + 1000;
    await new Promise((resolve) => setTimeout(resolve, randomDelay));

    // 20% failure rate
    const isFailure = Math.random() < 0.2;

    if (isFailure) {
      setFailures((prev) => prev + 1);
      throw new Error("Fake server communication error.");
    } else {
      setSuccesses((prev) => prev + 1);
      return { success: true };
    }
  };

  // Fake async operation for the secondary button (reusability demo)
  const handleSecondaryClick = async () => {
    // Shorter random delay, 10% failure rate
    const randomDelay = Math.floor(Math.random() * 1000) + 1000;
    await new Promise((resolve) => setTimeout(resolve, randomDelay));

    const isFailure = Math.random() < 0.1;
    if (isFailure) {
      throw new Error("Upgrade failed.");
    } else {
      return { upgraded: true };
    }
  };

  // Imperative force control triggers
  const handleForceSuccess = () => {
    if (button1Ref.current) {
      button1Ref.current.triggerSuccess(1500);
    }
  };

  const handleForceError = () => {
    if (button1Ref.current) {
      button1Ref.current.triggerError(1500);
    }
  };

  const handleReset = () => {
    if (button1Ref.current) button1Ref.current.reset();
    if (button2Ref.current) button2Ref.current.reset();
  };

  return (
    <div className="flex-grow flex flex-col relative overflow-hidden bg-bg-dark text-text-primary">
      {/* Decorative ambient background glows */}
      <div className="glow-backdrop-cyan top-[15%] left-[-5%] animate-pulse-slow" />
      <div className="glow-backdrop-indigo top-[50%] right-[-5%] animate-pulse-slow" />

      <PageHeader
        title="Stateful Motion Demo"
        subtitle="Animated Stateful Button"
        description="Explore an implementation of interactive, state-communicating, accessible button components designed for the FlyRank AI Capstone."
      />

      <Section>
        <Container>
          <h2 className="sr-only">Interactive Button Demos & Specifications</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Column 1 & 2: Interactive Playground */}
            <div className="lg:col-span-2 space-y-6">
              {/* Primary Demo Card */}
              <Card
                title="AI Chat Send Message Button"
                subtitle="Primary Assignment Component"
                hoverable={false}
              >
                <div className="p-6 bg-white/5 rounded-xl border border-white/5 space-y-6 flex flex-col items-center justify-center min-h-[220px]">
                  <AnimatedStatefulButton
                    ref={button1Ref}
                    onClick={handleFakeAsyncClick}
                    disabled={buttonsDisabled}
                    onStateChange={setButton1State}
                    idleLabel="Send Message"
                    loadingLabel="Sending Message..."
                    successLabel="Sent Successfully"
                    errorLabel="Send Failed / Retry"
                    className="w-full sm:w-auto sm:min-w-[240px]"
                  />

                  {/* Inline State Display Indicator */}
                  <div className="flex items-center gap-3 text-xs bg-bg-dark/80 px-4 py-2 rounded-full border border-white/5 shadow-inner">
                    <span className="text-gray-400 font-medium">Button State:</span>
                    <span
                      className={`font-mono font-bold uppercase tracking-wider ${
                        button1State === "idle"
                          ? "text-cyan-400 animate-pulse"
                          : button1State === "loading"
                          ? "text-yellow-400 animate-pulse"
                          : button1State === "success"
                          ? "text-emerald-400"
                          : "text-red-400 animate-bounce"
                      }`}
                    >
                      {button1State}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Reusable Demo Card */}
              <Card
                title="Secondary Reusable Button"
                subtitle="Demonstrating Reusability for Alternate Actions"
                hoverable={false}
              >
                <div className="p-6 bg-white/5 rounded-xl border border-white/5 space-y-6 flex flex-col items-center justify-center min-h-[200px]">
                  <AnimatedStatefulButton
                    ref={button2Ref}
                    onClick={handleSecondaryClick}
                    disabled={buttonsDisabled}
                    onStateChange={setButton2State}
                    idleLabel="Upgrade Flyer Status"
                    loadingLabel="Processing Upgrade..."
                    successLabel="Upgrade Confirmed"
                    errorLabel="Upgrade Failed / Retry"
                    variant="secondary"
                    className="w-full sm:w-auto sm:min-w-[240px]"
                  />

                  {/* Inline State Display Indicator */}
                  <div className="flex items-center gap-3 text-xs bg-bg-dark/80 px-4 py-2 rounded-full border border-white/5 shadow-inner">
                    <span className="text-gray-400 font-medium">Button State:</span>
                    <span
                      className={`font-mono font-bold uppercase tracking-wider ${
                        button2State === "idle"
                          ? "text-gray-400"
                          : button2State === "loading"
                          ? "text-yellow-400 animate-pulse"
                          : button2State === "success"
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {button2State}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Technical Specifications Section */}
              <Card title="Motion Design & Rationale" hoverable={false}>
                <div className="space-y-4 text-sm text-text-secondary leading-relaxed">
                  <p>
                    Aesthetics are secondary to clarity. Every animation in these buttons is designed to
                    communicate state transition and ensure the user understands what the system is doing.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                      <h4 className="font-bold text-white font-display text-xs uppercase tracking-wider">
                        Hover & Press (100–150ms)
                      </h4>
                      <p className="text-xs">
                        Short interactions use snappy responses to feel highly tactile. Scale changes are
                        confined to a safe threshold (1.02x on hover, 0.97x on press) to keep buttons responsive
                        without causing visual fatigue.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-bold text-white font-display text-xs uppercase tracking-wider">
                        Loading & Results (200–450ms)
                      </h4>
                      <p className="text-xs">
                        Spinners, checkmarks, and alerts use smooth transitions so state updates are clearly
                        perceptible. Background overlay opacities are transitioned to achieve a premium cross-fade.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-bold text-white font-display text-xs uppercase tracking-wider">
                        Compositor-Friendly Rendering
                      </h4>
                      <p className="text-xs">
                        Animations are bound to <code>transform</code> and <code>opacity</code>. By avoiding layout-heavy CSS
                        properties (like height, width, or margin animations), we guarantee 60 FPS transitions and prevent layout thrashing.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-bold text-white font-display text-xs uppercase tracking-wider">
                        Accessibility & Reduced Motion
                      </h4>
                      <p className="text-xs">
                        Fully complies with <code>prefers-reduced-motion</code>. When enabled, all scaling, sliding, and error-shake animations are skipped, transitioning only the colors and opacities instantly.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Column 3: Controls and Telemetry */}
            <div className="space-y-6">
              {/* Force Controls Card */}
              <Card title="Reviewer Force Controls" subtitle="Mandatory Testing Tools" hoverable={false}>
                <div className="space-y-4">
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Reviewers can trigger success and error states on demand to inspect the custom transitions.
                    These controls invoke the exact same state choreography as clicking the button.
                  </p>

                  <div className="flex flex-col gap-3 pt-2">
                    <Button
                      onClick={handleForceSuccess}
                      variant="primary"
                      className="w-full text-xs font-semibold"
                      disabled={button1State !== "idle" && button1State !== "error"}
                    >
                      Force Success
                    </Button>
                    <Button
                      onClick={handleForceError}
                      variant="outline"
                      className="w-full text-xs font-semibold hover:border-red-500/50 hover:text-red-400"
                      disabled={button1State !== "idle" && button1State !== "error"}
                    >
                      Force Error
                    </Button>
                    <Button
                      onClick={handleReset}
                      variant="secondary"
                      className="w-full text-xs font-semibold"
                    >
                      Reset State to Idle
                    </Button>
                  </div>

                  <div className="border-t border-white/5 pt-4">
                    <label className="flex items-center gap-3 cursor-pointer text-xs text-white">
                      <input
                        type="checkbox"
                        checked={buttonsDisabled}
                        onChange={(e) => setButtonsDisabled(e.target.checked)}
                        className="rounded border-white/10 bg-bg-dark text-primary focus:ring-secondary w-4 h-4"
                      />
                      <span>Toggle Disabled State</span>
                    </label>
                  </div>
                </div>
              </Card>

              {/* Simulation Telemetry Card */}
              <Card title="Simulation Telemetry" subtitle="Live Session Metrics" hoverable={false}>
                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-gray-400">Total Attempts:</span>
                    <span className="text-white font-bold">{attempts}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-emerald-400">Successful Sends:</span>
                    <span className="text-emerald-400 font-bold">{successes}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-red-400">Failed / Blocked:</span>
                    <span className="text-red-400 font-bold">{failures}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-gray-400">Target Failure Rate:</span>
                    <span className="text-cyan-400 font-bold">20.0%</span>
                  </div>
                  {attempts > 0 && (
                    <div className="flex justify-between pt-2 border-t border-white/5 text-[11px] text-gray-500">
                      <span>Realized Failure Rate:</span>
                      <span>{((failures / attempts) * 100).toFixed(1)}%</span>
                    </div>
                  )}
                </div>
              </Card>

              {/* Accessibility Verification */}
              <Card title="A11y Verification checklist" hoverable={false}>
                <ul className="text-xs text-text-secondary space-y-2 list-disc pl-4">
                  <li>
                    <span className="text-white font-semibold">Keyboard Tab:</span> Focus outlines are custom
                    rings matching FlyRank themes.
                  </li>
                  <li>
                    <span className="text-white font-semibold">Enter / Space:</span> Triggers action using
                    native button listeners.
                  </li>
                  <li>
                    <span className="text-white font-semibold">Aria Announcements:</span> Employs{" "}
                    <code>aria-live=&quot;assertive&quot;</code> and <code>aria-busy</code> to communicate server telemetry
                    to screen readers.
                  </li>
                  <li>
                    <span className="text-white font-semibold">Contrast ratio:</span> Text contrast meets or
                    exceeds WCAG AA standards.
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
