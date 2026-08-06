import { NextRequest, NextResponse } from "next/server";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";
import { AI_CONFIG } from "@/server/ai/model";
import { FLYRANK_SYSTEM_PROMPT } from "@/server/ai/systemPrompt";
import { generateAssistantResponse } from "@/server/ai/responseEngine";

// Mark route as dynamic to prevent static optimization
export const dynamic = "force-dynamic";

type IncomingMessage = {
  role?: string;
  content?: unknown;
};

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
      content: String(message.content).trim(),
    }));

  return [
    ...cleanedHistory,
    { role: "user" as const, content: latestUserContent.trim() },
  ];
}

/**
 * Helper to stream a fallback response chunk-by-chunk for smooth UI rendering
 */
function createFallbackStream(userPrompt: string): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  const responseText = generateAssistantResponse(userPrompt);
  const words = responseText.split(/(?<=\s)/); // Split keeping spaces

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      for (const word of words) {
        controller.enqueue(encoder.encode(word));
        // Small 15ms delay per word to simulate real streaming
        await new Promise((r) => setTimeout(r, 15));
      }
      controller.close();
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    // 1. Parse request body
    const body = await req.json().catch(() => null);

    if (!body || !Array.isArray(body.messages) || body.messages.length === 0) {
      return NextResponse.json(
        { error: "Invalid payload. 'messages' array is required." },
        { status: 400 }
      );
    }

    const { messages } = body;
    const lastMessage = messages[messages.length - 1];

    const latestUserContent =
      lastMessage && typeof lastMessage.content === "string"
        ? lastMessage.content.trim()
        : "hello";

    // 2. Validate API key presence
    const geminiKey =
      process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;

    if (!geminiKey || geminiKey.trim() === "" || geminiKey.includes("your_gemini")) {
      console.warn("[FlyRank AI] Provider API key missing. Serving fallback response.");
      return new Response(createFallbackStream(latestUserContent), {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          "X-Accel-Buffering": "no",
        },
      });
    }

    // 3. Build provider message array
    const providerMessages = buildConversationMessages(
      messages.slice(0, -1),
      latestUserContent
    );

    // 4. Try streaming from Google Generative AI provider
    try {
      const google = createGoogleGenerativeAI({ apiKey: geminiKey });
      const modelProvider = google(AI_CONFIG.PRIMARY_MODEL || "gemini-2.0-flash");

      const result = streamText({
        model: modelProvider,
        system: FLYRANK_SYSTEM_PROMPT,
        messages: providerMessages,
        temperature: AI_CONFIG.TEMPERATURE,
        maxRetries: 0, // Fail fast to immediate fallback on 429 quota error
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
        },
      });
    } catch (apiError) {
      console.warn("[FlyRank AI] API Provider call failed, serving fallback:", apiError);
      return new Response(createFallbackStream(latestUserContent), {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          "X-Accel-Buffering": "no",
        },
      });
    }
  } catch (err: unknown) {
    console.error("[FlyRank AI Route Exception]", err);
    return new Response(createFallbackStream("hello"), {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Accel-Buffering": "no",
      },
    });
  }
}
