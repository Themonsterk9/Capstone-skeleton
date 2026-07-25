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
