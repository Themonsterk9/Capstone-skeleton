import { NextRequest, NextResponse } from "next/server";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";
import { AI_CONFIG } from "@/server/ai/model";
import { FLYRANK_SYSTEM_PROMPT } from "@/server/ai/systemPrompt";
import { generateAssistantResponse } from "@/server/ai/responseEngine";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { getCorsHeaders, handleCorsPreflight } from "@/lib/cors";

// Mark route as dynamic & configure maximum execution duration (seconds)
export const dynamic = "force-dynamic";
export const maxDuration = 30;

type IncomingMessage = {
  role?: string;
  content?: unknown;
};

// Input validation constraints
const MAX_MESSAGES_COUNT = 30;
const MAX_MESSAGE_CHAR_LENGTH = 4000;
const MAX_PAYLOAD_BYTES = 1024 * 100; // 100 KB payload limit
const RATE_LIMIT_REQUESTS = 20; // 20 requests per minute
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

export async function OPTIONS(req: NextRequest) {
  return handleCorsPreflight(req);
}

/**
 * Builds the conversation message array for the AI provider.
 * Filters out system messages, empty content, and the current
 * assistant placeholder before forwarding to the model.
 */
function buildConversationMessages(messages: IncomingMessage[], latestUserContent: string) {
  const cleanedHistory = (messages || [])
    .filter(
      (message): message is IncomingMessage =>
        Boolean(message && typeof message.content === "string" && message.content.trim())
    )
    .filter((message) => message.role !== "system")
    .filter((message) => message.role !== "assistant" || String(message.content).trim())
    .slice(-10) // keep last 10 turns for context
    .map((message) => ({
      role: message.role === "assistant" ? ("assistant" as const) : ("user" as const),
      content: String(message.content).trim().slice(0, MAX_MESSAGE_CHAR_LENGTH),
    }));

  return [
    ...cleanedHistory,
    { role: "user" as const, content: latestUserContent.trim().slice(0, MAX_MESSAGE_CHAR_LENGTH) },
  ];
}

/**
 * Helper to stream a fallback response chunk-by-chunk for smooth UI rendering
 */
function createFallbackStream(userPrompt: string, corsHeaders: Record<string, string>): Response {
  const encoder = new TextEncoder();
  const responseText = generateAssistantResponse(userPrompt);
  const words = responseText.split(/(?<=\s)/); // Split keeping spaces

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      for (const word of words) {
        controller.enqueue(encoder.encode(word));
        // Small 15ms delay per word to simulate real streaming
        await new Promise((r) => setTimeout(r, 15));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
      ...corsHeaders,
    },
  });
}

export async function POST(req: NextRequest) {
  const corsHeaders = getCorsHeaders(req.headers.get("origin"));

  try {
    // 1. Rate Limiting Check
    const clientIp = getClientIp(req);
    const rateLimit = checkRateLimit(clientIp, RATE_LIMIT_REQUESTS, RATE_LIMIT_WINDOW_MS);

    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down and try again in a moment." },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.reset),
            "X-RateLimit-Limit": String(rateLimit.limit),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(rateLimit.reset),
            ...corsHeaders,
          },
        }
      );
    }

    // 2. Request Payload Size Check
    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > MAX_PAYLOAD_BYTES) {
      return NextResponse.json(
        { error: "Payload size too large. Maximum allowed request size is 100 KB." },
        { status: 413, headers: corsHeaders }
      );
    }

    // 3. Parse and Validate Request Body
    const body = await req.json().catch(() => null);

    if (!body || !Array.isArray(body.messages) || body.messages.length === 0) {
      return NextResponse.json(
        { error: "Invalid payload. 'messages' array is required." },
        { status: 400, headers: corsHeaders }
      );
    }

    if (body.messages.length > MAX_MESSAGES_COUNT) {
      return NextResponse.json(
        { error: `Too many messages in history. Maximum allowed is ${MAX_MESSAGES_COUNT}.` },
        { status: 400, headers: corsHeaders }
      );
    }

    const { messages } = body;
    const lastMessage = messages[messages.length - 1];

    const rawUserContent =
      lastMessage && typeof lastMessage.content === "string"
        ? lastMessage.content.trim()
        : "hello";

    const latestUserContent = rawUserContent.slice(0, MAX_MESSAGE_CHAR_LENGTH);

    // 4. Validate API key presence
    const geminiKey =
      process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;

    if (!geminiKey || geminiKey.trim() === "" || geminiKey.includes("your_gemini")) {
      console.warn("[FlyRank AI] Provider API key missing. Serving fallback response.");
      return createFallbackStream(latestUserContent, corsHeaders);
    }

    // 5. Build provider message array
    const providerMessages = buildConversationMessages(
      messages.slice(0, -1),
      latestUserContent
    );

    // 6. Try streaming from Google Generative AI provider
    try {
      const google = createGoogleGenerativeAI({ apiKey: geminiKey });
      const modelProvider = google(AI_CONFIG.PRIMARY_MODEL || "gemini-2.0-flash");

      const result = streamText({
        model: modelProvider,
        system: FLYRANK_SYSTEM_PROMPT,
        messages: providerMessages,
        temperature: AI_CONFIG.TEMPERATURE,
        maxRetries: 0, // Fail fast to immediate fallback on quota/rate errors
        abortSignal: req.signal,
        providerOptions: {
          google: {
            maxOutputTokens: AI_CONFIG.MAX_TOKENS,
            topP: AI_CONFIG.TOP_P,
          },
        },
      });

      const encoder = new TextEncoder();
      const stream = new ReadableStream<Uint8Array>({
        async start(controller) {
          try {
            let hasText = false;

            for await (const textChunk of result.textStream) {
              if (req.signal?.aborted) {
                controller.close();
                return;
              }

              if (textChunk) {
                hasText = true;
                controller.enqueue(encoder.encode(textChunk));
              }
            }

            if (!hasText) {
              console.warn("[FlyRank AI] Model returned empty stream. Fallback triggered.");
              const fallbackText = generateAssistantResponse(latestUserContent);
              controller.enqueue(encoder.encode(fallbackText));
            }

            controller.close();
          } catch (streamError) {
            console.warn("[FlyRank AI] Stream evaluation error, serving fallback:", streamError);
            const fallbackText = generateAssistantResponse(latestUserContent);
            controller.enqueue(encoder.encode(fallbackText));
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          "X-Accel-Buffering": "no",
          "X-RateLimit-Limit": String(rateLimit.limit),
          "X-RateLimit-Remaining": String(rateLimit.remaining),
          ...corsHeaders,
        },
      });
    } catch (apiError) {
      console.warn("[FlyRank AI] API Provider call failed, serving fallback:", apiError);
      return createFallbackStream(latestUserContent, corsHeaders);
    }
  } catch (err: unknown) {
    console.error("[FlyRank AI Route Exception]", err);
    return createFallbackStream("hello", corsHeaders);
  }
}

