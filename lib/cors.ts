/**
 * Cross-Origin Resource Sharing (CORS) & Security Headers Utility
 */

export function getCorsHeaders(requestOrigin?: string | null): Record<string, string> {
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_APP_URL,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ].filter(Boolean) as string[];

  const isAllowed =
    requestOrigin &&
    allowedOrigins.some(
      (origin) => origin.replace(/\/$/, "") === requestOrigin.replace(/\/$/, "")
    );

  const originHeader = isAllowed ? (requestOrigin as string) : allowedOrigins[0] || "*";

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
