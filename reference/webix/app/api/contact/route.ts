import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_CONTACT_PER_HOUR = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const activeTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (activeTimestamps.length >= MAX_CONTACT_PER_HOUR) {
    return true;
  }

  activeTimestamps.push(now);
  rateLimitMap.set(ip, activeTimestamps);
  return false;
}

const ContactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Please provide a valid email address"),
  phone: z.string().trim().optional(),
  company: z.string().trim().optional(),
  service: z.string().trim().min(1, "Please select a service"),
  budget: z.string().trim().optional(),
  message: z.string().trim().min(5, "Please enter at least 5 characters describing your project"),
  honeypot: z.string().optional(),
  turnstileToken: z.string().optional(),
});

async function verifyTurnstile(token: string | undefined, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret,
        response: token,
        remoteip: ip,
      }),
    });
    const result = (await res.json()) as { success: boolean };
    return result.success;
  } catch (err) {
    console.error("Turnstile verification error:", err);
    return false;
  }
}

export async function POST(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many messages sent. Please try again later or WhatsApp us directly." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
  }

  const parsed = ContactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.format() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Bot honeypot trap
  if (data.honeypot && data.honeypot.trim().length > 0) {
    return NextResponse.json(
      { success: true, message: "Thank you. Your message has been received." },
      { status: 200 }
    );
  }

  const turnstileOk = await verifyTurnstile(data.turnstileToken, ip);
  if (!turnstileOk) {
    return NextResponse.json(
      { error: "Security check failed. Please refresh and try again." },
      { status: 400 }
    );
  }

  // Optional: Resend API email dispatch
  if (process.env.RESEND_API_KEY) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Webix Contact <inbound@webixsolutions.com>",
          to: ["info@webixsolutions.com"],
          subject: `New Inquiry from ${data.name} — ${data.service}`,
          text: `
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || "Not provided"}
Company: ${data.company || "Not provided"}
Service Needed: ${data.service}
Budget: ${data.budget || "Not specified"}

Message:
${data.message}
          `.trim(),
        }),
      });
    } catch (resendErr) {
      console.error("Resend email dispatch error:", resendErr);
    }
  }

  // Optional: CRM Webhook dispatch
  if (process.env.CRM_WEBHOOK_URL) {
    try {
      await fetch(process.env.CRM_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "contact_form_submitted",
          timestamp: new Date().toISOString(),
          ip,
          ...data,
        }),
      });
    } catch (crmErr) {
      console.error("CRM Webhook error:", crmErr);
    }
  }

  return NextResponse.json({
    success: true,
    message: "Thank you. Your message has been received. Our team will review your project and reply within one business day.",
  });
}
