# Webix Solutions — Deployment Guide & Launch Runbook

This document details the production hosting setup, preview deployment pipeline, environment variables, and the launch-day runbook for `https://webixsolutions.com`.

---

## 1. Hosting Architecture & Free-Tier Compliance

Per **docs/07-seo-geo-technical.md §11**:
- **Avoid Vercel Hobby**: Vercel’s free Hobby plan is legally restricted to personal, non-commercial use only (Vercel Terms §4). Operating a commercial agency on Hobby violates terms and risks account suspension.
- **Recommended Free Production Host**: **Cloudflare Workers via the OpenNext adapter (`@opennextjs/cloudflare`)**.
  - Commercial use is fully allowed on the free plan.
  - Supports React Server Components (SSG), ISR (`revalidate`), Route Handlers (`/api/*`), and static asset serving.
  - Free edge caching, SSL/TLS, and global CDN.
- **Alternative**: Netlify Free plan (allows commercial projects up to free bandwidth/compute limits).

---

## 2. Environment Variables Reference

Configure these in the Cloudflare dashboard (`Workers & Pages > webix-solutions > Settings > Variables and Secrets`) or `.env.local` for local staging:

| Variable Name | Required? | Example / Value | Description |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | **Yes** | `https://webixsolutions.com` | Canonical site base URL (no trailing slash). |
| `GOOGLE_CALENDAR_CLIENT_ID` | Optional | `xxx.apps.googleusercontent.com` | Google Cloud OAuth 2.0 client ID for strategy call booking. |
| `GOOGLE_CALENDAR_CLIENT_SECRET` | Optional | `GOCSPX-xxxx` | Google Cloud OAuth 2.0 client secret. |
| `GOOGLE_CALENDAR_REFRESH_TOKEN` | Optional | `1//04xxxx` | Long-lived refresh token obtained via `docs/BOOKING-SETUP.md`. |
| `GOOGLE_CALENDAR_ID` | Optional | `primary` (or specific email) | Google Calendar ID where bookings are placed. |
| `RESEND_API_KEY` | Optional | `re_xxxxxxxxx` | Resend API key for `/api/contact` email notifications. |
| `CONTACT_NOTIFICATION_EMAIL` | Optional | `info@webixsolutions.com` | Inbox where contact form submissions are delivered. |
| `CRM_WEBHOOK_URL` | Optional | `https://hooks.zapier.com/...` | Webhook URL for CRM / WhatsApp automated lead capture. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`| Optional | `0x4AAAAAA...` | Cloudflare Turnstile bot trap public key. |
| `TURNSTILE_SECRET_KEY` | Optional | `0x4AAAAAA...` | Cloudflare Turnstile server verification secret. |
| `NEXT_PUBLIC_GA4_MEASUREMENT_ID`| Optional | `G-XXXXXXXXXX` | Google Analytics 4 ID (loads only after user consent). |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID`| Optional | `xxxxxxxxxx` | Microsoft Clarity heatmaps ID (loads after consent). |
| `NEXT_PUBLIC_META_PIXEL_ID` | Optional | `123456789012345` | Meta Pixel ID for ad campaign tracking. |

> [!NOTE]
> When Google Calendar credentials are not provided, the booking engine automatically displays a frictionless production fallback card providing direct WhatsApp (`+92 322 9472354`) and Email (`info@webixsolutions.com`) booking paths.

---

## 3. Preview & Production Deployment (Cloudflare Workers)

### Prerequisites
- Node.js $\ge 20$ (Node 24 tested and supported)
- Wrangler CLI (installed in devDependencies)
- Cloudflare account with Workers enabled

### Step-by-Step Build & Deploy

1. **Log in to Cloudflare**:
   ```bash
   npx wrangler login
   ```

2. **Run the OpenNext Cloudflare Build**:
   ```bash
   npm run build:worker
   ```
   This generates the optimized `.open-next/worker.js` and `.open-next/assets/` output.

3. **Deploy to Preview / Staging Domain**:
   ```bash
   npx wrangler deploy
   ```
   Wrangler outputs your live preview URL (e.g., `https://webix-solutions.<subdomain>.workers.dev`).

4. **Verify Preview Indexing Shield**:
   Curl the preview domain to verify the automated staging shield:
   ```bash
   curl -I https://webix-solutions.<subdomain>.workers.dev/
   ```
   Verify the response contains:
   ```http
   X-Robots-Tag: noindex, nofollow
   ```

5. **Attach Custom Domain**:
   In Cloudflare Dashboard:
   - Navigate to `Workers & Pages > webix-solutions > Settings > Triggers > Custom Domains`.
   - Add `webixsolutions.com` and `www.webixsolutions.com`.
   - Cloudflare will automatically route DNS and provision strict SSL certificates.

---

## 4. Launch-Day Runbook (Manual Action Items)

Complete these tasks in order on the day of switchover:

### 1. DNS & SSL Switch
- [ ] Point nameservers to Cloudflare (or set A / CNAME records to Cloudflare Workers).
- [ ] In Cloudflare SSL/TLS settings, set encryption mode to **Full (strict)**.
- [ ] Verify `www.webixsolutions.com` redirects to `https://webixsolutions.com/` (apex canonical).
- [ ] Verify HTTPS handshake and certificate chain.

### 2. Search Console & Indexing Cleanup (CRITICAL)
- [ ] Open **Google Search Console** for `webixsolutions.com`.
- [ ] Submit sitemap: `https://webixsolutions.com/sitemap.xml`.
- [ ] **Spam Removal Tool**: Navigate to **Removals > Temporary Removals > New Request > Remove all URLs with this prefix** and submit:
  ```
  https://webixsolutions.com/market/
  ```
  *(This clears the ~980 hacked URLs from Google Search within hours while middleware returns HTTP 410 Gone).*
- [ ] Request Indexing for top pages via URL Inspection:
  - `https://webixsolutions.com/`
  - `https://webixsolutions.com/services/`
  - `https://webixsolutions.com/ai-automation-services/`
  - `https://webixsolutions.com/web-design-development-service/`
  - `https://webixsolutions.com/pricing/`
  - `https://webixsolutions.com/offers/`
  - `https://webixsolutions.com/our-work/`
  - `https://webixsolutions.com/book-a-call/`

### 3. Bing Webmaster Tools & IndexNow
- [ ] Submit `https://webixsolutions.com/sitemap.xml` in Bing Webmaster Tools.
- [ ] Enable **IndexNow** in Bing WMT for automated instant crawl notification.

### 4. Google Business Profile (GBP) & Local SEO
- [ ] Log in to Google Business Profile for Webix Solutions (Dunyapur / Punjab).
- [ ] Update **Website URL** to:
  ```
  https://webixsolutions.com/?utm_source=gbp&utm_medium=organic&utm_campaign=profile
  ```
- [ ] Update **Appointment Link** to:
  ```
  https://webixsolutions.com/book-a-call/?utm_source=gbp&utm_medium=organic&utm_campaign=booking
  ```
- [ ] Confirm NAP consistency:
  - Name: Webix Solutions
  - Address: Dunyapur, Punjab, Pakistan
  - Phone: +92 322 9472354

### 5. Social & Directory Profiles Link Audit
Update the profile website link on each official platform:
- [ ] LinkedIn Company Page: `https://webixsolutions.com`
- [ ] Haroon Sukhera LinkedIn: `https://webixsolutions.com`
- [ ] GitHub Org (`webixsolutions-dev`): `https://webixsolutions.com`
- [ ] Facebook Page (`webixsolutions`): `https://webixsolutions.com`
- [ ] Instagram (`@webix_solutions`): `https://webixsolutions.com`
- [ ] YouTube (`@WebixSolutions`): `https://webixsolutions.com`
- [ ] Upwork & Clutch Agency Profiles: `https://webixsolutions.com`

### 6. Legacy WordPress Server Decommissioning
- [ ] Run final malware check and backup of old database for reference.
- [ ] Move old WordPress to isolated, password-protected subdomain (e.g. `old-archive.webixsolutions.com`, `noindex, nofollow`) or shut down droplet/container completely.

### 7. Days 1–7 & Day 30 Monitoring
- [ ] Daily: Check GSC **Pages** report and **Coverage** for unexpected 404s. Add 301 redirects immediately in `config/redirects.ts` for any missing legacy URL.
- [ ] Day 7: Inspect Core Web Vitals field data in GSC.
- [ ] Day 30: Execute the **AI Assistant Test** (ask ChatGPT, Perplexity, Claude, and Gemini the 6 standard benchmark questions from `docs/07-seo-geo-technical.md §13` and record entity citation status).
