# Aether AI (FlyRank)

A state-of-the-art, production-ready web application built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, and the **Vercel AI SDK 4**. Aether AI combines real-time streaming AI conversation, autonomous tool-enabled SEO auditing with 4-stage Generative UI, an interactive WebGL GLSL aurora shader, comprehensive UI resilience controls, and sentence-buffered screen reader accessibility.

---

## Overview

Aether AI solves the problem of modern AI-driven web analytics and intelligence interfaces. It provides:
1. **Interactive AI Assistance**: Instant token-by-token streaming response generation with fallback stream reliability.
2. **Autonomous Tool Calling**: Automated website auditing (`seoAudit` tool) that analyzes URLs, computes Core Web Vitals, inspects meta tags and heading trees, flags missing alt attributes and broken links, and generates structured report cards.
3. **Resilient UX**: Production-grade handling for network disconnections, HTTP 429 rate limits with active countdowns, HTTP 5xx server errors, slow thinking states (>2s), empty prompt validations, and screen-reader stream storm prevention.

---

## Features

- **Interactive Aether Flow GLSL Hero**: Raw WebGL aurora/domain-warp shader (`shaders/aetherFlow.frag`) with mouse interaction, visibility change pausing, static CSS gradient fallback, and `prefers-reduced-motion` compliance.
- **Streaming AI Assistant (`/chat`)**: Real-time token streaming powered by Google Gemini 2.0 Flash (`@ai-sdk/google`) with automatic local fallback stream when API keys or quotas are unavailable.
- **Tool-Enabled SEO Audit Assistant (`/seo-audit`)**: Autonomous AI tool calling using `streamText` with the `seoAudit` tool, rendering a 4-stage Generative UI lifecycle (`streaming` → `input` → `output` → `error`).
- **Production Rate Limiting & Security**: In-memory sliding window rate limiter (`lib/rateLimit.ts`), 100 KB payload size enforcement, message history caps, CORS preflight handling (`lib/cors.ts`), and `maxDuration` execution limits.
- **Sentence-Buffered Screen Reader Announcer**: `AriaLiveAnnouncer` component buffers streaming token fragments into completed sentences, announcing polite live updates without cluttering screen reader speech queues.
- **Animated Stateful Button (`/button-demo`)**: Custom stateful motion button component visualizing idle, hover, pressed, loading, emerald success, amber error (shake), and reduced-motion states.
- **System Health Diagnostics (`/health`)**: Server-rendered and REST API diagnostics (`/api/health`) tracking database connectivity, latency, memory utilization, and uptime.
- **Contact & Flight Logger Dashboard (`/contact`, `/dashboard`)**: Validated contact form with interactive success state and client-side flight status dashboard.

---

## Screenshots

> *Screen captures can be placed inside `docs/screenshots/`*

- **Aether Flow Hero Page**: `![Aether Flow Landing Page](docs/screenshots/landing-page.png)`
- **Streaming AI Chat Interface**: `![Streaming AI Chat](docs/screenshots/chat-interface.png)`
- **SEO Audit Tool & Generative UI Report**: `![SEO Audit Report](docs/screenshots/seo-audit-report.png)`
- **Resilience Cards & Rate Limit Cooldown**: `![Resilience Cards](docs/screenshots/resilience-cards.png)`

---

## Live Demo

Production URL:

`<ADD_AFTER_VERCEL_DEPLOYMENT>`

---

## Tech Stack

| Category | Technology |
| --- | --- |
| **Framework** | Next.js 16.2.11 (App Router, Turbopack) |
| **Frontend Library** | React 19.2.4, React DOM 19.2.4 |
| **Styling** | Tailwind CSS v4, PostCSS |
| **Animation & Visuals** | Framer Motion 12.43, Lucide React, WebGL / GLSL Shaders |
| **Markdown Rendering** | React Markdown 10.1, Remark GFM 4.0 |
| **AI / LLM Framework** | Vercel AI SDK 7.0 (`ai`), `@ai-sdk/google` (Gemini 2.0 Flash) |
| **Schema Validation** | Zod |
| **Testing** | Vitest 4.1, React Testing Library 16.3, Playwright 1.62 (E2E) |
| **Code Quality** | ESLint 9, TypeScript 5.8 |
| **Deployment Target** | Vercel / Render |

---

## Architecture

```text
User Browser
   │
   ├──► Next.js 16 App Router Frontend (React 19)
   │     ├── Landing Page (WebGL GLSL Hero Canvas)
   │     ├── AI Streaming Chat (/chat)
   │     ├── SEO Audit Tool Chat (/seo-audit)
   │     └── Diagnostics Dashboard (/health)
   │
   └──► Next.js Route Handlers (/api/chat, /api/tool-chat, /api/health)
         │
         ├── Rate Limiter (lib/rateLimit.ts - 20 req/min sliding window)
         ├── CORS & Security Headers (lib/cors.ts)
         ├── Payload Validation (100 KB max, 30 msgs max, 4000 chars/msg)
         │
         ├── Vercel AI SDK (streamText)
         │     ├── Primary: Google Gemini 2.0 Flash (GOOGLE_GENERATIVE_AI_API_KEY)
         │     └── Secondary/Fallback: Local Fallback Stream Generator
         │
         └── SSE / UI Message Stream Protocol ──► React Streaming UI
```

---

## AI Architecture

- **LLM Provider & Configuration**: Defined in `server/ai/model.ts`. Uses `@ai-sdk/google` (`gemini-2.0-flash`) as the primary streaming provider with fail-fast retries (`maxRetries: 0`) to transition seamlessly to the local fallback generator if rate limits or quota boundaries occur.
- **Prompt System**: Managed via `server/ai/systemPrompt.ts`. Enforces domain expertise, markdown formatting rules, and concise structured output.
- **Message Pipeline**: Incoming request bodies are sanitized, history is capped at the last 10 conversation turns, and individual messages are truncated at 4,000 characters before sending to the model.
- **Streaming Response**: Delivered via Server-Sent Events / UI message streams (`x-vercel-ai-ui-message-stream: v1`). Frontend hooks (`useStreamingChat` and `useToolChat`) parse incoming token chunks and stream deltas into React state.
- **Tool Calling & Generative UI**: `/api/tool-chat` registers the `seoAudit` tool (`server/tools/seoAudit.ts`). AI SDK handles tool invocation via `streamText` with `stopWhen: isStepCount(3)`. `useToolChat` parses tool call deltas and updates `ToolRenderer` through 4 lifecycle states:
  1. `streaming` → `ToolLoadingCard` (Framer Motion skeleton)
  2. `input` → `ToolInputCard` (Clean URL display)
  3. `output` → `SEOAuditResult` (Score arc, Core Web Vitals, metadata, H1-H6 heading tree, broken link table, recommendations)
  4. `error` → `ToolErrorCard` (Retry card)

---

## Environment Variables

| Variable | Required | Purpose | Safe Example |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_APP_URL` | Yes | Base public application URL for CORS and links | `http://localhost:3000` |
| `NEXT_PUBLIC_API_VERSION` | Yes | Public API version tracking prefix | `v1` |
| `HEALTH_CHECK_TIMEOUT` | No | System diagnostic timeout threshold (ms) | `5000` |
| `DATABASE_URL` | No | Database connection string (server-side only) | `mock://localhost:5432/flyrank` |
| `GEMINI_API_KEY` | Recommended | Google Gemini API key (server-side only) | `your_gemini_api_key_here` |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Alternative | Alternative Google Gemini API key | `your_google_api_key_here` |
| `OPENAI_API_KEY` | Optional | Alternative OpenAI API key | `your_openai_api_key_here` |
| `AI_MODEL` | No | Primary AI model identifier | `gemini-2.0-flash` |

*Note: NEVER commit real API keys or credentials to Git.*

---

## Local Development

### Prerequisites
- **Node.js**: `v20.x` or newer recommended
- **npm**: `v10.x` or newer

### Setup & Run
```bash
# 1. Clone the repository
git clone https://github.com/Themonsterk9/Capstone-skeleton.git
cd Capstone-skeleton

# 2. Install dependencies
npm install

# 3. Configure local environment variables
cp .env.example .env.local

# 4. Start local development server with Turbopack
npm run dev

# 5. Open http://localhost:3000 in your browser
```

### Verification Scripts
```bash
# Run production build (TypeScript & Next.js compilation)
npm run build

# Run ESLint check
npm run lint

# Run Vitest unit & component tests
npm run test:run
```

---

## Production Deployment

### Manual Vercel Deployment
1. Import your Git repository into the **Vercel Dashboard**.
2. Keep default Framework Preset as **Next.js**.
3. Set Root Directory to `./`.
4. Add the following Production Environment Variables in Vercel:
   - `NEXT_PUBLIC_APP_URL`: `https://your-app.vercel.app`
   - `GEMINI_API_KEY`: Your production Google Gemini API key
   - `AI_MODEL`: `gemini-2.0-flash`
5. Deploy. Vercel automatically detects Next.js 16 App Router and configures serverless functions and `maxDuration` timeouts.

### Manual Render Deployment
1. Create a new **Web Service** on Render connected to your repository.
2. Select **Node** environment.
3. Build Command: `npm install && npm run build`
4. Start Command: `npm run start`
5. Add Environment Variables:
   - `NEXT_PUBLIC_APP_URL`: `https://your-service.onrender.com`
   - `GEMINI_API_KEY`: Your production Google Gemini API key
   - `AI_MODEL`: `gemini-2.0-flash`

---

## Security

Production protections implemented across all API and AI endpoints:
- **Rate Limiting**: Sliding window rate limiter in `lib/rateLimit.ts` enforcing a maximum of 20 requests per minute per IP address on `/api/chat` and `/api/tool-chat`. Returns HTTP 429 with `Retry-After` headers.
- **Request Payload Bounds**: Capped at 100 KB payload size limit (`413 Payload Too Large`).
- **Input Sanitization & Length Limits**: Maximum 30 messages in history; individual message prompts are truncated at 4,000 characters.
- **Streaming Duration Limits (`maxDuration`)**: Configured `maxDuration = 30` (30 seconds) for `/api/chat` and `maxDuration = 60` (60 seconds) for `/api/tool-chat` matching Vercel serverless execution bounds.
- **CORS & Preflight Handling**: Implemented in `lib/cors.ts` handling `OPTIONS` preflights and enforcing allowed origins without wildcard `*` wildcard credentials issues.
- **Security Headers**: Returns `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, and `Referrer-Policy: strict-origin-when-cross-origin`.
- **Safe Error Responses**: Detailed errors logged to server console only. Client responses receive sanitized error messages with zero stack traces, internal paths, or exposed secrets.

---

## Technical Decisions

1. **Next.js 16 App Router & Turbopack**: Chosen for fast builds, React 19 integration, dynamic route handlers, and streaming SSR support.
2. **Vercel AI SDK 4 (`ai`, `@ai-sdk/google`)**: Provides standardized `streamText` abstractions, SSE message streaming, and type-safe tool calling with Zod schemas.
3. **In-Memory Sliding Window Rate Limiter**: Simple, zero-dependency rate limiter suitable for serverless execution environments without requiring Redis setup.
4. **Local Fallback Stream Engine**: Built into AI route handlers to guarantee 100% application availability and smooth UI demonstrations even if upstream LLM API limits are reached.
5. **Sentence-Buffered ARIA Live Announcer**: Solves screen reader stream storming by batching incoming token deltas into completed sentences before announcing.

---

## How AI Tools Were Used

*This section provides an honest breakdown of AI tool usage during development.*

- **AI Tools Used**: Gemini / Antigravity AI pair programming assistant.
- **AI Contributions**:
  - **Security & Infrastructure**: Drafted rate limiting (`lib/rateLimit.ts`) and CORS helper (`lib/cors.ts`) abstractions; updated API route handlers with `maxDuration`, payload limits, and OPTIONS preflight support.
  - **Shaders & Animations**: Assisted in crafting the WebGL GLSL fragment shader (`shaders/aetherFlow.frag`) and React canvas wrapper (`AetherFlowHero.jsx`).
  - **Testing**: Generated initial test boilerplates for Vitest component tests (`__tests__/*.test.tsx`) and Playwright E2E tests (`__tests__/e2e/chat.spec.ts`).
  - **Accessibility**: Helped construct `AriaLiveAnnouncer.tsx` to handle sentence buffering for streaming AI responses.
- **Human Guidance & Verification**:
  - **Architecture & Requirements**: All architectural boundaries, route structures, component breakdowns, and design tokens were specified and directed by human requirements.
  - **Verification**: Every build check (`npm run build`), linting check (`npm run lint`), test run (`npm run test:run`), and browser layout check was verified and executed locally by human review.

---

## Known Limitations

- **Client-Side History**: Chat history is persisted in `localStorage` per browser session.
- **Mock SEO Audit Tool Data**: The `seoAudit` tool generates realistic structured audit metrics using URL hash determinism; production live scanning would integrate a server-side HTML parser (Cheerio/JSDOM) or Lighthouse API.

---

## Project Structure

```text
d:\Capstone skeleton/
├── .env.example           # Environment template with safe placeholders
├── .env.local             # Local development environment secrets (gitignored)
├── next.config.mjs        # Next.js 16 configuration
├── package.json           # Scripts and dependencies
├── README.md              # Project documentation
├── tsconfig.json          # TypeScript configuration
├── vitest.config.ts       # Vitest test framework configuration
├── playwright.config.ts   # Playwright E2E test configuration
├── app/
│   ├── layout.js          # Root layout & global styles
│   ├── page.js            # Landing page featuring Aether Flow Hero
│   ├── globals.css        # Tailwind v4 styles & safe-area rules
│   ├── error.tsx          # App Route error boundary
│   ├── global-error.tsx   # Global HTML crash boundary
│   ├── loading.tsx        # Global page skeleton loader
│   ├── about/             # About page
│   ├── button-demo/       # Interactive AnimatedStatefulButton demo
│   ├── chat/              # Streaming AI chat route (/chat)
│   ├── contact/           # Validated contact form page
│   ├── dashboard/         # Flight logger console page
│   ├── features/          # Feature grid page
│   ├── health/            # SSR health page
│   ├── seo-audit/         # Tool-enabled SEO audit page (/seo-audit)
│   └── api/
│       ├── chat/          # POST /api/chat route handler
│       ├── tool-chat/     # POST /api/tool-chat route handler
│       └── health/        # GET /api/health route handler
├── components/
│   ├── AetherFlowHero/    # WebGL GLSL hero canvas & styles
│   ├── AnimatedStatefulButton.tsx # Stateful motion button
│   ├── chat/              # Chat UI components & AriaLiveAnnouncer
│   ├── resilience/        # Resilience cards (Offline, 429, 5xx, Slow, Onboarding)
│   └── tools/             # Tool UI cards & Generative UI renderers
├── hooks/
│   ├── useNetworkStatus.ts# Online/offline network status hook
│   ├── useStreamingChat.ts# Streaming chat hook with local fallback
│   └── useToolChat.ts     # AI SDK UI stream parser & tool state manager
├── lib/
│   ├── cors.ts            # CORS preflight & security headers helper
│   ├── rateLimit.ts       # Sliding window rate limiter helper
│   └── utils.js           # Classnames utility helper
├── server/
│   ├── ai/                # Model parameters, system prompt & fallback response engine
│   └── tools/             # seoAudit tool definition & Zod schemas
├── shaders/
│   └── aetherFlow.frag    # WebGL GLSL fragment shader source
└── __tests__/             # Vitest unit tests & Playwright E2E test suite
```

---

## Troubleshooting

1. **`npm run dev` fails to start**:
   Ensure Node.js is version 20+ (`node -v`). Delete `.next/` directory and re-run `npm run dev`.
2. **AI Provider API Key missing warning**:
   If `GEMINI_API_KEY` is not present in `.env.local`, Aether AI automatically uses its built-in local fallback engine to stream simulated responses. Add your Gemini key to enable live remote model generation.
3. **Vite / Vitest config loader warning**:
   Run `npm run test:run` directly. The warning is informational regarding Vite config loading.

---

## License

This project is licensed under the [MIT License](LICENSE).
