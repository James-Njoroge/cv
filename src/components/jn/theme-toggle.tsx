"use client";

import { useEffect, useLayoutEffect, useState } from "react";

import { applyTheme, readStoredTheme, Theme } from "@/lib/theme";

/**
 * Theme switch for the instrument bar: auto → light → dark → auto.
 *
 * The palette itself is already correct by the time this mounts — the inline
 * script in the layout saw to that. This only owns the label and the cycle.
 */

const ORDER: Theme[] = ["auto", "light", "dark"];

/** `useLayoutEffect` warns when it runs during SSR; this never does. */
const useBeforePaint = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** 13px glyphs, stroked in currentColor so they inherit the hover state. */
function ThemeIcon({ theme }: { theme: Theme }) {
  const stroke = {
    width: 13,
    height: 13,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (theme === "dark") {
    return (
      <svg {...stroke}>
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
      </svg>
    );
  }
  if (theme === "light") {
    return (
      <svg {...stroke}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v1.6M12 20.4V22M4.5 4.5l1.2 1.2M18.3 18.3l1.2 1.2M2 12h1.6M20.4 12H22M4.5 19.5l1.2-1.2M18.3 5.7l1.2-1.2" />
      </svg>
    );
  }
  return (
    <svg {...stroke}>
      <rect x="2.5" y="4" width="19" height="13" rx="2" />
      <path d="M9 21h6M12 17v4" />
    </svg>
  );
}

export function ThemeToggle() {
  // Starts at "auto" so the server render and the first client render agree —
  // only this label is ever briefly wrong, never the palette.
  const [theme, setTheme] = useState<Theme>("auto");

  useBeforePaint(() => {
    const stored = readStoredTheme();
    setTheme(stored);
    // React's Strict Mode remount in dev wipes attributes it doesn't own,
    // including the one the head script set. Re-applying is a no-op in prod.
    applyTheme(stored);
  }, []);

  const cycle = () => {
    const next = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length]!;
    setTheme(next);
    applyTheme(next);
  };

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`Colour theme: ${theme}. Activate to switch.`}
      className="flex h-[26px] shrink-0 items-center gap-1.5 rounded-full border border-border bg-secondary pl-2 pr-2.5 font-mono text-[11px] font-medium leading-none text-muted-foreground transition-colors hover:border-primary hover:text-primary print:hidden"
    >
      <ThemeIcon theme={theme} />
      {/* Fixed width so cycling the label doesn't shuffle the bar */}
      <span className="w-[2.1rem] text-left">{theme}</span>
    </button>
  );
}
