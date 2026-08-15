import { JetBrains_Mono, Space_Grotesk } from "next/font/google";

import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { TrainingBar } from "@/components/jn/training-bar";
import { JsonLd, personJsonLd, webSiteJsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { locales } from "@/i18n";
import { site } from "@/lib/site";

import "./globals.css";

/**
 * Two families only (jn-1 §02): Space Grotesk carries every human sentence,
 * JetBrains Mono carries every machine one.
 */
const fontSans = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.headline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: [...site.keywords],
  authors: [{ name: site.fullName, url: site.url }],
  creator: site.fullName,
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": `${site.url}/feed.xml` },
  },
  openGraph: {
    type: "profile",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.headline}`,
    description: site.description,
    locale: "en_US",
    images: [{ url: "/og", width: 1200, height: 630, alt: `${site.name} — ${site.headline}` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.headline}`,
    description: site.description,
    images: ["/og"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport = {
  themeColor: "#14170F",
  colorScheme: "dark",
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default function RootLayout({ children, params }: RootLayoutProps) {
  setRequestLocale(params.locale);

  return (
    <html
      lang={params.locale}
      // jn-1 commits to a single look, so there is no theme to switch.
      className={`${fontSans.variable} ${fontMono.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col overflow-x-hidden">
        <TrainingBar />
        <div className="flex-1">{children}</div>
        <SiteFooter />
        <JsonLd data={[personJsonLd(), webSiteJsonLd()]} />
        <Analytics />
      </body>
    </html>
  );
}

/**
 * Generate one static path per locale so ISR/SSG works.
 */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
