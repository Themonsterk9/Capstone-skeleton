/**
 * Cross-Origin Resource Sharing (CORS) & Security Headers Utility
 * Optimized for Render production deployment with Vercel frontend origin support.
 */

export function getCorsHeaders(requestOrigin?: string | null): Record<string, string> {
  const rawOrigins = [
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.CLIENT_URL,
    process.env.FRONTEND_URL,
    process.env.VERCEL_URL ? (process.env.VERCEL_URL.startsWith("http") ? process.env.VERCEL_URL : `https://${process.env.VERCEL_URL}`) : null,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ].filter(Boolean) as string[];

  let isAllowed = false;

  if (requestOrigin) {
    const normalizedReqOrigin = requestOrigin.replace(/\/$/, "");
    isAllowed = rawOrigins.some(
      (origin) => origin.replace(/\/$/, "") === normalizedReqOrigin
    );

    if (!isAllowed) {
      try {
        const urlObj = new URL(requestOrigin);
        if (
          /\.vercel\.app$/i.test(urlObj.hostname) ||
          urlObj.hostname === "localhost" ||
          urlObj.hostname === "127.0.0.1"
        ) {
          isAllowed = true;
        }
      } catch {
        isAllowed = false;
      }
    }
  }

  const originHeader = isAllowed ? (requestOrigin as string) : rawOrigins[0] || "*";

  return {
    "Access-Control-Allow-Origin": originHeader,
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
    "Access-Control-Max-Age": "86400",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
  };
}

export function handleCorsPreflight(req: Request): Response {
  const origin = req.headers.get("origin");
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(origin),
  });
}
