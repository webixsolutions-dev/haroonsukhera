/**
 * Build/Render-time timezone conversion utilities using native Intl.DateTimeFormat.
 * Converts Pakistan Standard Time (Asia/Karachi, UTC+5, no DST) into target IANA zones
 * (America/New_York, America/Los_Angeles, Asia/Dubai, Pacific/Auckland) so DST (EDT vs EST,
 * PDT vs PST, NZDT vs NZST) is always accurate and never mixed.
 */

export interface ComputedShiftTable {
  referenceDateIso: string;
  etZoneShort: string;
  ptZoneShort: string;
  gstZoneShort: string;
  nztZoneShort: string;
  dayShift: {
    pkt: string;
    et: string;
    pt: string;
    gst: string;
    nzt: string;
    markets: string;
  };
  nightShift: {
    pkt: string;
    et: string;
    pt: string;
    gst: string;
    nzt: string;
    markets: string;
  };
}

/**
 * Creates a UTC Date corresponding to a given hour:minute in Asia/Karachi (UTC+5)
 * on the current date.
 */
function pktHourToDate(pktHour: number, pktMinute = 0, baseDate = new Date()): Date {
  const year = baseDate.getUTCFullYear();
  const month = baseDate.getUTCMonth();
  const day = baseDate.getUTCDate();
  // PKT is UTC+5 year-round
  return new Date(Date.UTC(year, month, day, pktHour - 5, pktMinute, 0));
}

function formatHourInZone(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

function getShortZoneName(date: Date, timeZone: string, fallback: string): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "short",
  }).formatToParts(date);
  return parts.find((p) => p.type === "timeZoneName")?.value ?? fallback;
}

export function getComputedShiftTable(baseDate = new Date()): ComputedShiftTable {
  // Day shift starts at 9:00 AM PKT (end time is [CONFIRM])
  const dayStart = pktHourToDate(9, 0, baseDate);

  // Night shift runs 9:00 PM PKT (21:00) to 5:00 AM PKT next day (29:00)
  const nightStart = pktHourToDate(21, 0, baseDate);
  const nightEnd = pktHourToDate(29, 0, baseDate);

  const etShort = getShortZoneName(nightStart, "America/New_York", "ET");
  const ptShort = getShortZoneName(nightStart, "America/Los_Angeles", "PT");
  const gstShort = "GST";
  const nztShort = getShortZoneName(nightStart, "Pacific/Auckland", "NZT");

  return {
    referenceDateIso: baseDate.toISOString().slice(0, 10),
    etZoneShort: etShort,
    ptZoneShort: ptShort,
    gstZoneShort: gstShort,
    nztZoneShort: nztShort,
    dayShift: {
      pkt: "From 9:00 AM PKT",
      et: `From ${formatHourInZone(dayStart, "America/New_York")} ${etShort}`,
      pt: `From ${formatHourInZone(dayStart, "America/Los_Angeles")} ${ptShort}`,
      gst: `From ${formatHourInZone(dayStart, "Asia/Dubai")} ${gstShort}`,
      nzt: `From ${formatHourInZone(dayStart, "Pacific/Auckland")} ${nztShort}`,
      markets: "United Arab Emirates · Pakistan",
    },
    nightShift: {
      pkt: "9:00 PM – 5:00 AM PKT",
      et: `${formatHourInZone(nightStart, "America/New_York")} – ${formatHourInZone(
        nightEnd,
        "America/New_York"
      )} ${etShort}`,
      pt: `${formatHourInZone(
        nightStart,
        "America/Los_Angeles"
      )} – ${formatHourInZone(nightEnd, "America/Los_Angeles")} ${ptShort}`,
      gst: `${formatHourInZone(nightStart, "Asia/Dubai")} – ${formatHourInZone(
        nightEnd,
        "Asia/Dubai"
      )} ${gstShort}`,
      nzt: `${formatHourInZone(
        nightStart,
        "Pacific/Auckland"
      )} – ${formatHourInZone(nightEnd, "Pacific/Auckland")} ${nztShort}`,
      markets: "Canada · United States · New Zealand",
    },
  };
}
