import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const ContactSchema = z.object({
  type: z.enum(["business", "individual", "freelancer"]).default("business"),
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Please provide a valid email address"),
  whatsapp: z.string().trim().optional(),
  website: z.string().trim().optional(),
  message: z.string().trim().min(5, "Please enter at least 5 characters describing what you need"),
  company: z.string().trim().optional(),
  businessNeed: z.string().trim().optional(),
  timing: z.string().trim().optional(),
  task: z.string().trim().optional(),
  deadline: z.string().trim().optional(),
  whiteLabel: z.string().trim().optional(),
  nda: z.string().trim().optional(),
  honeypot: z.string().optional(),
  turnstileToken: z.string().optional(),
});

async function verifyTurnstile(token: string | undefined, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // dev or unconfigured fallback
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
      { success: true, message: "Message sent. I'll get back to you on email or WhatsApp." },
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

  // Resend email dispatch (if API key provided)
  if (process.env.RESEND_API_KEY) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM_EMAIL || "Haroon Sukhera site <hello@haroonsukhera.com>",
          to: [process.env.CONTACT_TO_EMAIL || "haroonsukheraofficial@gmail.com"],
          subject: `New inquiry from ${data.name} (${data.type})`,
          text: `
Type: ${data.type}
Name: ${data.name}
Email: ${data.email}
WhatsApp: ${data.whatsapp || "Not provided"}
Website: ${data.website || "Not provided"}
Company: ${data.company || "Not provided"}
What needed: ${data.businessNeed || data.task || "Not specified"}
Timing / Deadline: ${data.timing || data.deadline || "Not specified"}
White-label needed: ${data.whiteLabel || "N/A"}
NDA needed: ${data.nda || "N/A"}

Message:
${data.message}
          `.trim(),
        }),
      });
    } catch (resendErr) {
      console.error("Resend email dispatch error:", resendErr);
    }
  }

  return NextResponse.json({
    success: true,
    message: "Message sent. I'll get back to you on email or WhatsApp.",
  });
}
