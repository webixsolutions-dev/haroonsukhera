# Booking System Setup Guide — Google Calendar & Meet

This document explains step-by-step how to generate the OAuth credentials needed for Webix Solutions' live booking engine (`/book-a-call/` and `/api/booking/`).

---

## Architecture Overview

- **User experience:** Visitor selects meeting type (Strategy 30 min, Quick Intro 15 min, or Partner 45 min) $\rightarrow$ picks a slot in their local time zone $\rightarrow$ enters their details $\rightarrow$ a confirmed Google Meet event is generated instantly.
- **Admin view:** Google Calendar (on Haroon's phone / desktop) is the schedule dashboard. Any event on the calendar automatically blocks those times with a 15-minute buffer.
- **Safety Fallback:** If `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, or `GOOGLE_REFRESH_TOKEN` are not provided in production, the site automatically renders a direct WhatsApp / email booking card. Fake slots are never displayed.

---

## Step-by-Step Setup in Google Cloud Console

### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Click the project dropdown at the top $\rightarrow$ **New Project**.
3. Name it `Webix-Solutions-Booking` and click **Create**.

### 2. Enable Google Calendar API
1. In the left navigation menu, go to **APIs & Services** $\rightarrow$ **Library**.
2. Search for `Google Calendar API`.
3. Click on it and click **Enable**.

### 3. Configure OAuth Consent Screen
1. Go to **APIs & Services** $\rightarrow$ **OAuth consent screen**.
2. Choose **External** user type $\rightarrow$ click **Create**.
3. Fill in:
   - **App name**: `Webix Solutions Calendar`
   - **User support email**: `info@webixsolutions.com`
   - **Developer contact information**: `info@webixsolutions.com`
4. Click **Save and Continue**.
5. Under **Scopes**, click **Add or Remove Scopes** and add:
   - `https://www.googleapis.com/auth/calendar` (or `https://www.googleapis.com/auth/calendar.events`)
6. Under **Test Users**, add the Google email address that owns the calendar (e.g. `info@webixsolutions.com` or Haroon's workspace account).
7. Save and finish.

### 4. Create OAuth Client ID
1. Go to **APIs & Services** $\rightarrow$ **Credentials**.
2. Click **Create Credentials** $\rightarrow$ **OAuth client ID**.
3. Application type: **Web application**.
4. Name: `Webix Booking Client`.
5. Under **Authorized redirect URIs**, add:
   - `https://developers.google.com/oauthplayground` (used once to obtain the refresh token)
   - `https://webixsolutions.com/api/booking/callback` (optional future callback)
6. Click **Create**.
7. Copy the generated **Client ID** and **Client Secret**.

### 5. Generate the OAuth Refresh Token
1. Open the [Google OAuth 2.0 Playground](https://developers.google.com/oauthplayground).
2. Click the gear icon (⚙️) in the top-right corner:
   - Check **Use your own OAuth credentials**.
   - Paste your **OAuth Client ID** and **OAuth Client Secret**.
3. In **Step 1 (Select & authorize APIs)** on the left:
   - Scroll down to **Google Calendar API v3**.
   - Check `https://www.googleapis.com/auth/calendar` and `https://www.googleapis.com/auth/calendar.events`.
   - Click **Authorize APIs**.
4. Log in with the Google Account that hosts Webix Solutions calendar meetings and grant permission.
5. In **Step 2 (Exchange authorization code for tokens)**:
   - Click **Exchange authorization code for tokens**.
6. Copy the value in the **Refresh token** field (e.g., `1//04...`).

---

## Environment Variables Configuration

Add these four variables to your production environment (Cloudflare Workers / Vercel / server `.env.local`):

```bash
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
GOOGLE_REFRESH_TOKEN="1//04..."
GOOGLE_CALENDAR_ID="primary"
```

> **Note:** If `GOOGLE_CALENDAR_ID` is omitted, it defaults to `"primary"`, which refers to the primary calendar of the authenticated Google account.

---

## Verifying the Setup

1. Run the local unit test suite:
   ```bash
   node scripts/test-booking.js
   ```
2. Start the local server:
   ```bash
   npm run dev
   ```
3. Visit `http://localhost:3000/book-a-call/`.
4. Choose a slot, fill out test contact info, and submit.
5. Check that:
   - A Google Calendar event appears with a valid Google Meet video link.
   - The attendee receives a calendar invitation with Google Meet link.
   - The confirmation screen provides `.ics` download and Google Calendar links.
