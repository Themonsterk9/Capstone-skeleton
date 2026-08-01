import { NextRequest, NextResponse } from "next/server";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";
import { AI_CONFIG } from "@/server/ai/model";
import { FLYRANK_SYSTEM_PROMPT } from "@/server/ai/systemPrompt";

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

    if (
      !lastMessage ||
      typeof lastMessage.content !== "string" ||
      !lastMessage.content.trim()
    ) {
      return NextResponse.json(
        { error: "Message content cannot be empty." },
        { status: 400 }
      );
    }

    // 2. Validate API key presence
    const geminiKey =
      process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;

    if (!geminiKey || geminiKey.trim() === "" || geminiKey.includes("your_gemini")) {
      console.error("[FlyRank AI] GEMINI_API_KEY is missing or not configured.");
      return NextResponse.json(
        {
          error:
            "AI provider is not configured. Please set GOOGLE_GENERATIVE_AI_API_KEY or GEMINI_API_KEY in your environment variables.",
        },
        { status: 503 }
      );
    }

    // 3. Build the provider message array (excludes system prompt — passed separately)
    const providerMessages = buildConversationMessages(
      // Exclude the very last message from history since we pass it as latestUserContent
      messages.slice(0, -1),
      lastMessage.content
    );

    // 4. Initialize Google Generative AI provider
    const google = createGoogleGenerativeAI({ apiKey: geminiKey });
    const modelProvider = google(AI_CONFIG.PRIMARY_MODEL || "gemini-2.0-flash");

    // 5. Call streamText with the correct AI SDK v7 API surface
    const result = streamText({
      model: modelProvider,
      system: FLYRANK_SYSTEM_PROMPT,
      messages: providerMessages,
      temperature: AI_CONFIG.TEMPERATURE,
      maxRetries: 1,
      abortSignal: req.signal,
      providerOptions: {
        google: {
          maxOutputTokens: AI_CONFIG.MAX_TOKENS,
          topP: AI_CONFIG.TOP_P,
        },
      },
    });

    // 6. Stream the real AI response directly to the client
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
            // Model returned nothing — surface a real error, never a fake response
            controller.enqueue(
              encoder.encode(
                "⚠️ The AI model returned an empty response. Please try again."
              )
            );
          }

          controller.close();
        } catch (streamError) {
          console.error("[FlyRank AI] Streaming error:", streamError);
          controller.error(streamError);
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
  } catch (err: unknown) {
    console.error("[FlyRank AI Route Exception]", err);
    const errorMessage =
      err instanceof Error ? err.message : "An unexpected server error occurred.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
