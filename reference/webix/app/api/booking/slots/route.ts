import { NextResponse } from "next/server";
import { z } from "zod";
import { BOOKING_CONFIG } from "@/config/booking";
import {
  hasGoogleCalendarCredentials,
  getCalendarFreeBusy,
} from "@/lib/booking/google-calendar";
import {
  generateAvailableSlots,
  isValidTimeZone,
} from "@/lib/booking/slot-engine";

export const runtime = "nodejs";

const QuerySchema = z.object({
  type: z.enum(["strategy", "intro", "partner"]).default("strategy"),
  from: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  to: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  tz: z.string().default(BOOKING_CONFIG.hostTimeZone),
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = QuerySchema.safeParse({
    type: url.searchParams.get("type") || "strategy",
    from: url.searchParams.get("from") || undefined,
    to: url.searchParams.get("to") || undefined,
    tz: url.searchParams.get("tz") || BOOKING_CONFIG.hostTimeZone,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query parameters", details: parsed.error.format() },
      { status: 400 }
    );
  }

  const { type, tz } = parsed.data;
  const visitorTz = isValidTimeZone(tz) ? tz : BOOKING_CONFIG.hostTimeZone;

  const now = new Date();
  const defaultFrom = now.toISOString().split("T")[0];
  const maxRangeDate = new Date(
    now.getTime() + BOOKING_CONFIG.maxDaysAhead * 24 * 3600 * 1000
  );
  const defaultTo = maxRangeDate.toISOString().split("T")[0];

  const fromDate = parsed.data.from || defaultFrom;
  const toDate = parsed.data.to || defaultTo;

  const hasCredentials = hasGoogleCalendarCredentials();
  const isProd = process.env.NODE_ENV === "production";

  // Rule (Correction #2): In production without Google credentials, signal fallback
  if (!hasCredentials && isProd) {
    return NextResponse.json(
      {
        slots: [],
        configured: false,
        fallback: true,
        meetingType: type,
        visitorTz,
        message:
          "Live calendar is currently transitioning. Please choose a time via direct WhatsApp or email.",
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  }

  try {
    let busyIntervals: Array<{ start: string; end: string }> = [];

    if (hasCredentials) {
      // Query Google Calendar FreeBusy
      const timeMin = new Date(`${fromDate}T00:00:00Z`).toISOString();
      const timeMax = new Date(`${toDate}T23:59:59Z`).toISOString();
      busyIntervals = await getCalendarFreeBusy(
        BOOKING_CONFIG.calendarId,
        timeMin,
        timeMax
      );
    }

    const slots = generateAvailableSlots({
      meetingTypeSlug: type,
      fromIsoDate: fromDate,
      toIsoDate: toDate,
      visitorTz,
      busyIntervals,
      now,
    });

    return NextResponse.json(
      {
        slots,
        configured: hasCredentials,
        fallback: false,
        meetingType: type,
        visitorTz,
        total: slots.length,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  } catch (error) {
    console.error("Booking slots generation error:", error);
    return NextResponse.json(
      {
        slots: [],
        configured: false,
        error: "Unable to retrieve availability at this moment.",
      },
      { status: 500 }
    );
  }
}
