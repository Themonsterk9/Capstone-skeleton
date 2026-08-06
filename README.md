# FlyRank — Capstone Foundations

FlyRank is a premium frequent flyer rank and airport analytics console built using Next.js App Router, Tailwind CSS (v4), and JavaScript. It computes status loyalty tiers, maps equivalent levels across global airline alliances, tracks flight segments, and runs on-demand server diagnostic telemetry.

---

## Technical Stack & Architecture

### Technologies Used
* **Framework**: Next.js 16 (App Router)
* **Styling**: Tailwind CSS v4 (CSS-first configuration with `@theme` styling)
* **Language**: JavaScript (ES6+)
* **Dependencies**: React 19, React DOM 19

### Project Directory Structure
```
d:\Capstone skeleton/
├── .env.local             # Local environment configurations (ignored by Git)
├── .env.example           # Environment template for references
├── jsconfig.json          # JavaScript import mappings (@/* -> ./*)
├── next.config.mjs        # Next.js configurations
├── postcss.config.mjs     # PostCSS styling directives
├── package.json           # Installed node packages and scripts
├── README.md              # Project documentation
├── app/                   # Next.js App Router Page components
│   ├── layout.js          # Root layout with fonts and metadata
│   ├── page.js            # Landing page featuring cards & key metrics
│   ├── globals.css        # Tailwind v4 directives, glass panels, and glow keyframes
│   ├── not-found.js       # Premium responsive 404 page
│   ├── about/             # About FlyRank and team milestone timeline
│   │   └── page.js
│   ├── dashboard/         # Fully interactive clientside flight logger dashboard
│   │   └── page.js
│   ├── features/          # Platform features grid view
│   │   └── page.js
│   ├── contact/           # Validated contact form with interactive success state
│   │   └── page.js
│   ├── health/            # SSR health status page
│   │   ├── page.js
│   │   ├── loading.js     # Telemetry fetching loader fallback
│   │   └── error.js      # SSR fetching error boundary
│   └── api/
│       └── health/        # REST API endpoint for system status checks
│           └── route.js
├── components/            # Reusable UI component library
│   ├── Navbar.js          # Desktop/Mobile responsive active-link header
│   ├── Footer.js          # Sleek multi-column footer
│   ├── Button.js          # Multi-variant responsive buttons
│   ├── Card.js            # Glassmorphic display boxes with hover states
│   ├── Container.js       # Layout grid wrapper
│   ├── Section.js         # Semantic section spacing dividers
│   ├── PageHeader.js      # Glow header with gradient titles
│   ├── PlaceholderCard.js # Skeleton loaders
│   ├── Loading.js         # Centered glowing spinners
│   └── EmptyState.js      # Default data placeholder panels
├── hooks/                 # Custom React hooks folder
├── lib/                   # Utility libraries and classes
│   └── utils.js           # classNames combination merger
└── services/              # Server-side APIs and computation layers
    └── healthService.js   # Server system diagnostics check
```

---

## Installation & Setup

### Prerequisites
* **Node.js**: `v18.x` or newer (Recommended: `v20.x+`)
* **npm**: `v9.x` or newer

### Getting Started
1. Clone the repository to your local workspace directory.
2. Install the package dependencies:
   ```bash
   npm install
   ```
3. Copy the environment variables template and configure the values:
   ```bash
   cp .env.example .env.local
   ```

### Running Locally
To launch the application in development mode with Turbopack:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Production Build
To compile the application in optimized production mode and check for errors:
```bash
npm run build
```

---

## Environment Variables
The application utilizes the following parameters. Configure them in `.env.local`:

| Variable Name | Description | Example Value |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_APP_URL` | Base application routing URL | `http://localhost:3000` |
| `NEXT_PUBLIC_API_VERSION`| API version tracking prefix | `v1` |
| `HEALTH_CHECK_TIMEOUT` | Max delay allowed during SSR calls | `5000` |
| `DATABASE_URL` | Local mock database routing connection | `mock://localhost:5432/flyrank_dev` |

---

## Future Execution Phases
1. **Phase 2 (Milestone Yield Computations)**: Integrate real airline fare databases to check qualification miles instantly.
2. **Phase 3 (Alliance Promotions)**: Add status matching integrations and alert notifications when alliances launch fast-track challenges.
3. **Phase 4 (Offline Operations)**: Enable progressive web application configurations and localStorage sync to log flights without internet connectivity.

---

## Screenshots Placeholder
*Once deployed to Vercel, attach screenshots showing mobile, tablet, and desktop views of the Interactive Flight Log Console.*

---

## FE-07: AI SDK Tool Calling with Generative UI

FlyRank now includes a production-quality **SEO Audit Assistant** powered by AI SDK v7 tool calling with beautiful Generative UI. Access it at [`/seo-audit`](http://localhost:3000/seo-audit).

### Tool: `seoAudit`

| Property | Value |
|---|---|
| **Tool Name** | `seoAudit` |
| **Route** | `POST /api/tool-chat` |
| **Tool File** | `server/tools/seoAudit.ts` |
| **Description** | Analyzes a webpage and returns a comprehensive structured SEO report |

### Schema

**Input Schema** (Zod):
```typescript
z.object({
  url: z.string().url()  // Full URL of the webpage to audit
})
```

**Output Schema** (Zod):
```typescript
z.object({
  url: z.string().url(),
  title: z.string(),
  metaDescription: z.string(),
  canonical: z.string(),
  robots: z.string(),
  language: z.string(),
  headings: z.array(z.object({ level: z.number(), text: z.string() })),
  imagesWithoutAlt: z.array(z.object({ src: z.string(), context: z.string() })),
  brokenLinks: z.array(z.object({ href: z.string(), statusCode: z.number(), text: z.string() })),
  pageSpeedEstimate: z.object({
    fcp: z.number(),   // First Contentful Paint (ms)
    lcp: z.number(),   // Largest Contentful Paint (ms)
    cls: z.number(),   // Cumulative Layout Shift score
    ttfb: z.number(),  // Time to First Byte (ms)
  }),
  seoScore: z.number().int().min(0).max(100),
  recommendations: z.array(z.object({
    priority: z.enum(["critical", "high", "medium", "low"]),
    category: z.string(),
    title: z.string(),
    description: z.string(),
  })),
})
```

### Example Request

```json
POST /api/tool-chat
{
  "messages": [
    { "role": "user", "content": "Audit https://example.com for SEO issues" }
  ]
}
```

### Example Response (streamed AI SDK UI message stream)

The server streams in AI SDK v7 UI message stream protocol. The tool result includes:

```json
{
  "url": "https://example.com",
  "title": "Example Domain | Example",
  "metaDescription": "Example domain description...",
  "canonical": "https://example.com",
  "robots": "index, follow",
  "language": "en",
  "headings": [{ "level": 1, "text": "Welcome to example.com" }, ...],
  "imagesWithoutAlt": [],
  "brokenLinks": [],
  "pageSpeedEstimate": { "fcp": 1800, "lcp": 2900, "cls": 0.05, "ttfb": 350 },
  "seoScore": 85,
  "recommendations": [
    {
      "priority": "medium",
      "category": "Content Structure",
      "title": "Improve Heading Hierarchy",
      "description": "Ensure a single H1 tag and logical heading structure..."
    }
  ]
}
```

### Tool Lifecycle States (4 Required States)

| State | Component | Description |
|---|---|---|
| 1. `streaming` | `ToolLoadingCard` | Framer Motion skeleton + spinner + "Analyzing..." |
| 2. `input` | `ToolInputCard` | Shows selected tool + URL cleanly (no JSON) |
| 3. `output` | `SEOAuditResult` | Full Generative UI with all SEO components |
| 4. `error` | `ToolErrorCard` | Animated error with retry button |

### Component Flow

```
useToolChat hook (hooks/useToolChat.ts)
  └─ POST /api/tool-chat (app/api/tool-chat/route.ts)
       └─ streamText() + seoAuditTool (server/tools/seoAudit.ts)
            └─ toUIMessageStream() → createUIMessageStreamResponse()

ToolChatPage (components/chat/ToolChatPage.tsx)
  └─ AssistantBubble
       └─ ToolRenderer (components/tools/ToolRenderer.tsx)
            ├─ state="streaming" → ToolLoadingCard
            ├─ state="input"     → ToolInputCard
            ├─ state="output"    → SEOAuditResult
            │    ├─ SEOScoreCard       (animated arc progress)
            │    ├─ AuditSummary       (metrics + Core Web Vitals)
            │    ├─ MetadataCard       (title, meta, canonical, robots)
            │    ├─ HeadingTree        (H1-H6 hierarchy)
            │    ├─ FindingsTable      (images + broken links)
            │    └─ RecommendationCard (priority-sorted fixes)
            └─ state="error"     → ToolErrorCard
```

### Updated Folder Structure (FE-07 additions)

```
├── app/
│   ├── api/
│   │   └── tool-chat/        # [NEW] AI SDK tool-enabled streaming endpoint
│   │       └── route.ts
│   └── seo-audit/            # [NEW] SEO Audit chat page route
│       └── page.tsx
├── components/
│   └── tools/                # [NEW] Tool UI component library
│       ├── ToolLoadingCard.tsx
│       ├── ToolInputCard.tsx
│       ├── ToolErrorCard.tsx
│       ├── ToolRenderer.tsx
│       ├── SEOAuditResult.tsx
│       ├── SEOScoreCard.tsx
│       ├── MetadataCard.tsx
│       ├── HeadingTree.tsx
│       ├── FindingsTable.tsx
│       ├── RecommendationCard.tsx
│       └── AuditSummary.tsx
├── hooks/
│   └── useToolChat.ts        # [NEW] AI SDK stream parser & tool state manager
├── server/
│   └── tools/
│       └── seoAudit.ts       # [NEW] Zod schema + mock SEO audit tool
└── types/
    └── tools.ts              # [NEW] Tool lifecycle types
```

### Architecture Diagram

```
Client                          Server
  │                               │
  │  POST /api/tool-chat           │
  ├──────────────────────────────►│
  │                               │  streamText({
  │                               │    model: gemini-2.0-flash,
  │                               │    tools: { seoAudit },
  │                               │    stopWhen: isStepCount(3)
  │                               │  })
  │                               │
  │  ◄── AI SDK UI stream ─────── │  tool.execute() → mock data
  │    "a": tool-call-start        │
  │    "b": arg deltas             │
  │    "a": tool-result            │
  │    "0": text delta             │
  │    "d": finish                 │
  │                               │
  │  useToolChat parses stream     │
  │  → streaming → input → output  │
  │  ToolRenderer renders UI       │
```
