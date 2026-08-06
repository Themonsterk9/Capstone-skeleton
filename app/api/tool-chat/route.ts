import { NextRequest } from "next/server";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, createUIMessageStreamResponse, toUIMessageStream, isStepCount } from "ai";
import { AI_CONFIG } from "@/server/ai/model";
import { seoAuditTool } from "@/server/tools/seoAudit";

// Dedicated route for tool-enabled AI chat (FE-07)
export const dynamic = "force-dynamic";

const TOOL_SYSTEM_PROMPT = `
You are FlyRank AI — an elite SEO and web analytics assistant with access to powerful tools.

When the user asks you to audit, analyze, check, or review a website or URL, you MUST call the \`seoAudit\` tool with the exact URL they provide. Do not generate a text response for SEO audits — always use the tool.

After the tool returns results, briefly summarize the key findings in 2-3 sentences highlighting the SEO score and the most critical issues.

For non-audit questions, respond normally using your knowledge of SEO, web performance, and digital marketing.

Guidelines:
- Always use the seoAudit tool for any URL analysis request
- Be concise and actionable in your summaries
- Format any non-tool responses in clean Markdown
`.trim();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || !Array.isArray(body.messages) || body.messages.length === 0) {
      return Response.json(
        { error: "Invalid payload. 'messages' array is required." },
        { status: 400 }
      );
    }

    const geminiKey =
      process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;

    if (!geminiKey || geminiKey.trim() === "" || geminiKey.includes("your_gemini")) {
      return Response.json(
        { error: "AI provider is not configured. Please set GOOGLE_GENERATIVE_AI_API_KEY." },
        { status: 503 }
      );
    }

    const google = createGoogleGenerativeAI({ apiKey: geminiKey });
    const modelProvider = google(AI_CONFIG.PRIMARY_MODEL || "gemini-2.0-flash");

    // Sanitize incoming messages to only pass role + content (text parts)
    const cleanMessages = body.messages
      .filter(
        (m: { role?: string; content?: unknown }) =>
          m &&
          (m.role === "user" || m.role === "assistant") &&
          (typeof m.content === "string"
            ? m.content.trim()
            : Array.isArray(m.content)
              ? true
              : false)
      )
      .map((m: { role: string; content: unknown }) => ({
        role: m.role as "user" | "assistant",
        content:
          typeof m.content === "string"
            ? m.content
            : Array.isArray(m.content)
              ? m.content
              : String(m.content),
      }));

    const result = streamText({
      model: modelProvider,
      system: TOOL_SYSTEM_PROMPT,
      messages: cleanMessages,
      tools: {
        seoAudit: seoAuditTool,
      },
      toolChoice: "auto",
      stopWhen: isStepCount(3),
      temperature: 0.4,
      maxRetries: 1,
      abortSignal: req.signal,
      providerOptions: {
        google: {
          maxOutputTokens: AI_CONFIG.MAX_TOKENS,
        },
      },
    });

    // Use AI SDK's built-in UI message stream response
    // This encodes tool-call and tool-result parts in the stream protocol
    // that the client can parse using readUIMessageStream()
    return createUIMessageStreamResponse({
      stream: toUIMessageStream({
        stream: result.fullStream,
        sendStart: true,
        sendFinish: true,
      }),
    });
  } catch (err: unknown) {
    console.error("[FlyRank ToolChat Route Exception]", err);
    const errorMessage =
      err instanceof Error ? err.message : "An unexpected server error occurred.";
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}
