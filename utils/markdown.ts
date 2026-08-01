/**
 * Utilities for handling streaming Markdown gracefully without visual jumps or unclosed tags.
 */

/**
 * Sanitizes and fixes unclosed Markdown structures during active streaming.
 * For example: unclosed code blocks (```), bold (**), or italic (*).
 */
export function sanitizeStreamingMarkdown(rawText: string, isStreaming: boolean): string {
  if (!rawText) return "";
  if (!isStreaming) return rawText;

  let text = rawText;

  // 1. Check code blocks: count occurrences of triple backticks ```
  const codeBlockMatches = text.match(/```/g);
  if (codeBlockMatches && codeBlockMatches.length % 2 !== 0) {
    // We have an unclosed code block, append a closing fence so react-markdown parses it correctly
    text += "\n```";
  }

  // 2. Check for trailing single backtick inside inline code
  const inlineBackticks = (text.match(/`/g) || []).length;
  if (inlineBackticks % 2 !== 0) {
    text += "`";
  }

  // 3. Check for incomplete bold formatting (** at the end)
  if (text.endsWith("**")) {
    text = text.slice(0, -2);
  } else if (text.endsWith("*")) {
    text = text.slice(0, -1);
  }

  return text;
}

/**
 * Extracts pure plain text from a Markdown string for previewing or copy operations.
 */
export function extractPlainTextFromMarkdown(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, "[Code Block]")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/#+\s/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .trim();
}
