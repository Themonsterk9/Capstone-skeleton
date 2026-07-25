import React from "react";
import PageHeader from "@/components/PageHeader";
import Container from "@/components/Container";
import Section from "@/components/Section";
import Card from "@/components/Card";
import Button from "@/components/Button";

export default function Features() {
  const featuresList = [
    {
      title: "Alliance Status Comparison",
      description: "Instantly compare elite tiers between Oneworld, SkyTeam, and Star Alliance. Find the exact equivalent status and maps across different carrier loyalty programs.",
      badge: "Alliance Ready",
      color: "border-t-secondary",
    },
    {
      title: "Yield & Mileage Maximization",
      description: "Input flight routes and check calculated elite qualification points or miles. Identify the optimal fare classes that maximize tier yields for every dollar spent.",
      badge: "Performance Tool",
      color: "border-t-primary",
    },
    {
      title: "Real-Time Segment Tracking",
      description: "Log your flight legs and visualize your distance or segment progress. Let the platform suggest matching partner airlines to help close tier gaps efficiently.",
      badge: "Real-Time Tracking",
      color: "border-t-accent",
    },
    {
      title: "Automated Status Matches",
      description: "Track status match promotions globally. Check if your current tier level on one airline allows you to request instant matching status on competing airlines.",
      badge: "Smart Alerts",
      color: "border-t-success",
    },
    {
      title: "Custom Milestones Alerts",
      description: "Receive reminders for upcoming tier expiration dates, minimum segments, or booking deadlines. Prevent unexpected status downgrades automatically.",
      badge: "Notifications",
      color: "border-t-slate-500",
    },
    {
      title: "Airport Tier Optimization",
      description: "Evaluate lounge access rights, premium baggage privileges, and express security access levels at over 800 international airports worldwide.",
      badge: "Airport Logs",
      color: "border-t-cyan-500",
    },
  ];

  return (
    <div className="flex-grow flex flex-col">
      <PageHeader
        title="Platform Features"
        subtitle="Intelligent Capabilities"
        description="Fusing elite travel status rules and computational intelligence to redefine frequent flyer optimization."
      />

      <Section variant="default">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {featuresList.map((feature, idx) => (
              <Card
                key={idx}
                className={`border-t-4 ${feature.color} flex flex-col justify-between h-full`}
                title={feature.title}
              >
                <p className="text-text-secondary leading-relaxed mb-6">
                  {feature.description}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-secondary bg-secondary/10 px-2.5 py-0.5 rounded-full">
                    {feature.badge}
                  </span>
                  <a href="/dashboard" className="text-xs text-white hover:text-secondary font-semibold transition-colors duration-200">
                    Learn more &rarr;
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA Box */}
      <Section variant="glass" className="my-12">
        <Container className="text-center">
          <h3 className="text-2xl font-bold font-display text-white mb-4">
            Ready to optimize your travel status?
          </h3>
          <p className="text-text-secondary max-w-lg mx-auto text-sm md:text-base mb-8">
            Get instant access to our dashboard and start calculating qualification paths for your next elite status level.
          </p>
          <Button variant="primary" size="lg" href="/dashboard">
            Launch Platform Console
          </Button>
        </Container>
      </Section>
    </div>
  );
}
