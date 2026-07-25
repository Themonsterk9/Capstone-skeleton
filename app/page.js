import React from "react";
import Container from "@/components/Container";
import Section from "@/components/Section";
import Button from "@/components/Button";
import Card from "@/components/Card";

export default function Home() {
  return (
    <div className="relative overflow-hidden flex-grow flex flex-col justify-center">
      {/* Decorative ambient background glows */}
      <div className="glow-backdrop-cyan top-[10%] left-[-5%] animate-pulse-slow" />
      <div className="glow-backdrop-indigo top-[40%] right-[-5%] animate-pulse-slow" />

      {/* Hero Section */}
      <Section variant="gradient" className="pt-20 pb-16 md:pt-32 md:pb-24">
        <Container className="text-center relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-6 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-secondary" />
            <span className="text-xs font-semibold tracking-wide text-gray-300">
              FlyRank Foundations V1.0 Active
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white font-display tracking-tight max-w-4xl leading-tight">
            Optimize Your Flight Ranks with{" "}
            <span className="neon-text-gradient">Precision Analytics</span>
          </h1>

          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mt-6 leading-relaxed">
            Unleash the full potential of your elite status. Track flights, analyze complex airline tier upgrades, and evaluate routes using our high-performance ranking engine.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
            <Button variant="primary" size="lg" href="/dashboard">
              Launch Dashboard
            </Button>
            <Button variant="secondary" size="lg" href="/features">
              Explore Features
            </Button>
          </div>
        </Container>
      </Section>

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
