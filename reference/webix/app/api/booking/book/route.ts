import { NextResponse } from "next/server";
import { z } from "zod";
import { BOOKING_CONFIG } from "@/config/booking";
import {
  hasGoogleCalendarCredentials,
  getCalendarFreeBusy,
  createGoogleCalendarMeeting,
} from "@/lib/booking/google-calendar";
import { isSlotConflicting, isValidTimeZone } from "@/lib/booking/slot-engine";

export const runtime = "nodejs";

// Simple in-memory rate limiting map: ip -> Array of timestamps (ms)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_BOOKINGS_PER_HOUR = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const activeTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (activeTimestamps.length >= MAX_BOOKINGS_PER_HOUR) {
    return true;
  }

  activeTimestamps.push(now);
  rateLimitMap.set(ip, activeTimestamps);
  return false;
}

const BookSchema = z.object({
  meetingType: z.enum(["strategy", "intro", "partner"]).default("strategy"),
  slotIso: z.string().datetime(),
  visitorTz: z.string().default(BOOKING_CONFIG.hostTimeZone),
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Please enter a valid email address"),
  phone: z.string().trim().optional(),
  company: z.string().trim().optional(),
  services: z.array(z.string()).optional(),
  budget: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  honeypot: z.string().optional(),
  turnstileToken: z.string().optional(),
  sourcePage: z.string().optional(),
});

/**
 * Validates Cloudflare Turnstile token if secret key is configured.
 */
async function verifyTurnstile(token: string | undefined, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    // If turnstile secret is not configured in env, skip blocking in dev/preview
    return true;
  }
  if (!token) {
    return false;
  }

  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret,
          response: token,
          remoteip: ip,
        }),
      }
    );
    const result = (await res.json()) as { success: boolean };
    return result.success;
  } catch (err) {
    console.error("Turnstile verification error:", err);
    return false;
  }
}

export async function POST(request: Request) {
  // Extract client IP
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";

  // Check rate limit
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many booking attempts. Please try again in an hour or contact us on WhatsApp." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = BookSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.format() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Bot honeypot protection: if filled, silently discard
  if (data.honeypot && data.honeypot.trim().length > 0) {
    return NextResponse.json(
      {
        success: true,
        eventId: "bot-intercepted",
        message: "Booking confirmed.",
      },
      { status: 200 }
    );
  }

  // Verify Turnstile if provided
  const turnstileOk = await verifyTurnstile(data.turnstileToken, ip);
  if (!turnstileOk) {
    return NextResponse.json(
      { error: "Security verification failed. Please refresh and try again." },
      { status: 400 }
    );
  }

  const meetingConfig =
    BOOKING_CONFIG.meetingTypes.find((m) => m.slug === data.meetingType) ||
    BOOKING_CONFIG.meetingTypes[0];

  const slotStart = new Date(data.slotIso);
  const slotStartMs = slotStart.getTime();
  const slotEndMs = slotStartMs + meetingConfig.minutes * 60 * 1000;
  const slotEnd = new Date(slotEndMs);

  // Validate that slot is in future with minNotice
  const nowMs = Date.now();
  const minNoticeMs = nowMs + BOOKING_CONFIG.minNoticeHours * 3600 * 1000;
  if (slotStartMs < minNoticeMs) {
    return NextResponse.json(
      { error: `Appointments require at least ${BOOKING_CONFIG.minNoticeHours} hours advance notice.` },
      { status: 400 }
    );
  }

  const hasCredentials = hasGoogleCalendarCredentials();
  const isProd = process.env.NODE_ENV === "production";

  if (!hasCredentials && isProd) {
    return NextResponse.json(
      {
        error:
          "Online calendar is currently being upgraded. Please contact us directly on WhatsApp or email to reserve this time.",
      },
      { status: 503 }
    );
  }

  // Double-booking race prevention:
  // Re-check Google Calendar FreeBusy specifically around this slot window
  if (hasCredentials) {
    try {
      const windowMin = new Date(slotStartMs - 2 * 3600 * 1000).toISOString();
      const windowMax = new Date(slotEndMs + 2 * 3600 * 1000).toISOString();

      const busyList = await getCalendarFreeBusy(
        BOOKING_CONFIG.calendarId,
        windowMin,
        windowMax
      );

      const conflicts = busyList.some((busy) =>
        isSlotConflicting(
          slotStartMs,
          slotEndMs,
          new Date(busy.start).getTime(),
          new Date(busy.end).getTime()
        )
      );

      if (conflicts) {
        return NextResponse.json(
          { error: "That time was just taken — pick another" },
          { status: 409 }
        );
      }
    } catch (err) {
      console.error("FreeBusy pre-booking check error:", err);
    }
  }

  // Construct description per docs/06
  const description = [
    `Webix Solutions Strategy Call`,
    `--------------------------------------`,
    `Meeting Type: ${meetingConfig.title} (${meetingConfig.minutes} minutes)`,
    `Visitor Name: ${data.name}`,
    `Visitor Email: ${data.email}`,
    `WhatsApp / Phone: ${data.phone || "Not provided"}`,
    `Company Website: ${data.company || "Not provided"}`,
    `Services Needed: ${data.services && data.services.length > 0 ? data.services.join(", ") : "General Consultation"}`,
    `Monthly Budget: ${data.budget || "Not specified"}`,
    `Visitor Time Zone: ${data.visitorTz}`,
    `Source Page: ${data.sourcePage || "Direct"}`,
    `--------------------------------------`,
    `Project Notes / Goal:`,
    data.notes || "None provided",
  ].join("\n");

  const summary = `${meetingConfig.title} — ${data.name}${data.company ? ` (${data.company})` : ""}`;

  let createdEvent;
  if (hasCredentials) {
    try {
      createdEvent = await createGoogleCalendarMeeting({
        calendarId: BOOKING_CONFIG.calendarId,
        summary,
        description,
        startIso: slotStart.toISOString(),
        endIso: slotEnd.toISOString(),
        attendeeEmail: data.email,
        attendeeName: data.name,
        timeZone: isValidTimeZone(data.visitorTz) ? data.visitorTz : "UTC",
      });
    } catch (err) {
      console.error("Google Calendar event creation failed:", err);
      return NextResponse.json(
        {
          error: "Calendar event could not be scheduled. Please message us on WhatsApp to confirm instantly.",
        },
        { status: 500 }
      );
    }
  } else {
    // Development preview mock event
    createdEvent = {
      eventId: `mock-${Date.now()}`,
      meetUrl: "https://meet.google.com/mock-webix-call",
      startIso: slotStart.toISOString(),
      endIso: slotEnd.toISOString(),
      htmlLink: "https://calendar.google.com",
    };
  }

  // Optional: POST to internal Webix Ops CRM webhook
  if (process.env.CRM_WEBHOOK_URL) {
    fetch(process.env.CRM_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "booking_created",
        eventId: createdEvent.eventId,
        summary,
        meetUrl: createdEvent.meetUrl,
        ...data,
      }),
    }).catch((crmErr) => console.error("CRM Webhook dispatch error:", crmErr));
  }

  return NextResponse.json({
    success: true,
    eventId: createdEvent.eventId,
    meetUrl: createdEvent.meetUrl,
    startIso: createdEvent.startIso,
    endIso: createdEvent.endIso,
    summary,
    attendeeEmail: data.email,
    attendeeName: data.name,
    meetingType: data.meetingType,
    minutes: meetingConfig.minutes,
  });
}
