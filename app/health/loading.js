import React from "react";
import Container from "@/components/Container";
import Section from "@/components/Section";
import Loading from "@/components/Loading";

/**
 * Loading page skeleton for the SSR health check route.
 */
export default function HealthLoading() {
  return (
    <div className="flex-grow flex flex-col justify-center min-h-[50vh]">
      <Section>
        <Container className="flex items-center justify-center">
          <Loading text="Querying backend server telemetry..." />
        </Container>
      </Section>
    </div>
  );
}
