import { JetBrains_Mono, Space_Grotesk } from "next/font/google";

import "../[locale]/globals.css";

/**
 * The studio sits outside `[locale]` so it never gets the site's fixed header,
 * footer, or scroll instrumentation — it's a tool, not a page of the site.
 * That means it needs its own document shell.
 */
const fontSans = Space_Grotesk({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const fontMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fontSans.variable} ${fontMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
