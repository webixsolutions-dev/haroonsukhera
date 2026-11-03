/**
 * Booking configuration — exact specification from docs/06-booking-system.md
 * and User Corrections (Turn 4).
 * All hours are in host-local time (Asia/Karachi, PKT).
 */

export interface MeetingTypeConfig {
  slug: "strategy" | "intro" | "partner";
  title: string;
  minutes: number;
  description: string;
  default?: boolean;
}

export const BOOKING_CONFIG = {
  hostName: "Haroon Sukhera & Senior Technical Leads",
  hostEmail: "info@webixsolutions.com",
  calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
  hostTimeZone: "Asia/Karachi",
  // Two coordinated shifts in PKT (UTC+5):
  // 10:00–13:00 PKT = 9:00 AM–12:00 PM Dubai (GST)
  // 21:00–23:59 PKT = 11:00 AM–2:00 PM Toronto / 8:00–11:00 AM Los Angeles
  // 00:00–02:00 PKT = 2:00–4:00 PM Toronto / 8:00–10:00 AM Auckland
  weeklyHours: {
    mon: [
      ["10:00", "13:00"],
      ["21:00", "23:59"],
    ],
    tue: [
      ["00:00", "02:00"],
      ["10:00", "13:00"],
      ["21:00", "23:59"],
    ],
    wed: [
      ["00:00", "02:00"],
      ["10:00", "13:00"],
      ["21:00", "23:59"],
    ],
    thu: [
      ["00:00", "02:00"],
      ["10:00", "13:00"],
      ["21:00", "23:59"],
    ],
    fri: [
      ["00:00", "02:00"],
      ["10:00", "12:00"],
      ["21:00", "23:59"],
    ],
    sat: [
      ["00:00", "02:00"], // = Friday afternoon in North America
    ],
    sun: [] as [string, string][],
  },
  slotStepMinutes: 30,
  bufferMinutes: 15, // before and after each meeting
  minNoticeHours: 12,
  maxDaysAhead: 30,
  maxPerDay: 6,
  blackoutDates: [] as string[], // e.g. "2026-12-25"
  meetingTypes: [
    {
      slug: "strategy",
      title: "Strategy Call",
      minutes: 30,
      description: "Deep dive into your website, ad performance or AI automation roadmap. We deliver a clear written scope and price.",
      default: true,
    },
    {
      slug: "intro",
      title: "Quick Intro",
      minutes: 15,
      description: "Fast 15-minute alignment to see if our capabilities and time zone match your immediate project requirements.",
    },
    {
      slug: "partner",
      title: "Partner Call",
      minutes: 45,
      description: "Confidential scoping for agencies and IT firms exploring white-label outsourcing and dedicated monthly capacity.",
    },
  ] as MeetingTypeConfig[],
};
