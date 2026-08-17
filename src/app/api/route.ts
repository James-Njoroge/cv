import crypto from "node:crypto";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
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

// --- Google Sheets configuration ---------------------------------------
// The row is appended over the plain Sheets REST API with a service-account
// JWT signed here, so the route carries no Google SDK into the bundle.
const sheetId = process.env.GOOGLE_SHEET_ID;
const googleClientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
const googlePrivateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n");

const isGoogleSheetsConfigured = Boolean(sheetId && googleClientEmail && googlePrivateKey);

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets";

// Access tokens live an hour; reuse one across warm invocations.
let cachedToken: { value: string; expiresAt: number } | null = null;

function b64url(input: string): string {
  return Buffer.from(input).toString("base64url");
}

async function getAccessToken(clientEmail: string, privateKey: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && cachedToken.expiresAt > now + 60) return cachedToken.value;

  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = b64url(
    JSON.stringify({
      iss: clientEmail,
      scope: SHEETS_SCOPE,
      aud: GOOGLE_TOKEN_URL,
      iat: now,
      exp: now + 3600,
    })
  );
  const signature = crypto
    .createSign("RSA-SHA256")
    .update(`${header}.${claims}`)
    .sign(privateKey)
    .toString("base64url");

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${header}.${claims}.${signature}`,
    }),
  });
  if (!response.ok) {
    throw new Error(`Google token request failed with ${response.status}`);
  }

  const token = (await response.json()) as { access_token: string; expires_in: number };
  cachedToken = { value: token.access_token, expiresAt: now + token.expires_in };
  return token.access_token;
}

async function appendRow(row: string[]): Promise<void> {
  const accessToken = await getAccessToken(googleClientEmail!, googlePrivateKey!);
  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(sheetId!)}` +
    `/values/${encodeURIComponent("Sheet1!A:D")}:append?valueInputOption=RAW`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ values: [row] }),
  });

  if (!response.ok) {
    throw new Error(`Sheets append failed with ${response.status}`);
  }
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

    if (!isGoogleSheetsConfigured) {
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
    await appendRow([timestamp, name, contact, message]);

    return NextResponse.json({ message: "Data saved successfully!" }, { status: 200 });
  } catch (error) {
    // console.error("Unexpected error in /api POST handler:", error);
    return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}
