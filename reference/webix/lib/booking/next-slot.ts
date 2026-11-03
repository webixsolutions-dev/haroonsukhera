import { BOOKING_CONFIG } from "@/config/booking";
import { SITE_FACTS } from "@/content/site-facts";
import {
  hasGoogleCalendarCredentials,
  getCalendarFreeBusy,
} from "./google-calendar";
import { generateAvailableSlots } from "./slot-engine";

export interface NextSlotResult {
  mode: "slot" | "fallback";
  /** ISO-8601 UTC timestamp when mode === "slot" */
  slotIso?: string;
  /** Server-rendered fallback text in Eastern Time (America/New_York) when mode === "slot" */
  easternTimeFormatted?: string;
  durationMinutes: number;
  meetingTitle: string;
  /** Used when mode === "fallback" (production without Google Calendar credentials) */
  fallbackMessage?: string;
  whatsappUrl: string;
  email: string;
  phoneDisplay: string;
}

/**
 * Formats an ISO UTC timestamp in America/New_York (EDT/EST) for SSR fallback text.
 */
export function formatSlotInEasternTime(iso: string): string {
  const date = new Date(iso);
  const datePart = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);
  const timePart = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  }).format(date);
  return `${datePart} · ${timePart}`;
}

/**
 * Server function for Hero Growth Console Signal 4 & Booking Placeholder.
 * Rules (from docs/06 and User Corrections):
 * - Deterministic slot stub is allowed ONLY when NODE_ENV !== "production".
 * - In production without Google Calendar credentials, returns `mode: "fallback"`
 *   (WhatsApp / email direct booking) — never fake slots.
 * - When Google Calendar credentials are present, queries real live availability.
 */
export async function getNextOpenStrategySlot(): Promise<NextSlotResult> {
  const hasCredentials = hasGoogleCalendarCredentials();
  const isProd = process.env.NODE_ENV === "production";

  if (!hasCredentials && isProd) {
    return {
      mode: "fallback",
      durationMinutes: 30,
      meetingTitle: "Free Strategy Call (30 min)",
      fallbackMessage:
        "Pick a time on WhatsApp or email — we work Eastern, Pacific, UAE, NZ and Pakistan hours.",
      whatsappUrl: SITE_FACTS.contact.whatsappUrl,
      email: SITE_FACTS.contact.email,
      phoneDisplay: SITE_FACTS.contact.phoneDisplay,
    };
  }

  try {
    const now = new Date();
    // Query window: from now up to 14 days ahead
    const fromStr = now.toISOString().split("T")[0];
    const futureDate = new Date(now.getTime() + 14 * 24 * 3600 * 1000);
    const toStr = futureDate.toISOString().split("T")[0];

    let busyIntervals: Array<{ start: string; end: string }> = [];
    if (hasCredentials) {
      busyIntervals = await getCalendarFreeBusy(
        BOOKING_CONFIG.calendarId,
        now.toISOString(),
        futureDate.toISOString()
      );
    }

    const availableSlots = generateAvailableSlots({
      meetingTypeSlug: "strategy",
      fromIsoDate: fromStr,
      toIsoDate: toStr,
      visitorTz: "America/New_York",
      busyIntervals,
      now,
    });

    if (availableSlots.length > 0) {
      const firstSlot = availableSlots[0];
      return {
        mode: "slot",
        slotIso: firstSlot.iso,
        easternTimeFormatted: formatSlotInEasternTime(firstSlot.iso),
        durationMinutes: 30,
        meetingTitle: "Free Strategy Call (30 min)",
        whatsappUrl: SITE_FACTS.contact.whatsappUrl,
        email: SITE_FACTS.contact.email,
        phoneDisplay: SITE_FACTS.contact.phoneDisplay,
      };
    }
  } catch (err) {
    console.error("Error retrieving next open strategy slot:", err);
  }

  // If no slots found or error in production, return fallback
  if (isProd) {
    return {
      mode: "fallback",
      durationMinutes: 30,
      meetingTitle: "Free Strategy Call (30 min)",
      fallbackMessage:
        "Pick a time on WhatsApp or email — we work Eastern, Pacific, UAE, NZ and Pakistan hours.",
      whatsappUrl: SITE_FACTS.contact.whatsappUrl,
      email: SITE_FACTS.contact.email,
      phoneDisplay: SITE_FACTS.contact.phoneDisplay,
    };
  }

  // Dev fallback with candidate slot
  const devNow = new Date();
  const minStartMs = devNow.getTime() + BOOKING_CONFIG.minNoticeHours * 3600 * 1000;
  const candidate = new Date(minStartMs);
  candidate.setUTCHours(16, 0, 0, 0); // 21:00 PKT
  if (candidate.getTime() <= minStartMs) {
    candidate.setUTCDate(candidate.getUTCDate() + 1);
  }
  while (candidate.getUTCDay() === 0 || candidate.getUTCDay() === 6) {
    candidate.setUTCDate(candidate.getUTCDate() + 1);
  }
  const fallbackIso = candidate.toISOString();

  return {
    mode: "slot",
    slotIso: fallbackIso,
    easternTimeFormatted: formatSlotInEasternTime(fallbackIso),
    durationMinutes: 30,
    meetingTitle: "Free Strategy Call (30 min)",
    whatsappUrl: SITE_FACTS.contact.whatsappUrl,
    email: SITE_FACTS.contact.email,
    phoneDisplay: SITE_FACTS.contact.phoneDisplay,
  };
}
