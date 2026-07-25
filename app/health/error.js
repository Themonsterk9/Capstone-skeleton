"use client";

import React, { useEffect } from "react";
import Container from "@/components/Container";
import Section from "@/components/Section";
import Button from "@/components/Button";
import Card from "@/components/Card";

/**
 * Error boundary component for the SSR health check route.
 */
export default function HealthError({ error, reset }) {
  useEffect(() => {
    // Log the error to an analytics service or console for staff engineers
    console.error("Health check SSR error:", error);
  }, [error]);

  return (
    <div className="flex-grow flex flex-col justify-center min-h-[60vh] relative overflow-hidden">
      <Section>
        <Container className="max-w-xl mx-auto text-center flex flex-col items-center">
          <Card hoverable={false} className="border-t-4 border-t-red-500 w-full p-8">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6 text-red-500 animate-bounce">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>
            
            <h3 className="text-xl font-bold font-display text-white mb-2">
              Diagnostics Fetch Failed
            </h3>
            
            <p className="text-sm text-text-secondary mb-6 leading-relaxed">
              An error occurred while establishing a server connection or retrieving metrics. Please verify that the local server is operating correctly.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button onClick={() => reset()} variant="primary">
                Try Re-fetching
              </Button>
              <Button href="/" variant="secondary">
                Return Home
              </Button>
            </div>
          </Card>
        </Container>
      </Section>
    </div>
  );
}
