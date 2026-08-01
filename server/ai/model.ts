import { FLYRANK_SYSTEM_PROMPT } from "./systemPrompt";

/**
 * Dedicated AI Model & Provider Configuration
 * 
 * Contains all parameters for AI text generation and streaming.
 * Strict rule: No magic numbers inside API route handlers!
 */
export const AI_CONFIG = {
  // Primary & Fallback Models
  PRIMARY_MODEL: process.env.AI_MODEL || "gemini-2.0-flash",
  FALLBACK_MODEL: "gemini-1.5-flash",
  
  // Generation Hyperparameters
  TEMPERATURE: 0.7,
  MAX_TOKENS: 2048,
  TOP_P: 0.95,
  
  // System Prompt Reference
  SYSTEM_PROMPT: FLYRANK_SYSTEM_PROMPT,
  
  // Provider API Keys Check
  DEFAULT_PROVIDER: process.env.GEMINI_API_KEY ? "google" : (process.env.OPENAI_API_KEY ? "openai" : "google"),
} as const;

/**
 * Utility to retrieve current model parameters object
 */
export function getAIModelParameters() {
  return {
    model: AI_CONFIG.PRIMARY_MODEL,
    temperature: AI_CONFIG.TEMPERATURE,
    maxTokens: AI_CONFIG.MAX_TOKENS,
    topP: AI_CONFIG.TOP_P,
    system: AI_CONFIG.SYSTEM_PROMPT,
  };
}
