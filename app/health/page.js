import React from "react";
import PageHeader from "@/components/PageHeader";
import Container from "@/components/Container";
import Section from "@/components/Section";
import Card from "@/components/Card";
import { getSystemHealth } from "@/services/healthService";

export const dynamic = "force-dynamic";

export default async function Health() {
  const healthData = await getSystemHealth();

  return (
    <div className="flex-grow flex flex-col">
      <PageHeader
        title="System Status"
        subtitle="Diagnostics & Telemetry"
        description="Verify backend services, memory allocations, server environments, and database connections."
      />

      <Section variant="gradient">
        <Container className="flex flex-col gap-8">
          
          {/* Main Status Callout */}
          <div className="glass-panel rounded-xl p-8 border-l-4 border-l-success flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-success/10 border border-success/20 flex items-center justify-center text-success shadow-glow-secondary animate-pulse">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-text-secondary">Overall System Health</span>
                <h2 className="text-2xl font-black text-white font-display">
                  {healthData.status}
                </h2>
              </div>
            </div>
            <div className="text-right text-xs text-text-secondary md:border-l md:border-white/10 md:pl-6">
              <p>Environment: <strong className="text-white capitalize">{healthData.env}</strong></p>
              <p className="mt-1">Last Checked: <strong className="text-white font-mono">{new Date(healthData.timestamp).toLocaleTimeString()}</strong></p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Services Health */}
            <Card title="Database & Services" subtitle="Active connections" hoverable={false}>
              <ul className="flex flex-col gap-4 mt-3">
                <li className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">Database Cluster</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-success/15 text-success border border-success/10">
                    {healthData.services.database}
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">Redis Cache</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-success/15 text-success border border-success/10">
                    {healthData.services.cache}
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">Ranking Core</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-success/15 text-success border border-success/10">
                    {healthData.services.rankingEngine}
                  </span>
                </li>
              </ul>
            </Card>

            {/* Resources Health */}
            <Card title="Server Resources" subtitle="Memory allocations" hoverable={false}>
              <ul className="flex flex-col gap-4 mt-3">
                <li className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Heap Memory Used</span>
                  <span className="font-mono font-bold text-white text-sm">
                    {healthData.memory.heapUsed}
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Heap Memory Total</span>
                  <span className="font-mono font-bold text-white text-sm">
                    {healthData.memory.heapTotal}
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">RSS Memory Total</span>
                  <span className="font-mono font-bold text-white text-sm">
                    {healthData.memory.rss}
                  </span>
                </li>
              </ul>
            </Card>

            {/* Environment Telemetry */}
            <Card title="System Diagnostics" subtitle="Environment properties" hoverable={false}>
              <ul className="flex flex-col gap-4 mt-3">
                <li className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Server Uptime</span>
                  <span className="font-mono font-bold text-white text-sm">
                    {healthData.uptime}
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Node.js Version</span>
                  <span className="font-mono font-bold text-white text-sm">
                    {healthData.nodeVersion}
                  </span>
                </li>
                <li className="flex flex-col gap-1">
                  <span className="text-xs text-text-secondary">Operating System</span>
                  <span className="font-mono text-white text-xs break-all leading-normal">
                    {healthData.platform}
                  </span>
                </li>
              </ul>
            </Card>
          </div>
        </Container>
      </Section>
    </div>
  );
}
