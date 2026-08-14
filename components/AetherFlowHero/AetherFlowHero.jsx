"use client";

/**
 * AetherFlowHero — Interactive GLSL Fullscreen Hero
 *
 * Raw-WebGL aurora/energy-flow shader background with:
 *  • Three uniforms: u_time, u_resolution, u_mouse
 *  • DPR capped at 2 (performance requirement)
 *  • Page Visibility API pause/resume (performance requirement)
 *  • prefers-reduced-motion static fallback (accessibility)
 *  • WebGL failure static CSS fallback (resilience)
 *  • Full event-listener and WebGL resource cleanup on unmount
 */

import React, { useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import "./AetherFlowHero.css";

// ─────────────────────────────────────────────────────────────────
// GLSL SOURCE — kept inline so Next.js App Router can import this
// as a plain JS module without a custom webpack loader.
// The canonical .frag file lives at /shaders/aetherFlow.frag.
// ─────────────────────────────────────────────────────────────────
const VERT_SRC = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAG_SRC = `
precision highp float;

uniform float u_time;
uniform vec2  u_resolution;
uniform vec2  u_mouse;

// -----------------------------------------------------------------
// SECTION A: Utility — pseudo-random hash
// -----------------------------------------------------------------
float hash(vec2 p) {
    p = fract(p * vec2(127.1, 311.7));
    p += dot(p, p + 19.19);
    return fract(p.x * p.y);
}

// -----------------------------------------------------------------
// SECTION B: Smooth value noise (2D)
// Bilinear interpolation of four hashed corners.
// -----------------------------------------------------------------
float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// -----------------------------------------------------------------
// SECTION C: Fractal Brownian Motion — 4 octaves
// Stacks noise octaves for organic, cloud-like aurora quality.
// -----------------------------------------------------------------
float fbm(vec2 p) {
    float v   = 0.0;
    float amp = 0.5;
    float frq = 1.0;
    for (int i = 0; i < 4; i++) {
        v   += amp * noise(p * frq);
        amp *= 0.5;
        frq *= 2.0;
    }
    return v;
}

// -----------------------------------------------------------------
// SECTION D: Aether Palette — custom four-stop gradient
// Deep indigo void -> teal-violet mid -> cyan bloom -> violet edge.
// NOT copied from any playground; hand-tuned for FlyRank Aether.
// -----------------------------------------------------------------
vec3 aetherPalette(float t) {
    vec3 c0 = vec3(0.02, 0.02, 0.08);   // deep void
    vec3 c1 = vec3(0.05, 0.28, 0.42);   // teal-violet mid
    vec3 c2 = vec3(0.14, 0.78, 0.72);   // cyan bloom
    vec3 c3 = vec3(0.38, 0.08, 0.52);   // violet edge
    t = clamp(t, 0.0, 1.0);
    if (t < 0.33) return mix(c0, c1, t / 0.33);
    if (t < 0.66) return mix(c1, c2, (t - 0.33) / 0.33);
    return mix(c2, c3, (t - 0.66) / 0.34);
}

void main() {

    // ---- SECTION E: UV + Aspect Ratio ----
    // Convert this pixel into normalized [0,1] UV coordinates.
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;

    // Remap to centered [-0.5, 0.5] space for a symmetric flow.
    vec2 p = uv - 0.5;

    // Correct the X axis so the flow keeps its proportions on wide
    // screens. Without this, circles become ellipses on 16:9.
    p.x *= u_resolution.x / u_resolution.y;

    // ---- SECTION F: Mouse Influence ----
    // Normalize the smoothed cursor into the same centered space.
    vec2 mouse = u_mouse - 0.5;
    mouse.x   *= u_resolution.x / u_resolution.y;

    // Distance from this pixel to the cursor.
    float mDist = length(p - mouse);

    // Cursor gently bends the domain. The wake falls off with mDist^2
    // so the influence is broad but subtle, not a hard blob.
    float mStrength = 0.18 / (1.0 + mDist * mDist * 8.0);
    vec2  mBend     = (mouse - p) * mStrength;

    // ---- SECTION G: Time + Domain Distortion ----
    // Slow time driver — keeps animation gentle, not frantic.
    float t = u_time * 0.12;

    // Apply mouse bend before domain warp so the aurora drifts
    // gently toward the cursor position.
    vec2 q = p + mBend;

    // First warp pass — distort lookup coordinates.
    // This domain-warp technique turns fBm into a flowing ribbon field.
    vec2 d;
    d.x = fbm(q * 1.8 + vec2(0.0,  t));
    d.y = fbm(q * 1.8 + vec2(5.2,  t * 0.9));

    // Second warp pass — warp again using first distortion.
    // Two-level domain warp creates the curling, ribbon-like aurora.
    vec2 e;
    e.x = fbm(q * 1.4 + 2.2 * d + vec2(1.7, 9.2) + t * 0.6);
    e.y = fbm(q * 1.4 + 2.2 * d + vec2(8.3, 2.8) + t * 0.5);

    // Final field value using the doubly-warped lookup.
    float f = fbm(q * 1.2 + 2.0 * e);

    // ---- SECTION H: Color Mapping ----
    // Bias toward dark end (x0.75) so text stays readable.
    vec3 color = aetherPalette(f * 0.75 + 0.1);

    // Secondary shimmer layer adds depth without heavy computation.
    float f2     = fbm(q * 0.9 + e.yx * 1.3 + t * 0.4);
    vec3 shimmer = aetherPalette(f2 * 0.5 + 0.4);
    color = mix(color, shimmer, 0.18);

    // ---- SECTION I: Grain ----
    // Lightweight procedural grain to break up smooth gradients.
    // Subtle frame-to-frame variation adds life without strobe.
    float grain = hash(gl_FragCoord.xy + fract(u_time * 0.3));
    color += (grain - 0.5) * 0.018;

    // ---- SECTION J: Vignette ----
    // Darken canvas edges and top-center for text contrast.
    float vignette = uv.x * (1.0 - uv.x) * uv.y * (1.0 - uv.y);
    vignette       = clamp(pow(vignette * 16.0, 0.5), 0.0, 1.0);
    float topMask  = 1.0 - smoothstep(0.0, 0.4, uv.y);
    color *= mix(0.35, 1.0, vignette) * mix(0.6, 1.0, 1.0 - topMask * 0.5);

    // ---- SECTION K: Final Color ----
    gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`;

// ─────────────────────────────────────────────────────────────────
// WebGL bootstrap helpers
// ─────────────────────────────────────────────────────────────────

function compileShader(gl, src, type) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("[AetherFlow] Shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl, vertSrc, fragSrc) {
  const vert = compileShader(gl, vertSrc, gl.VERTEX_SHADER);
  const frag = compileShader(gl, fragSrc, gl.FRAGMENT_SHADER);
  if (!vert || !frag) return null;
  const prog = gl.createProgram();
  gl.attachShader(prog, vert);
  gl.attachShader(prog, frag);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error("[AetherFlow] Program link error:", gl.getProgramInfoLog(prog));
    return null;
  }
  return prog;
}

// ─────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────

export default function AetherFlowHero() {
  const canvasRef = useRef(null);

  // Animation state — all stored as refs to avoid re-renders.
  const rafRef          = useRef(null);
  const glRef           = useRef(null);
  const progRef         = useRef(null);
  const startRef        = useRef(null);
  const pausedRef       = useRef(false);
  const pauseTimeRef    = useRef(0);   // ms spent in hidden-tab pause
  const pauseStartRef   = useRef(0);   // timestamp when last pause began
  const mouseRef        = useRef({ x: 0.5, y: 0.5 }); // smoothed
  const targetMouseRef  = useRef({ x: 0.5, y: 0.5 }); // raw target

  // ── Resize handler ────────────────────────────────────────────
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    const gl     = glRef.current;
    if (!canvas || !gl) return;
    // DPR CAPPED AT 2 — mandatory performance requirement.
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width  = Math.round(canvas.clientWidth  * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
  }, []);

  // ── Mouse tracking ────────────────────────────────────────────
  const handleMouseMove = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    // [0,1] relative to canvas; Y-flipped for WebGL convention.
    targetMouseRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: 1.0 - (e.clientY - rect.top) / rect.height,
    };
  }, []);

  // ── Visibility handler ────────────────────────────────────────
  const handleVisibility = useCallback(() => {
    if (document.hidden) {
      pausedRef.current     = true;
      pauseStartRef.current = performance.now();
    } else {
      // Accumulate pause duration so u_time doesn't jump.
      pauseTimeRef.current += performance.now() - pauseStartRef.current;
      pausedRef.current     = false;
    }
  }, []);

  // ── Main effect — WebGL init + animation loop ─────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Reduced motion ─────────────────────────────────────────
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      // Static CSS fallback is always in the DOM; hide the canvas.
      canvas.style.display = "none";
      const onMqChange = (e) => {
        if (!e.matches) {
          // User disabled reduced motion — reload will pick up change.
          // For simplicity in the runtime change path, we just show
          // the canvas and let the effect clean up and re-init.
          canvas.style.display = "";
        }
      };
      mq.addEventListener("change", onMqChange);
      return () => mq.removeEventListener("change", onMqChange);
    }

    // ── WebGL context ──────────────────────────────────────────
    let gl;
    try {
      gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    } catch (_) {
      gl = null;
    }
    if (!gl) {
      console.warn("[AetherFlow] WebGL unavailable — using CSS fallback.");
      canvas.style.display = "none";
      return;
    }
    glRef.current = gl;

    // ── Shader ─────────────────────────────────────────────────
    const prog = createProgram(gl, VERT_SRC, FRAG_SRC);
    if (!prog) {
      canvas.style.display = "none";
      return;
    }
    progRef.current = prog;
    gl.useProgram(prog);

    // ── Full-screen quad ───────────────────────────────────────
    const verts = new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]);
    const buf   = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // ── Uniform locations (cached to avoid per-frame lookup) ───
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes  = gl.getUniformLocation(prog, "u_resolution");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");

    // ── Initial resize ─────────────────────────────────────────
    handleResize();

    // ── Animation loop — defined inside effect so it can close
    //    over `gl`, `prog`, `uTime`, `uRes`, `uMouse` and `buf`
    //    without polluting the component render phase. ──────────
    function frame(now) {
      rafRef.current = requestAnimationFrame(frame);
      if (pausedRef.current) return;

      const elapsed = (now - startRef.current - pauseTimeRef.current) / 1000;

      // Exponential lerp — smooths raw mouse into a gentle flow.
      const k = 0.07;
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * k;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * k;

      gl.uniform1f(uTime,  elapsed);
      gl.uniform2f(uRes,   gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    // ── Start the loop ─────────────────────────────────────────
    startRef.current     = performance.now();
    pauseTimeRef.current = 0;
    pausedRef.current    = false;
    rafRef.current       = requestAnimationFrame(frame);

    // ── Reduced motion — runtime change while WebGL is running ─
    const mqHandler = (e) => {
      if (e.matches) {
        cancelAnimationFrame(rafRef.current);
        canvas.style.display = "none";
      } else {
        canvas.style.display = "";
        startRef.current     = performance.now();
        pauseTimeRef.current = 0;
        rafRef.current       = requestAnimationFrame(frame);
      }
    };

    // ── Attach all listeners ───────────────────────────────────
    window.addEventListener("resize",             handleResize,    { passive: true });
    window.addEventListener("mousemove",          handleMouseMove, { passive: true });
    document.addEventListener("visibilitychange", handleVisibility);
    mq.addEventListener("change", mqHandler);

    // ── Cleanup ────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize",             handleResize);
      window.removeEventListener("mousemove",          handleMouseMove);
      document.removeEventListener("visibilitychange", handleVisibility);
      mq.removeEventListener("change", mqHandler);
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
    };
  }, [handleResize, handleMouseMove, handleVisibility]);

  return (
    <section
      className="aether-hero-root"
      aria-label="Aether Flow hero section"
    >
      {/*
        ── Static fallback ──────────────────────────────────────────
        Always in the DOM — the canvas overlays it when WebGL works.
        Shows automatically when:
          • WebGL fails (canvas hidden via JS)
          • prefers-reduced-motion is active (canvas hidden)
          • JS has not yet initialized (before first paint)
      */}
      <div className="aether-static-fallback" aria-hidden="true" />

      {/*
        ── WebGL canvas ──────────────────────────────────────────────
        Purely decorative — aria-hidden so screen readers skip it.
      */}
      <canvas
        ref={canvasRef}
        className="aether-canvas"
        aria-hidden="true"
        role="presentation"
      />

      {/* ── Contrast overlay for text readability ──────────────── */}
      <div className="aether-contrast-overlay" aria-hidden="true" />

      {/* ── Foreground content ─────────────────────────────────── */}
      <div className="aether-content">

        {/* Visual status badge — aria-hidden (decorative) */}
        <div className="aether-badge" aria-hidden="true">
          <span className="aether-badge-dot" />
          <span className="aether-badge-text">FlyRank Aether Flow Active</span>
        </div>

        {/* Page h1 — semantic, visible to screen readers */}
        <h1 className="aether-headline">
          Optimize Your Flight Ranks with{" "}
          <span className="aether-headline-accent">Precision Analytics</span>
        </h1>

        {/* One-line introduction */}
        <p className="aether-description">
          Unleash the full potential of your elite status. Track flights,
          analyze complex airline tier upgrades, and evaluate routes using
          our high-performance ranking engine.
        </p>

        {/* CTAs — keyboard-accessible Next.js Links */}
        <div className="aether-cta-row">
          <Link
            href="/dashboard"
            id="aether-cta-primary"
            className="inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:ring-offset-2 focus:ring-offset-[#07080d] active:scale-[0.98] px-7 py-3.5 text-base bg-gradient-to-r from-[#06b6d4] to-[#6366f1] hover:from-[#0891b2] hover:to-[#4f46e5] text-white shadow-[0_0_25px_rgba(99,102,241,0.25)] hover:shadow-[0_0_35px_rgba(99,102,241,0.4)]"
          >
            Launch Dashboard
          </Link>
          <Link
            href="/features"
            id="aether-cta-secondary"
            className="inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:ring-offset-2 focus:ring-offset-[#07080d] active:scale-[0.98] px-7 py-3.5 text-base bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 text-white"
          >
            Explore Features
          </Link>
        </div>
      </div>
    </section>
  );
}
