import React from "react";
import Container from "@/components/Container";
import Section from "@/components/Section";
import Card from "@/components/Card";
import AetherFlowHero from "@/components/AetherFlowHero/AetherFlowHero";

export default function Home() {
  return (
    <div className="relative overflow-hidden flex-grow flex flex-col justify-center">
      {/* ── Aether Flow Hero ─────────────────────────────────────
          Fullscreen interactive GLSL shader hero.
          Contains its own h1, introduction, and CTAs.
          Replaces the previous CSS-glow hero section.
      ─────────────────────────────────────────────────────────── */}
      <AetherFlowHero />

      {/* Stats Dashboard Preview Section */}
      <Section className="py-6 border-t border-border-dark">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <Card className="text-center" hoverable={false}>
              <p className="text-3xl md:text-4xl font-extrabold text-white font-display neon-text-gradient">
                48K+
              </p>
              <p className="text-xs text-text-secondary mt-1 uppercase tracking-wider font-semibold">
                Flights Logged
              </p>
            </Card>
            <Card className="text-center" hoverable={false}>
              <p className="text-3xl md:text-4xl font-extrabold text-white font-display neon-text-gradient">
                142
              </p>
              <p className="text-xs text-text-secondary mt-1 uppercase tracking-wider font-semibold">
                Airlines Tracked
              </p>
            </Card>
            <Card className="text-center" hoverable={false}>
              <p className="text-3xl md:text-4xl font-extrabold text-white font-display neon-text-gradient">
                99.9%
              </p>
              <p className="text-xs text-text-secondary mt-1 uppercase tracking-wider font-semibold">
                Status Accuracy
              </p>
            </Card>
            <Card className="text-center" hoverable={false}>
              <p className="text-3xl md:text-4xl font-extrabold text-white font-display neon-text-gradient">
                <span className="text-secondary">&lt;</span> 2s
              </p>
              <p className="text-xs text-text-secondary mt-1 uppercase tracking-wider font-semibold">
                Rank Computation
              </p>
            </Card>
          </div>
        </Container>
      </Section>

      {/* Feature Teaser Grid */}
      <Section variant="accent">
        <Container>
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold font-display text-white tracking-tight">
              Designed for Global Frequent Flyers
            </h2>
            <p className="text-sm md:text-base text-text-secondary mt-2 max-w-xl mx-auto">
              Skip the spreadsheets. FlyRank aggregates airline rules and logs to optimize your status mileage routes automatically.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <Card
              title="Global Tier Matching"
              subtitle="Optimized comparisons"
              className="flex-1"
            >
              <p className="leading-relaxed">
                Compare tier structures across Oneworld, Star Alliance, and SkyTeam. Instantly view validation guidelines and minimum flight requirements.
              </p>
            </Card>
            <Card
              title="Real-Time Status Progress"
              subtitle="Visual status bars"
              className="flex-1"
            >
              <p className="leading-relaxed">
                Track progress milestones to your next tier level. Visualize how any upcoming flight booking will affect your segments or points.
              </p>
            </Card>
            <Card
              title="Advanced Route Analytics"
              subtitle="Maximize mile yields"
              className="flex-1"
            >
              <p className="leading-relaxed">
                Compute flight mile rewards based on airline booking codes and segments. Detect optimized routings that cost less but yield higher elite status.
              </p>
            </Card>
          </div>
        </Container>
      </Section>
    </div>
  );
}
