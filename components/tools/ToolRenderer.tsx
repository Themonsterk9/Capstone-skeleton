"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { KnownToolPart } from "@/types/tools";
import ToolLoadingCard from "./ToolLoadingCard";
import ToolInputCard from "./ToolInputCard";
import ToolErrorCard from "./ToolErrorCard";
import SEOAuditResult from "./SEOAuditResult";

interface ToolRendererProps {
  part: KnownToolPart;
  onRetry?: () => void;
}

export default function ToolRenderer({ part, onRetry }: ToolRendererProps) {
  return (
    <AnimatePresence mode="wait">
      {/* State 1: Input Streaming — tool call is being assembled */}
      {part.state === "streaming" && (
        <motion.div
          key={`streaming-${part.toolCallId}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <ToolLoadingCard />
        </motion.div>
      )}

      {/* State 2: Input Available — tool call fully formed, awaiting result */}
      {part.state === "input" && part.toolName === "seoAudit" && (
        <motion.div
          key={`input-${part.toolCallId}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <ToolInputCard
            toolName={part.toolName}
            input={{ url: part.input?.url }}
          />
        </motion.div>
      )}

      {/* State 3: Output Available — result rendered as rich UI */}
      {part.state === "output" && part.toolName === "seoAudit" && part.output && (
        <motion.div
          key={`output-${part.toolCallId}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <SEOAuditResult data={part.output} />
        </motion.div>
      )}

      {/* State 4: Output Error */}
      {part.state === "error" && (
        <motion.div
          key={`error-${part.toolCallId}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <ToolErrorCard
            toolName={part.toolName}
            errorMessage={part.error ?? "Unknown error"}
            onRetry={onRetry}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
