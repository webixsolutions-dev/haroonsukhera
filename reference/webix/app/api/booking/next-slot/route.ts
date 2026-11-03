import { NextResponse } from "next/server";
import { getNextOpenStrategySlot } from "@/lib/booking/next-slot";

export const runtime = "nodejs";

export async function GET() {
  const result = await getNextOpenStrategySlot();

  return NextResponse.json(result, {
    headers: {
      "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200",
    },
  });
}
