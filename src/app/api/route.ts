import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
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

// Google Sheets configuration
const sheetId = process.env.GOOGLE_SHEET_ID;
const googleClientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
const googlePrivateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n");

const isGoogleSheetsConfigured = Boolean(sheetId && googleClientEmail && googlePrivateKey);

const auth = isGoogleSheetsConfigured
  ? new google.auth.GoogleAuth({
      credentials: {
        client_email: googleClientEmail,
        private_key: googlePrivateKey,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })
  : undefined;

const sheets = auth ? google.sheets({ version: "v4", auth }) : undefined;

// Rate limiter (reused across requests)
const ratelimit = new Ratelimit({
  redis: kv,
  // The chat can legitimately be sent more than once (a follow-up, or a retry
  // after a transient failure), so this is a small allowance rather than one.
  limiter: Ratelimit.slidingWindow(3, "24h"),
  analytics: true,
});

function getClientIdentifier(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]!.trim();
  }
  if (request.ip) {
    return request.ip;
  }
  return "unknown";
}

export async function POST(request: NextRequest) {
  const clientId = getClientIdentifier(request);

  try {
    // --- 1. Rate limiting ---
    const { success } = await ratelimit.limit(clientId);
    if (!success) {
      return NextResponse.json(
        {
          message:
            "That's a few messages from this connection already — James has them. Try again in 24 hours, or email him directly.",
        },
        { status: 429 }
      );
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

    if (!sheets || !sheetId) {
      // console.error("Google Sheets configuration is missing or invalid.");
      return NextResponse.json(
        {
          message: "The service is temporarily unavailable. Please try again later.",
        },
        { status: 503 }
      );
    }

    const { name, contact, message } = parsed.data;
    const timestamp = new Date().toISOString();

    // --- 4. Write to Google Sheets ---
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "Sheet1!A:D",
      valueInputOption: "RAW",
      requestBody: {
        values: [[timestamp, name, contact, message]],
      },
    });

    return NextResponse.json({ message: "Data saved successfully!" }, { status: 200 });
  } catch (error) {
    // console.error("Unexpected error in /api POST handler:", error);
    return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}
