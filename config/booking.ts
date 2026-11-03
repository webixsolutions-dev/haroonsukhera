/**
 * Booking configuration for Haroon Sukhera site.
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
  hostName: "Haroon Sukhera",
  hostEmail: "haroonsukheraofficial@gmail.com",
  calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
  hostTimeZone: "Asia/Karachi",
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
      ["00:00", "02:00"],
    ],
    sun: [] as [string, string][],
  },
  slotStepMinutes: 30,
  bufferMinutes: 15,
  minNoticeHours: 12,
  maxDaysAhead: 30,
  maxPerDay: 6,
  blackoutDates: [] as string[],
  meetingTypes: [
    {
      slug: "strategy",
      title: "Strategy Call",
      minutes: 20,
      description: "Direct discussion on your web platform, store or automation requirements.",
      default: true,
    },
    {
      slug: "intro",
      title: "Quick Intro",
      minutes: 15,
      description: "Short introductory call to meet Haroon and review project goals.",
    },
    {
      slug: "partner",
      title: "Agency Partner Call",
      minutes: 30,
      description: "Confidential call for agency founders exploring white-label delivery.",
    },
  ] as MeetingTypeConfig[],
};
