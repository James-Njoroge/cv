import { ImageResponse } from "next/og";

import { copy } from "@/lib/copy";
import { site } from "@/lib/site";

export const runtime = "edge";

/** jn-1 palette, hex-encoded — Satori doesn't resolve CSS variables or oklch(). */
const BG = "#14170F";
const CARD = "#1D211A";
const LINE = "#2F352A";
const TEXT = "#F2F4EE";
const MUTED = "#A5AA9E";
const SIGNAL = "#9BE07A";
const AMBER = "#DDBE5B";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? site.name;
  const subtitle = searchParams.get("subtitle") ?? site.headline;
  const isHome = !searchParams.get("title");

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: BG,
          padding: "60px 72px",
          fontFamily: "sans-serif",
        }}
      >
        {/* instrument bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              backgroundColor: CARD,
              border: `1px solid ${LINE}`,
              color: SIGNAL,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 27,
              fontWeight: 700,
            }}
          >
            JN
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ fontSize: 22, color: TEXT, fontWeight: 600 }}>jn-1</div>
            <div style={{ fontSize: 19, color: MUTED }}>{site.url.replace("https://", "")}</div>
          </div>
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontSize: 19,
              color: MUTED,
            }}
          >
            <div style={{ width: 10, height: 10, borderRadius: 99, backgroundColor: SIGNAL }} />
            {copy.seo.ogStep}
          </div>
        </div>

        {/* title block */}
        <div style={{ display: "flex", flexDirection: "column", marginTop: "auto", gap: 14 }}>
          <div
            style={{
              fontSize: 24,
              color: AMBER,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: 3,
            }}
          >
            {isHome ? copy.seo.ogKicker : subtitle}
          </div>
          <div
            style={{
              fontSize: isHome ? 76 : 62,
              color: TEXT,
              fontWeight: 700,
              lineHeight: 1.03,
              letterSpacing: -2,
              maxWidth: 1000,
            }}
          >
            {isHome ? copy.seo.ogTitle : title}
          </div>
          <div style={{ fontSize: 27, color: MUTED, marginTop: 6, maxWidth: 940 }}>
            {isHome ? copy.seo.ogSubtitle : `${site.name} — ${site.headline}`}
          </div>
        </div>

        {/* loss bar */}
        <div
          style={{
            display: "flex",
            marginTop: 44,
            height: 6,
            borderRadius: 99,
            backgroundColor: LINE,
            overflow: "hidden",
          }}
        >
          <div style={{ width: "100%", background: SIGNAL }} />
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
