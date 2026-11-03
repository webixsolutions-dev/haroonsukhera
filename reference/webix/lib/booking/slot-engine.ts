/**
 * Slot Generation & Validation Engine
 * Per docs/06-booking-system.md:
 * - Deterministic candidate slots derived from BOOKING_CONFIG.weeklyHours (Asia/Karachi).
 * - Enforces minNoticeHours (12h), maxDaysAhead (30d), bufferMinutes (15m), maxPerDay (6).
 * - Filters conflicts against Google Calendar FreeBusy intervals.
 * - Formats output cleanly in the visitor's requested timezone.
 */

import { BOOKING_CONFIG, type MeetingTypeConfig } from "@/config/booking";
import type { FreeBusyInterval } from "./google-calendar";

export interface FormattedSlot {
  /** ISO-8601 UTC timestamp of slot start */
  iso: string;
  /** ISO-8601 UTC timestamp of slot end */
  endIso: string;
  /** Duration in minutes */
  durationMinutes: number;
  /** "YYYY-MM-DD" in the visitor's requested timezone */
  visitorDateKey: string;
  /** Formatted time in visitor's timezone, e.g. "11:00 AM" */
  visitorTimeFormatted: string;
  /** Timezone abbreviation, e.g. "EDT", "PST", "GST", "NZDT", "PKT" */
  visitorTzAbbr: string;
  /** "YYYY-MM-DD" in host timezone (Asia/Karachi) */
  hostDateKey: string;
  /** Formatted time in host timezone, e.g. "9:00 PM PKT" */
  hostTimeFormatted: string;
}

export interface SlotEngineOptions {
  meetingTypeSlug: "strategy" | "intro" | "partner";
  fromIsoDate: string; // "YYYY-MM-DD"
  toIsoDate: string;   // "YYYY-MM-DD"
  visitorTz: string;   // IANA timezone, e.g. "America/Toronto"
  busyIntervals?: FreeBusyInterval[];
  now?: Date;          // injected for deterministic testing
}

type DayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

const DAY_NAMES: DayKey[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

/**
 * Validates whether an IANA timezone string is recognized by the runtime.
 */
export function isValidTimeZone(tz: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

/**
 * Returns user-friendly abbreviation for regional timezones.
 */
export function getFriendlyTzAbbr(timeZone: string, standardAbbr: string): string {
  if (timeZone === "Asia/Karachi") return "PKT";
  if (timeZone === "Asia/Dubai") return "GST";
  if (timeZone === "Asia/Riyadh") return "AST";
  if (timeZone === "Pacific/Auckland") {
    if (standardAbbr === "GMT+13") return "NZDT";
    if (standardAbbr === "GMT+12") return "NZST";
  }
  return standardAbbr;
}

/**
 * Converts a date and time in PKT (UTC+5, zero DST) to a UTC Date object.
 */
export function pktToUtcDate(year: number, month1Indexed: number, day: number, hours: number, minutes: number): Date {
  return new Date(Date.UTC(year, month1Indexed - 1, day, hours - 5, minutes, 0, 0));
}

/**
 * Parse "HH:MM" into total minutes from start of day (0..1440).
 * "23:59" is treated as 1440 (end of day) so a 30m slot starting at 23:30 fits.
 */
function parseTimeToMinutes(timeStr: string): number {
  if (timeStr === "23:59" || timeStr === "24:00") return 1440;
  const [hStr, mStr] = timeStr.split(":");
  return parseInt(hStr, 10) * 60 + parseInt(mStr, 10);
}

/**
 * Formats a UTC date into the given timezone using Intl.DateTimeFormat.
 */
export function formatInTimeZone(
  date: Date,
  timeZone: string
): {
  dateKey: string;
  timeFormatted: string;
  tzAbbr: string;
} {
  const safeTz = isValidTimeZone(timeZone) ? timeZone : "UTC";

  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: safeTz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  });

  const parts = dtf.formatToParts(date);
  let year = "";
  let month = "";
  let day = "";
  let hour = "";
  let minute = "";
  let dayPeriod = "";
  let timeZoneName = "";

  for (const p of parts) {
    if (p.type === "year") year = p.value;
    else if (p.type === "month") month = p.value;
    else if (p.type === "day") day = p.value;
    else if (p.type === "hour") hour = p.value;
    else if (p.type === "minute") minute = p.value;
    else if (p.type === "dayPeriod") dayPeriod = p.value;
    else if (p.type === "timeZoneName") timeZoneName = p.value;
  }

  const dateKey = `${year}-${month}-${day}`;
  const timeFormatted = `${hour}:${minute} ${dayPeriod}`;
  const tzAbbr = getFriendlyTzAbbr(safeTz, timeZoneName || safeTz);

  return {
    dateKey,
    timeFormatted,
    tzAbbr,
  };
}

/**
 * Checks if a slot interval [slotStart, slotEnd] overlaps with a busy interval [busyStart, busyEnd]
 * taking into account the required bufferMinutes before and after.
 */
export function isSlotConflicting(
  slotStartMs: number,
  slotEndMs: number,
  busyStartMs: number,
  busyEndMs: number,
  bufferMinutes = BOOKING_CONFIG.bufferMinutes
): boolean {
  const bufferMs = bufferMinutes * 60 * 1000;
  return slotStartMs < busyEndMs + bufferMs && slotEndMs > busyStartMs - bufferMs;
}

/**
 * Main slot generation function.
 */
export function generateAvailableSlots(options: SlotEngineOptions): FormattedSlot[] {
  const now = options.now || new Date();
  const safeVisitorTz = isValidTimeZone(options.visitorTz)
    ? options.visitorTz
    : BOOKING_CONFIG.hostTimeZone;

  const meetingConfig: MeetingTypeConfig =
    BOOKING_CONFIG.meetingTypes.find((m) => m.slug === options.meetingTypeSlug) ||
    BOOKING_CONFIG.meetingTypes[0];

  const durationMinutes = meetingConfig.minutes;
  const durationMs = durationMinutes * 60 * 1000;
  const minNoticeMs = now.getTime() + BOOKING_CONFIG.minNoticeHours * 3600 * 1000;
  const maxNoticeMs = now.getTime() + BOOKING_CONFIG.maxDaysAhead * 24 * 3600 * 1000;

  // Normalize range dates
  const fromParts = options.fromIsoDate.split("-").map(Number);
  const toParts = options.toIsoDate.split("-").map(Number);

  // Parse start and end dates in PKT host calendar (expanded by 1 day on each side)
  const startPkt = new Date(Date.UTC(fromParts[0], fromParts[1] - 1, fromParts[2]));
  startPkt.setUTCDate(startPkt.getUTCDate() - 1);

  const endPkt = new Date(Date.UTC(toParts[0], toParts[1] - 1, toParts[2]));
  endPkt.setUTCDate(endPkt.getUTCDate() + 1);

  const parsedBusyIntervals = (options.busyIntervals || []).map((b) => ({
    startMs: new Date(b.start).getTime(),
    endMs: new Date(b.end).getTime(),
  }));

  // Track meetings per host date to enforce maxPerDay
  const meetingsPerHostDay = new Map<string, number>();

  for (const b of parsedBusyIntervals) {
    const d = new Date(b.startMs);
    const hostInfo = formatInTimeZone(d, BOOKING_CONFIG.hostTimeZone);
    const count = meetingsPerHostDay.get(hostInfo.dateKey) || 0;
    meetingsPerHostDay.set(hostInfo.dateKey, count + 1);
  }

  const results: FormattedSlot[] = [];
  const currentCursor = new Date(startPkt);

  while (currentCursor <= endPkt) {
    const y = currentCursor.getUTCFullYear();
    const m = currentCursor.getUTCMonth() + 1;
    const d = currentCursor.getUTCDate();
    const hostDateKey = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

    // Skip blackout dates
    if (BOOKING_CONFIG.blackoutDates.includes(hostDateKey)) {
      currentCursor.setUTCDate(currentCursor.getUTCDate() + 1);
      continue;
    }

    // Skip days exceeding maxPerDay
    const currentDayMeetingCount = meetingsPerHostDay.get(hostDateKey) || 0;
    if (currentDayMeetingCount >= BOOKING_CONFIG.maxPerDay) {
      currentCursor.setUTCDate(currentCursor.getUTCDate() + 1);
      continue;
    }

    const dayOfWeekIndex = currentCursor.getUTCDay();
    const dayKey = DAY_NAMES[dayOfWeekIndex];
    const windows = BOOKING_CONFIG.weeklyHours[dayKey] || [];

    for (const [windowStart, windowEnd] of windows) {
      const windowStartMin = parseTimeToMinutes(windowStart);
      const windowEndMin = parseTimeToMinutes(windowEnd);

      for (
        let cursorMin = windowStartMin;
        cursorMin + durationMinutes <= windowEndMin;
        cursorMin += BOOKING_CONFIG.slotStepMinutes
      ) {
        const h = Math.floor(cursorMin / 60);
        const min = cursorMin % 60;

        const slotStartDate = pktToUtcDate(y, m, d, h, min);
        const slotStartMs = slotStartDate.getTime();
        const slotEndMs = slotStartMs + durationMs;

        // Rule: Notice checks
        if (slotStartMs < minNoticeMs || slotStartMs > maxNoticeMs) {
          continue;
        }

        // Rule: FreeBusy conflict checks (with buffer)
        let isBlocked = false;
        for (const busy of parsedBusyIntervals) {
          if (isSlotConflicting(slotStartMs, slotEndMs, busy.startMs, busy.endMs)) {
            isBlocked = true;
            break;
          }
        }

        if (isBlocked) {
          continue;
        }

        // Format for visitor timezone and host timezone
        const visitorFmt = formatInTimeZone(slotStartDate, safeVisitorTz);
        const hostFmt = formatInTimeZone(slotStartDate, BOOKING_CONFIG.hostTimeZone);

        // Filter: only include slots that fall within the visitor's requested date window
        if (
          visitorFmt.dateKey < options.fromIsoDate ||
          visitorFmt.dateKey > options.toIsoDate
        ) {
          continue;
        }

        results.push({
          iso: slotStartDate.toISOString(),
          endIso: new Date(slotEndMs).toISOString(),
          durationMinutes,
          visitorDateKey: visitorFmt.dateKey,
          visitorTimeFormatted: visitorFmt.timeFormatted,
          visitorTzAbbr: visitorFmt.tzAbbr,
          hostDateKey: hostFmt.dateKey,
          hostTimeFormatted: `${hostFmt.timeFormatted} PKT`,
        });
      }
    }

    currentCursor.setUTCDate(currentCursor.getUTCDate() + 1);
  }

  // Sort chronologically
  results.sort((a, b) => new Date(a.iso).getTime() - new Date(b.iso).getTime());

  return results;
}
