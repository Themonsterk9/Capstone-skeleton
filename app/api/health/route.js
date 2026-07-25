import { NextResponse } from "next/server";
import { getSystemHealth } from "@/services/healthService";

export const dynamic = "force-dynamic";

/**
 * Next.js API Route handler for system diagnostics.
 */
export async function GET() {
  try {
    const health = await getSystemHealth();
    return NextResponse.json(health, {
      headers: {
        "Cache-Control": "no-store, max-age=0, must-revalidate",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { status: "ERROR", message: error.message },
      { status: 500 }
    );
  }
}
