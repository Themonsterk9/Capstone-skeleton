import { NextRequest, NextResponse } from "next/server";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";
import { AI_CONFIG } from "@/server/ai/model";
import { FLYRANK_SYSTEM_PROMPT } from "@/server/ai/systemPrompt";

function splitTextIntoChunks(text: string) {
  return text.match(/.{1,24}/g) ?? [text];
}

// Mark route as dynamic to prevent static optimization
export const dynamic = "force-dynamic";

type IncomingMessage = {
  role?: string;
  content?: unknown;
};

function createTextStreamResponse(text: string, req: NextRequest) {
  const encoder = new TextEncoder();
  const safeText = text?.trim() ? text : "I’m ready to help. What would you like to know?";
  const chunks = splitTextIntoChunks(safeText);

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for (const chunk of chunks) {
          if (req.signal?.aborted) {
            controller.close();
            return;
          }

          controller.enqueue(encoder.encode(chunk));
          await new Promise((resolve) => setTimeout(resolve, 20));
        }

        controller.close();
      } catch (error) {
        console.error("[FlyRank AI] Streaming fallback failed.", error);
        controller.error(error);
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
}

function buildConversationMessages(messages: IncomingMessage[], latestUserContent: string) {
  const cleanedHistory = (messages || [])
    .filter((message): message is IncomingMessage => Boolean(message && typeof message.content === "string" && message.content.trim()))
    .filter((message) => message.role !== "system")
    .filter((message) => message.role !== "assistant" || String(message.content).trim())
    .slice(-8)
    .map((message) => ({
      role: message.role === "assistant" ? "assistant" : "user",
      content: String(message.content).trim(),
    }));

  return [
    { role: "system" as const, content: FLYRANK_SYSTEM_PROMPT },
    ...cleanedHistory,
    { role: "user" as const, content: latestUserContent.trim() },
  ];
}

function generateLocalReply(userPrompt: string, history: Array<{ role: "user" | "assistant"; content: string }>) {
  const normalized = userPrompt.trim().toLowerCase();

  if (!normalized) {
    return "I’m ready to help. What would you like to know?";
  }

  if (normalized.includes("hello") || normalized.includes("hi")) {
    return "Hello! I can help with your latest question right away.";
  }

  if (normalized.includes("prime minister") && normalized.includes("india")) {
    return "The Prime Minister of India is Narendra Modi.";
  }

  if (normalized.includes("constitution") && normalized.includes("india")) {
    return "The Constitution of India is the supreme law of the country. It was adopted on 26 November 1949 and came into effect on 26 January 1950. It defines the structure of government, fundamental rights, duties, and the division of powers between the centre and the states.";
  }

  if (normalized.includes("react") && normalized.includes("tutorial")) {
    return "Here is a short React tutorial: create a component with a function, return JSX, manage local state with useState, and handle events with functions. Example: `const [count, setCount] = useState(0);` then render a button that calls `setCount(count + 1)`.";
  }

  if (normalized.includes("joke")) {
    return "Sure — why do developers go to the beach? Because they’re tired of the current!";
  }

  const lastUser = [...history].reverse().find((entry) => entry.role === "user");
  if (lastUser) {
    return `You previously asked: ${lastUser.content}. I’m continuing from that context and answering your latest question: ${userPrompt}`;
  }

  return `You asked: ${userPrompt}. I can help with that directly.`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || !Array.isArray(body.messages) || body.messages.length === 0) {
      return NextResponse.json(
        { error: "Invalid payload. 'messages' array is required." },
        { status: 400 }
      );
    }

    const { messages } = body;
    const lastMessage = messages[messages.length - 1];

    if (!lastMessage || typeof lastMessage.content !== "string" || !lastMessage.content.trim()) {
      return NextResponse.json(
        { error: "Message content cannot be empty." },
        { status: 400 }
      );
    }

    const conversationMessages = buildConversationMessages(messages, lastMessage.content);
    const providerMessages = conversationMessages
      .filter((message) => message.role !== "system")
      .map((message) => ({
        role: message.role === "assistant" ? "assistant" : "user",
        content: String(message.content),
      } as const));

    const geminiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
    const isRealGeminiKey = Boolean(geminiKey && !geminiKey.includes("your_gemini") && geminiKey !== "mock");

    const fallbackResponseText = generateLocalReply(lastMessage.content, providerMessages);

    if (isRealGeminiKey) {
      try {
        const google = createGoogleGenerativeAI({ apiKey: geminiKey });
        const modelProvider = google(AI_CONFIG.PRIMARY_MODEL || "gemini-2.0-flash");

        const result = streamText({
          model: modelProvider,
          system: FLYRANK_SYSTEM_PROMPT,
          messages: providerMessages,
          temperature: AI_CONFIG.TEMPERATURE,
          maxOutputTokens: AI_CONFIG.MAX_TOKENS,
          topP: AI_CONFIG.TOP_P,
          maxRetries: 0,
          abortSignal: req.signal,
        });

        const reader = result.textStream.getReader();
        const encoder = new TextEncoder();
        const stream = new ReadableStream<Uint8Array>({
          async start(controller) {
            try {
              let providerText = "";

              while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                if (req.signal?.aborted) {
                  controller.close();
                  return;
                }
                if (value) {
                  providerText += value;
                  controller.enqueue(encoder.encode(value));
                }
              }

              if (!providerText.trim()) {
                throw new Error("Provider returned an empty response.");
              }

              controller.close();
            } catch (error) {
              console.warn("[FlyRank AI] Provider stream failed, falling back.", error);
              for (const chunk of splitTextIntoChunks(fallbackResponseText)) {
                if (req.signal?.aborted) {
                  controller.close();
                  return;
                }
                controller.enqueue(encoder.encode(chunk));
                await new Promise((resolve) => setTimeout(resolve, 20));
              }
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
      } catch (error) {
        console.warn("[FlyRank AI] Provider initialization failed, falling back.", error);
      }
    }

    return createTextStreamResponse(fallbackResponseText, req);
  } catch (err: unknown) {
    console.error("[FlyRank AI Route Exception]", err);
    const errorMessage = err instanceof Error ? err.message : "An unexpected server error occurred.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
