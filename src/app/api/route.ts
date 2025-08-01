// File: app/api/route.ts
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Define schema for server-side validation with corrected email validation
const FormDataSchema = z.object({
  email: z.email({ message: "Invalid email address." }), // CORRECTED SYNTAX
  company: z
    .string()
    .min(1, { message: "Company name is required." })
    .max(45, { message: "Company name must be 45 characters or less." }),
});

// Configure Google Sheets authentication
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });
const sheetId = process.env.GOOGLE_SHEET_ID;

// Main POST handler
export async function POST(request: NextRequest) {
  // --- 1. Rate Limiting ---
  const ip = request.ip ?? "127.0.0.1";
  const ratelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(1, "24h"), // 1 request per 24 hours
    analytics: true,
  });

  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json(
      {
        message: "You have already submitted an inquiry. Please wait 24 hours before trying again.",
      },
      { status: 429 } // 429 Too Many Requests
    );
  }

  try {
    const body = await request.json();

    // --- 2. Server-Side Validation ---
    const validatedData = FormDataSchema.parse(body);
    const { email, company } = validatedData;
    const timestamp = new Date().toISOString();

    // --- 3. Write to Google Sheets ---
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "Sheet1!A:C", // Assumes headers are in Sheet1, columns A, B, C
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[timestamp, email, company]],
      },
    });

    return NextResponse.json({ message: "Data saved successfully!" }, { status: 200 });
  } catch (error) {
    console.error(error); // Log the full error for debugging

    // --- Re-enabled Zod error handling ---
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid form data.", errors: error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}
