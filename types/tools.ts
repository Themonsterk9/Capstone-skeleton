import { z } from "zod";
import { seoAuditInputSchema, seoAuditOutputSchema } from "@/server/tools/seoAudit";

// ─── Re-export Tool Types ──────────────────────────────────────────────────────
export type SEOAuditInput = z.infer<typeof seoAuditInputSchema>;
export type SEOAuditOutput = z.infer<typeof seoAuditOutputSchema>;

// ─── Tool Call Lifecycle States ────────────────────────────────────────────────
/** The four required FE-07 lifecycle states for a tool call */
export type ToolLifecycleState =
  | "streaming"   // Input is being streamed / tool is being invoked
  | "input"       // Tool input is available but result not yet
  | "output"      // Tool result (output) is available
  | "error";      // Tool execution failed

// ─── Generic Tool UI Part ──────────────────────────────────────────────────────
export interface ToolUIPart<TInput = unknown, TOutput = unknown> {
  toolCallId: string;
  toolName: string;
  state: ToolLifecycleState;
  input?: TInput;
  output?: TOutput;
  error?: string;
}

// ─── Typed SEO Audit Tool Part ─────────────────────────────────────────────────
export type SEOAuditToolPart =
  | { toolCallId: string; toolName: "seoAudit"; state: "streaming"; input?: Partial<SEOAuditInput> }
  | { toolCallId: string; toolName: "seoAudit"; state: "input"; input: SEOAuditInput }
  | { toolCallId: string; toolName: "seoAudit"; state: "output"; input: SEOAuditInput; output: SEOAuditOutput }
  | { toolCallId: string; toolName: "seoAudit"; state: "error"; input?: SEOAuditInput; error: string };

// ─── Union of all known tool parts ────────────────────────────────────────────
export type KnownToolPart = SEOAuditToolPart;

// ─── Chat Message with Tool Parts ─────────────────────────────────────────────
export interface ToolChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  toolParts?: KnownToolPart[];
  status?: "thinking" | "streaming" | "completed" | "error";
}
