import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import ToolRenderer from "@/components/tools/ToolRenderer";
import { KnownToolPart } from "@/types/tools";

describe("ToolRenderer Component Tests", () => {
  test("renders loading card in streaming state", () => {
    const part: KnownToolPart = {
      toolCallId: "tc-1",
      toolName: "seoAudit",
      state: "streaming",
    };

    render(<ToolRenderer part={part} />);

    // ToolLoadingCard contains status role, header text, and spinner
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("SEO Audit")).toBeInTheDocument();
    expect(screen.getByText("Analyzing…")).toBeInTheDocument();
  });

  test("renders input details in input state", () => {
    const part: KnownToolPart = {
      toolCallId: "tc-2",
      toolName: "seoAudit",
      state: "input",
      input: { url: "https://flyrank.com" },
    };

    render(<ToolRenderer part={part} />);

    expect(screen.getByText(/seoAudit/i)).toBeInTheDocument();
    expect(screen.getByText("https://flyrank.com")).toBeInTheDocument();
    expect(screen.getByText(/Tool Selected/i)).toBeInTheDocument();
    expect(screen.getByText(/preparing to execute/i)).toBeInTheDocument();
  });

  test("renders structured audit outputs in output state", () => {
    const part: KnownToolPart = {
      toolCallId: "tc-3",
      toolName: "seoAudit",
      state: "output",
      input: { url: "https://flyrank.com" },
      output: {
        url: "https://flyrank.com",
        seoScore: 92,
        title: "FlyRank - Frequent Flyer Tier Upgrades",
        metaDescription: "Analyze status miles and paths",
        canonical: "https://flyrank.com",
        robots: "index, follow",
        language: "en",
        loadTimeMs: 500,
        pageSizeKb: 34,
        headings: [
          { text: "FlyRank Analytics", level: 1 },
          { text: "Upgrades", level: 2 },
        ],
        imagesWithoutAlt: [{ src: "/img/logo-missing.png", context: "Navbar Brand logo" }],
        brokenLinks: [{ href: "/bad-link-url", statusCode: 404, text: "Click here" }],
        recommendations: [
          {
            priority: "critical",
            category: "seo",
            title: "Add alt text to images",
            description: "Missing alt attributes reduce screen reader accessibility.",
          },
          {
            priority: "high",
            category: "performance",
            title: "Fix broken links",
            description: "404 links hurt user navigation and site crawling.",
          }
        ],
        pageSpeedEstimate: {
          fcp: 1200,
          lcp: 2100,
          ttfb: 350,
          cls: 0.05,
        },
      },
    };

    render(<ToolRenderer part={part} />);

    // Assert that the main title and core structures are present
    expect(screen.getByText("SEO Audit Complete")).toBeInTheDocument();
    // Resolves duplicate elements by matching the first instance
    expect(screen.getAllByText("https://flyrank.com")[0]).toBeInTheDocument();
    
    // Check circular score indicator shows score
    expect(screen.getByText("92")).toBeInTheDocument();
    expect(screen.getByText("Excellent")).toBeInTheDocument();

    // Check headings list
    expect(screen.getByText("Heading Structure")).toBeInTheDocument();
    expect(screen.getByText("FlyRank Analytics")).toBeInTheDocument();
    expect(screen.getByText("Upgrades")).toBeInTheDocument();

    // Check findings counts (using getAllByText to avoid duplicate element errors)
    expect(screen.getByText("Images Without Alt Text")).toBeInTheDocument();
    expect(screen.getAllByText("Broken Links")[0]).toBeInTheDocument();
    
    // Verify specific text values
    expect(screen.getByText("/img/logo-missing.png")).toBeInTheDocument();
    expect(screen.getByText("Navbar Brand logo")).toBeInTheDocument();
    expect(screen.getByText("/bad-link-url")).toBeInTheDocument();
    expect(screen.getByText("Click here")).toBeInTheDocument();
  });

  test("renders error card with retry button in error state", () => {
    const handleRetry = vi.fn();
    const part: KnownToolPart = {
      toolCallId: "tc-4",
      toolName: "seoAudit",
      state: "error",
      error: "Failed to connect to target URL.",
    };

    render(<ToolRenderer part={part} onRetry={handleRetry} />);

    expect(screen.getByText(/Tool Execution Failed/i)).toBeInTheDocument();
    expect(screen.getByText("Failed to connect to target URL.")).toBeInTheDocument();

    const retryBtn = screen.getByRole("button", { name: /Retry the failed tool call/i });
    expect(retryBtn).toBeInTheDocument();
    
    fireEvent.click(retryBtn);
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });
});
