import React from "react";
import PageHeader from "@/components/PageHeader";
import Container from "@/components/Container";
import Section from "@/components/Section";
import Card from "@/components/Card";

export default function About() {
  return (
    <div className="flex-grow flex flex-col">
      <PageHeader
        title="About FlyRank"
        subtitle="Our Journey & Mission"
        description="Fusing elite travel status rules and computational intelligence to redefine frequent flyer optimization."
      />

      {/* Main content grid */}
      <Section variant="default">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold font-display text-white mb-6">
                Why We Built FlyRank
              </h2>
              <p className="text-text-secondary text-sm md:text-base leading-relaxed mb-4">
                Frequent flyer status programs are complex systems filled with hidden requirements, varying point weights, and complex qualification windows. For travel analysts and heavy frequent flyers, tracking status is often a chore involving outdated spreadsheets.
              </p>
              <p className="text-text-secondary text-sm md:text-base leading-relaxed">
                FlyRank was born from the desire to make status maximization simple, mathematical, and automatic. By combining route maps, segment details, and real-time status rules, our platform simplifies tier upgrades and ensures you never drop a status level by surprise.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Card hoverable={false} className="border-l-4 border-l-secondary bg-white/2">
                <span className="text-xl font-bold text-white block">Vision</span>
                <p className="text-xs text-text-secondary mt-2">
                  To become the unified standard for tracking global frequent flyer tiers.
                </p>
              </Card>
              <Card hoverable={false} className="border-l-4 border-l-primary bg-white/2">
                <span className="text-xl font-bold text-white block">Precision</span>
                <p className="text-xs text-text-secondary mt-2">
                  Calculating points, segments, and yields down to single percentages.
                </p>
              </Card>
              <Card hoverable={false} className="border-l-4 border-l-accent bg-white/2">
                <span className="text-xl font-bold text-white block">Coverage</span>
                <p className="text-xs text-text-secondary mt-2">
                  Supporting major alliances and non-aligned boutique carriers.
                </p>
              </Card>
              <Card hoverable={false} className="border-l-4 border-l-success bg-white/2">
                <span className="text-xl font-bold text-white block">Speed</span>
                <p className="text-xs text-text-secondary mt-2">
                  Instant simulations when updates or route additions occur.
                </p>
              </Card>
            </div>
          </div>
        </Container>
      </Section>

      {/* History Timeline */}
      <Section variant="accent">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold font-display text-white">
              Platform Milestones
            </h2>
            <p className="text-sm text-text-secondary mt-2">
              From a Staff Engineer&apos;s side-project to a fully optimized enterprise foundation.
            </p>
          </div>

          <div className="relative border-l border-white/10 max-w-2xl mx-auto pl-6 md:pl-8 flex flex-col gap-8">
            <div className="relative">
              <div className="absolute -left-[31px] md:-left-[39px] w-4.5 h-4.5 rounded-full bg-secondary ring-4 ring-[#0b0d18] border border-white" />
              <h3 className="text-white font-bold text-base font-display">
                Phase 3 — Expansion & Alliance Integrations
              </h3>
              <span className="text-xs text-secondary font-semibold">Q3 2026</span>
              <p className="text-xs text-text-secondary mt-1">
                Adding multi-passenger status trackers, group routing simulations, and dynamic reward calendar alerts.
              </p>
            </div>

            <div className="relative">
              <div className="absolute -left-[31px] md:-left-[39px] w-4.5 h-4.5 rounded-full bg-primary ring-4 ring-[#0b0d18]" />
              <h3 className="text-white font-bold text-base font-display">
                Phase 2 — Advanced Ranking Algorithms
              </h3>
              <span className="text-xs text-primary font-semibold">Q1 2026</span>
              <p className="text-xs text-text-secondary mt-1">
                Integrating partner flight validation engines, tier mapping matrices, and automated airline status matches.
              </p>
            </div>

            <div className="relative">
              <div className="absolute -left-[31px] md:-left-[39px] w-4.5 h-4.5 rounded-full bg-slate-600 ring-4 ring-[#0b0d18]" />
              <h3 className="text-white font-bold text-base font-display">
                Phase 1 — Foundations Launch (Current)
              </h3>
              <span className="text-xs text-slate-400 font-semibold">Q4 2025</span>
              <p className="text-xs text-text-secondary mt-1">
                Initializing the core application framework, responsive layout navigation, dark theme UI components, and server-side status health page.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
