import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

export const runtime = "nodejs";

// Server-side validation schema — mirrors the steps in the contact chat.
// `contact` is an email *or* a phone number, so it stays a loose string here
// and gets the same shape check the client runs.
const CONTACT = /^(?:[^\s@]+@[^\s@]+\.[^\s@]{2,}|[+()\d][\d\s\-().]{6,})$/;

const FormDataSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name is required." })
    .max(60, { message: "Name must be 60 characters or less." }),
  contact: z
    .string()
    .trim()
    .max(120, { message: "Contact must be 120 characters or less." })
    .regex(CONTACT, { message: "Enter a valid email address or phone number." }),
  message: z
    .string()
    .trim()
    .min(4, { message: "Message is required." })
    .max(1200, { message: "Message must be 1200 characters or less." }),
});

// --- Email delivery ------------------------------------------------------
// Submissions are emailed over Gmail SMTP. GMAIL_APP_PASSWORD must be an
// app password (Google account → Security → 2-Step Verification → App
// passwords), not the account password.
const gmailUser = process.env.GMAIL_USER;
const gmailAppPassword = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "");
// Where the notification lands. Defaults to the sending account.
const inquiryRecipient = process.env.CONTACT_TO_EMAIL ?? gmailUser;

const isMailConfigured = Boolean(gmailUser && gmailAppPassword && inquiryRecipient);

// One transport, reused across warm invocations. Setting SMTP_HOST points it
// at another server — used to exercise this route against a local SMTP sink
// without sending real mail; unset everywhere else, so Gmail is the default.
const transporter = isMailConfigured
  ? nodemailer.createTransport(
      process.env.SMTP_HOST
        ? {
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT ?? 587),
            secure: false,
            ignoreTLS: true,
            auth: { user: gmailUser, pass: gmailAppPassword },
          }
        : {
            service: "gmail",
            auth: { user: gmailUser, pass: gmailAppPassword },
          }
    )
  : null;

const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Escapes the four characters that could otherwise inject markup into the HTML part. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function sendInquiry(fields: {
  name: string;
  contact: string;
  message: string;
  timestamp: string;
}): Promise<void> {
  const { name, contact, message, timestamp } = fields;
  const contactIsEmail = EMAIL_SHAPE.test(contact);

  const text = [
    `Name:    ${name}`,
    `Contact: ${contact}`,
    `Sent:    ${timestamp} (ET)`,
    "",
    message,
  ].join("\n");

  const html = `
    <div style="font-family:system-ui,-apple-system,'Segoe UI',sans-serif;line-height:1.6;color:#14170F">
      <h2 style="margin:0 0 16px;font-size:18px">New inquiry from ${escapeHtml(name)}</h2>
      <table style="border-collapse:collapse;margin-bottom:20px;font-size:14px">
        <tr><td style="padding:2px 12px 2px 0;color:#6b7280">Contact</td><td>${escapeHtml(contact)}</td></tr>
        <tr><td style="padding:2px 12px 2px 0;color:#6b7280">Sent</td><td>${escapeHtml(timestamp)} ET</td></tr>
      </table>
      <div style="white-space:pre-wrap;border-left:3px solid #9BE07A;padding-left:14px">${escapeHtml(message)}</div>
    </div>
  `.trim();

  await transporter!.sendMail({
    // Gmail rewrites `from` to the authenticated account, so the visitor's
    // name goes in the display name and their address in Reply-To.
    from: `"${name} (jnjoroge.dev)" <${gmailUser}>`,
    to: inquiryRecipient,
    // Replying goes straight back to the visitor when they left an email.
    replyTo: contactIsEmail ? `"${name}" <${contact}>` : undefined,
    subject: `Portfolio inquiry — ${name}`,
    text,
    html,
  });
}

// --- Rate limiting ------------------------------------------------------
// Vercel KV moved to Upstash Redis, so accept either set of env vars.
const redisUrl = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

const ratelimit =
  redisUrl && redisToken
    ? new Ratelimit({
        redis: new Redis({ url: redisUrl, token: redisToken }),
        // The chat can legitimately be sent more than once (a follow-up, or a
        // retry after a transient failure), so this is a small allowance
        // rather than one.
        limiter: Ratelimit.slidingWindow(3, "24h"),
        analytics: true,
      })
    : null;

function getClientIdentifier(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]!.trim();
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: NextRequest) {
  const clientId = getClientIdentifier(request);

  try {
    // --- 1. Rate limiting ---
    if (!ratelimit) {
      // Never accept unthrottled submissions in production.
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json(
          { message: "The service is temporarily unavailable. Please try again later." },
          { status: 503 }
        );
      }
    } else {
      // An unreachable Redis (deleted database, expired token, network blip)
      // must not read as a bug in the form. Still fail closed — an outage in
      // the throttle is not a licence to accept unthrottled submissions — but
      // say so honestly instead of returning a bare 500.
      let success: boolean;
      try {
        ({ success } = await ratelimit.limit(clientId));
      } catch {
        // console.error("Rate limiter unreachable:", error);
        return NextResponse.json(
          { message: "The service is temporarily unavailable. Please try again later." },
          { status: 503 }
        );
      }
      if (!success) {
        return NextResponse.json(
          {
            message:
              "That's a few messages from this connection already — James has them. Try again in 24 hours, or email him directly.",
          },
          { status: 429 }
        );
      }
    }

    // --- 2. Basic request checks ---
    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return NextResponse.json(
        {
          message: "Invalid content type. Expected application/json.",
        },
        { status: 415 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ message: "Invalid JSON body." }, { status: 400 });
    }

    // --- 3. Server-side validation ---
    const parsed = FormDataSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Invalid form data.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    if (!transporter) {
      // console.error("Gmail SMTP configuration is missing or invalid.");
      return NextResponse.json(
        {
          message: "The service is temporarily unavailable. Please try again later.",
        },
        { status: 503 }
      );
    }

    const { name, contact, message } = parsed.data;
    const timestamp = new Date().toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "America/New_York",
    });

    // --- 4. Email the inquiry ---
    await sendInquiry({ name, contact, message, timestamp });

    return NextResponse.json({ message: "Message sent." }, { status: 200 });
  } catch (error) {
    // console.error("Unexpected error in /api POST handler:", error);
    return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}
