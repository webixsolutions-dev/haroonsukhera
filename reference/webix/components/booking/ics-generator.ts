/**
 * Generates an .ics iCalendar file string for client download.
 */

export interface IcsEventOptions {
  title: string;
  description: string;
  startIso: string;
  endIso: string;
  location?: string;
  url?: string;
}

function formatUtcForIcs(isoString: string): string {
  const d = new Date(isoString);
  return d
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

export function generateIcsContent(options: IcsEventOptions): string {
  const uid = `webix-${Date.now()}@webixsolutions.com`;
  const dtStamp = formatUtcForIcs(new Date().toISOString());
  const dtStart = formatUtcForIcs(options.startIso);
  const dtEnd = formatUtcForIcs(options.endIso);

  // Clean description and title for ICS (escaping special characters)
  const cleanSummary = options.title.replace(/[\r\n]+/g, " ");
  const cleanDesc = options.description
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Webix Solutions//Booking System//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${cleanSummary}`,
    `DESCRIPTION:${cleanDesc}`,
    options.location ? `LOCATION:${options.location}` : "",
    options.url ? `URL:${options.url}` : "",
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);

  return lines.join("\r\n");
}

export function downloadIcsFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function getGoogleCalendarAddUrl(options: IcsEventOptions): string {
  const dtStart = formatUtcForIcs(options.startIso);
  const dtEnd = formatUtcForIcs(options.endIso);

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: options.title,
    dates: `${dtStart}/${dtEnd}`,
    details: options.description,
  });

  if (options.location) {
    params.set("location", options.location);
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
