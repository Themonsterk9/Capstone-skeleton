import { NextResponse } from "next/server";
import { getSystemHealth } from "@/services/healthService";
import { getCorsHeaders, handleCorsPreflight } from "@/lib/cors";

export const dynamic = "force-dynamic";

export async function OPTIONS(req) {
  return handleCorsPreflight(req);
}

/**
 * Next.js API Route handler for system diagnostics.
 */
export async function GET(req) {
  const corsHeaders = getCorsHeaders(req?.headers?.get("origin"));
  try {
    const health = await getSystemHealth();
    return NextResponse.json(health, {
      headers: {
        "Cache-Control": "no-store, max-age=0, must-revalidate",
        ...corsHeaders,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { status: "ERROR", message: "Health diagnostic request failed." },
      { status: 500, headers: corsHeaders }
    );
  }
}

