/**
 * Google Calendar API Client
 * Per docs/06-booking-system.md:
 * - Uses OAuth refresh token flow for the Webix Google account that owns the calendar.
 * - getCalendarFreeBusy: queries Google Calendar freeBusy endpoint.
 * - createGoogleCalendarMeeting: creates event with conferenceData (Google Meet) & sendUpdates="all".
 * - Graceful fallback when credentials are not configured.
 */

export interface FreeBusyInterval {
  start: string; // ISO string
  end: string;   // ISO string
}

export interface CreateMeetingParams {
  calendarId?: string;
  summary: string;
  description: string;
  startIso: string;
  endIso: string;
  attendeeEmail: string;
  attendeeName: string;
  timeZone?: string;
}

export interface CreateMeetingResult {
  eventId: string;
  meetUrl?: string;
  startIso: string;
  endIso: string;
  htmlLink?: string;
}

interface CachedToken {
  accessToken: string;
  expiresAt: number; // unix ms
}

let cachedOAuthToken: CachedToken | null = null;

/**
 * Checks whether Google Calendar API credentials are present in environment.
 */
export function hasGoogleCalendarCredentials(): boolean {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_REFRESH_TOKEN
  );
}

/**
 * Exchanges Google OAuth Refresh Token for an Access Token.
 * Caches token in-memory until 60 seconds before expiration.
 */
export async function getGoogleAccessToken(): Promise<string> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Missing Google Calendar credentials (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN)");
  }

  const nowMs = Date.now();
  if (cachedOAuthToken && cachedOAuthToken.expiresAt > nowMs + 60_000) {
    return cachedOAuthToken.accessToken;
  }

  const tokenUrl = "https://oauth2.googleapis.com/token";
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });

  const res = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to refresh Google OAuth access token (${res.status}): ${errorText}`);
  }

  const data = (await res.json()) as {
    access_token: string;
    expires_in: number;
    token_type: string;
  };

  cachedOAuthToken = {
    accessToken: data.access_token,
    expiresAt: nowMs + (data.expires_in || 3600) * 1000,
  };

  return data.access_token;
}

/**
 * Queries Google Calendar freeBusy endpoint for busy intervals between timeMin and timeMax.
 */
export async function getCalendarFreeBusy(
  calendarId: string,
  timeMinIso: string,
  timeMaxIso: string
): Promise<FreeBusyInterval[]> {
  if (!hasGoogleCalendarCredentials()) {
    return [];
  }

  const token = await getGoogleAccessToken();
  const res = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      timeMin: timeMinIso,
      timeMax: timeMaxIso,
      items: [{ id: calendarId }],
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`Google Calendar freeBusy query failed (${res.status}): ${errorText}`);
    return [];
  }

  const data = (await res.json()) as {
    calendars?: {
      [id: string]: {
        busy?: Array<{ start: string; end: string }>;
      };
    };
  };

  const calData = data.calendars?.[calendarId];
  return calData?.busy || [];
}

/**
 * Creates a Calendar Event with Google Meet conferenceData and sendUpdates="all".
 */
export async function createGoogleCalendarMeeting(
  params: CreateMeetingParams
): Promise<CreateMeetingResult> {
  const token = await getGoogleAccessToken();
  const calendarId = encodeURIComponent(
    params.calendarId || process.env.GOOGLE_CALENDAR_ID || "primary"
  );

  const requestId = `webix-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  const eventPayload = {
    summary: params.summary,
    description: params.description,
    start: {
      dateTime: params.startIso,
      timeZone: params.timeZone || "UTC",
    },
    end: {
      dateTime: params.endIso,
      timeZone: params.timeZone || "UTC",
    },
    attendees: [
      {
        email: params.attendeeEmail,
        displayName: params.attendeeName,
      },
    ],
    conferenceData: {
      createRequest: {
        requestId,
        conferenceSolutionKey: {
          type: "hangoutsMeet",
        },
      },
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 24 * 60 },
        { method: "popup", minutes: 30 },
      ],
    },
  };

  const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?conferenceDataVersion=1&sendUpdates=all`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(eventPayload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to create Google Calendar event (${res.status}): ${errorText}`);
  }

  const created = (await res.json()) as {
    id: string;
    htmlLink?: string;
    hangoutLink?: string;
    conferenceData?: {
      entryPoints?: Array<{
        entryPointType: string;
        uri: string;
      }>;
    };
  };

  const meetUrl =
    created.hangoutLink ||
    created.conferenceData?.entryPoints?.find(
      (ep) => ep.entryPointType === "video"
    )?.uri;

  return {
    eventId: created.id,
    meetUrl,
    startIso: params.startIso,
    endIso: params.endIso,
    htmlLink: created.htmlLink,
  };
}
