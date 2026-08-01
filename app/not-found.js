import React from "react";
import Container from "@/components/Container";
import Section from "@/components/Section";
import Button from "@/components/Button";

export default function NotFound() {
  return (
    <div className="flex-grow flex flex-col justify-center items-center relative overflow-hidden">
      {/* Glow effects */}
      <div className="glow-backdrop-cyan top-[20%] left-[20%] animate-pulse-slow" />
      <div className="glow-backdrop-indigo bottom-[20%] right-[20%] animate-pulse-slow" />

      <Section className="py-20 md:py-32 relative z-10">
        <Container className="text-center flex flex-col items-center">
          <p className="text-xs font-bold tracking-widest text-secondary uppercase bg-secondary/10 border border-secondary/20 px-3 py-1 rounded-full mb-6">
            Error Code 404
          </p>
          
          <h1 className="text-7xl md:text-9xl font-black text-white font-display tracking-tighter">
            4<span className="neon-text-gradient">0</span>4
          </h1>
          
          <h2 className="text-2xl md:text-3xl font-extrabold text-white font-display mt-4 tracking-tight">
            Flight Path Diverted
          </h2>
          
          <p className="text-text-secondary text-sm md:text-base max-w-md mt-4 leading-relaxed">
            The page you are looking for has been moved, renamed, or is temporarily offline. Let&apos;s redirect you back to active routes.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
            <Button variant="primary" href="/">
              Return Home
            </Button>
            <Button variant="secondary" href="/dashboard">
              Launch Console
            </Button>
          </div>
        </Container>
      </Section>
    </div>
  );
}
