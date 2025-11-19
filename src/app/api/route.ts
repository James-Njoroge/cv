
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

// Server-side validation schema
const FormDataSchema = z.object({
  email: z.
    email({ message: "Invalid email address." }),
  company: z
    .string()
    .min(1, { message: "Company name is required." })
    .max(45, { message: "Company name must be 45 characters or less." }),
});

// Google Sheets configuration
const sheetId = process.env.GOOGLE_SHEET_ID;
const googleClientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
const googlePrivateKey =
  process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n");

const isGoogleSheetsConfigured =
  Boolean(sheetId && googleClientEmail && googlePrivateKey);

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
  limiter: Ratelimit.slidingWindow(1, "24h"), // configurable if needed
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
            "You have already submitted an inquiry. Please wait 24 hours before trying again.",
        },
        { status: 429 },
      );
    }

    // --- 2. Basic request checks ---
    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return NextResponse.json(
        {
          message: "Invalid content type. Expected application/json.",
        },
        { status: 415 },
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { message: "Invalid JSON body." },
        { status: 400 },
      );
    }

    // --- 3. Server-side validation ---
    const parsed = FormDataSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Invalid form data.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    if (!sheets || !sheetId) {
      console.error("Google Sheets configuration is missing or invalid.");
      return NextResponse.json(
        {
          message:
            "The service is temporarily unavailable. Please try again later.",
        },
        { status: 503 },
      );
    }

    const { email, company } = parsed.data;
    const timestamp = new Date().toISOString();

    // --- 4. Write to Google Sheets ---
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "Sheet1!A:C",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[timestamp, email, company]],
      },
    });

    return NextResponse.json(
      { message: "Data saved successfully!" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Unexpected error in /api POST handler:", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 },
    );
  }
}
