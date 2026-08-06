import { tool } from "ai";
import { z } from "zod";

// ─── Input Schema ─────────────────────────────────────────────────────────────
export const seoAuditInputSchema = z.object({
  url: z
    .string()
    .url({ message: "A valid URL is required (e.g. https://example.com)" })
    .describe("The full URL of the webpage to audit for SEO"),
});

// ─── Output Schema ─────────────────────────────────────────────────────────────
export const seoAuditOutputSchema = z.object({
  url: z.string().url(),
  title: z.string(),
  metaDescription: z.string(),
  canonical: z.string(),
  robots: z.string(),
  language: z.string(),
  headings: z.array(
    z.object({
      level: z.number().int().min(1).max(6),
      text: z.string(),
    })
  ),
  imagesWithoutAlt: z.array(
    z.object({
      src: z.string(),
      context: z.string(),
    })
  ),
  brokenLinks: z.array(
    z.object({
      href: z.string(),
      statusCode: z.number().int(),
      text: z.string(),
    })
  ),
  pageSpeedEstimate: z.object({
    fcp: z.number().describe("First Contentful Paint in ms"),
    lcp: z.number().describe("Largest Contentful Paint in ms"),
    cls: z.number().describe("Cumulative Layout Shift score"),
    ttfb: z.number().describe("Time to First Byte in ms"),
  }),
  seoScore: z.number().int().min(0).max(100),
  recommendations: z.array(
    z.object({
      priority: z.enum(["critical", "high", "medium", "low"]),
      category: z.string(),
      title: z.string(),
      description: z.string(),
    })
  ),
});

export type SEOAuditInput = z.infer<typeof seoAuditInputSchema>;
export type SEOAuditOutput = z.infer<typeof seoAuditOutputSchema>;

// ─── Mock Data Generator ───────────────────────────────────────────────────────
/**
 * Generates realistic mock SEO audit data based on the provided URL.
 * Uses URL-based hashing to produce consistent but varied results.
 */
function generateMockAuditData(url: string): SEOAuditOutput {
  const parsed = new URL(url);
  const domain = parsed.hostname.replace(/^www\./, "");
  const pathSegments = parsed.pathname.split("/").filter(Boolean);

  // Deterministic "hash" from domain for consistent mock data
  const hash = domain.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);

  const titleBase =
    pathSegments.length > 0
      ? pathSegments[pathSegments.length - 1].replace(/-/g, " ")
      : domain;

  const title = `${titleBase.charAt(0).toUpperCase() + titleBase.slice(1)} | ${domain.charAt(0).toUpperCase() + domain.slice(1)}`;

  const hasTitle = title.length > 5;
  const hasMetaDescription = hash % 3 !== 0;
  const hasCanonical = hash % 4 !== 1;
  const hasRobots = hash % 5 !== 2;
  const imagesWithAlt = hash % 4 !== 0;
  const hasBrokenLinks = hash % 3 === 0;

  const metaDescription = hasMetaDescription
    ? `Discover the best ${titleBase} solutions on ${domain}. We provide industry-leading tools and insights to help you grow your business and improve online visibility.`
    : "";

  const canonical = hasCanonical ? url : "";

  const headings = [
    { level: 1, text: `Welcome to ${domain}` },
    { level: 2, text: "Our Core Services" },
    { level: 2, text: "Why Choose Us" },
    { level: 3, text: "Expert Team" },
    { level: 3, text: "Proven Results" },
    { level: 2, text: "Latest Updates" },
    { level: 3, text: "Industry News" },
    { level: 4, text: "Case Studies" },
  ];

  const imagesWithoutAlt = imagesWithAlt
    ? []
    : [
        {
          src: `https://${domain}/assets/hero-banner.jpg`,
          context: "Hero section main banner",
        },
        {
          src: `https://${domain}/assets/team-photo.png`,
          context: "Team members section",
        },
        {
          src: `https://${domain}/assets/icon-product.svg`,
          context: "Product feature icon",
        },
      ];

  const brokenLinks = hasBrokenLinks
    ? [
        {
          href: `https://${domain}/old-page`,
          statusCode: 404,
          text: "Learn More",
        },
        {
          href: `https://${domain}/deprecated/resource`,
          statusCode: 410,
          text: "View Resource",
        },
      ]
    : [];

  // Score calculation
  let score = 60;
  if (hasTitle) score += 10;
  if (hasMetaDescription) score += 12;
  if (hasCanonical) score += 8;
  if (hasRobots) score += 5;
  if (imagesWithAlt) score += 10;
  if (!hasBrokenLinks) score += 5;

  // Cap at 100
  const seoScore = Math.min(score, 100);

  // PageSpeed estimates — vary by hash
  const pageSpeedEstimate = {
    fcp: 1200 + (hash % 1800),
    lcp: 2100 + (hash % 3400),
    cls: parseFloat((0.01 + (hash % 25) / 100).toFixed(3)),
    ttfb: 180 + (hash % 620),
  };

  // Recommendations
  const recommendations: SEOAuditOutput["recommendations"] = [];

  if (!hasMetaDescription) {
    recommendations.push({
      priority: "critical",
      category: "Meta Tags",
      title: "Add Meta Description",
      description:
        "No meta description found. Add a compelling 150-160 character description to improve CTR in search results.",
    });
  }
  if (!hasCanonical) {
    recommendations.push({
      priority: "high",
      category: "Canonicalization",
      title: "Add Canonical Tag",
      description:
        "Missing canonical URL tag. This can cause duplicate content issues which harm your search rankings.",
    });
  }
  if (imagesWithoutAlt.length > 0) {
    recommendations.push({
      priority: "high",
      category: "Accessibility",
      title: `Fix ${imagesWithoutAlt.length} Images Missing Alt Text`,
      description:
        "Images without alt attributes harm both accessibility and image search rankings. Add descriptive alt text to all images.",
    });
  }
  if (brokenLinks.length > 0) {
    recommendations.push({
      priority: "critical",
      category: "Link Integrity",
      title: `Fix ${brokenLinks.length} Broken Links`,
      description:
        "Broken links create poor user experience and waste crawl budget. Update or remove these links immediately.",
    });
  }
  if (pageSpeedEstimate.lcp > 4000) {
    recommendations.push({
      priority: "high",
      category: "Core Web Vitals",
      title: "Improve Largest Contentful Paint (LCP)",
      description: `LCP is ${(pageSpeedEstimate.lcp / 1000).toFixed(1)}s which is in the 'Poor' range. Optimize your largest above-the-fold element (image or text block).`,
    });
  }
  if (pageSpeedEstimate.cls > 0.1) {
    recommendations.push({
      priority: "medium",
      category: "Core Web Vitals",
      title: "Reduce Cumulative Layout Shift (CLS)",
      description: `CLS score of ${pageSpeedEstimate.cls} needs improvement. Reserve space for images, ads, and dynamically injected content.`,
    });
  }
  recommendations.push({
    priority: "medium",
    category: "Content Structure",
    title: "Improve Heading Hierarchy",
    description:
      "Ensure a single H1 tag per page and a logical heading hierarchy (H1 → H2 → H3) to help search engines understand content structure.",
  });
  recommendations.push({
    priority: "low",
    category: "Schema Markup",
    title: "Add Structured Data (JSON-LD)",
    description:
      "Implement schema.org structured data for your content type to enable rich snippets in search results.",
  });

  return {
    url,
    title,
    metaDescription,
    canonical,
    robots: hasRobots ? "index, follow" : "noindex, nofollow",
    language: "en",
    headings,
    imagesWithoutAlt,
    brokenLinks,
    pageSpeedEstimate,
    seoScore,
    recommendations,
  };
}

// ─── SEO Audit Tool Definition ─────────────────────────────────────────────────
export const seoAuditTool = tool({
  description:
    "Analyze a webpage and return a comprehensive structured SEO report including title, meta description, canonical URL, robots directives, heading structure, images without alt text, broken links, Core Web Vitals estimates, an overall SEO score (0-100), and prioritized recommendations.",
  inputSchema: seoAuditInputSchema,
  execute: async ({ url }) => {
    // Validate URL is accessible (simulated — replace with real fetch in production)
    // In a production environment, replace this with:
    //   const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    //   parse HTML with cheerio/JSDOM, extract real data
    await new Promise((r) => setTimeout(r, 1800)); // Simulate network latency

    try {
      const auditData = generateMockAuditData(url);
      return seoAuditOutputSchema.parse(auditData);
    } catch (err) {
      throw new Error(
        `SEO audit failed for ${url}: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    }
  },
});

