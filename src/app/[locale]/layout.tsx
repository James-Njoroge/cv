import { Inter } from "next/font/google";

import { Analytics } from "@vercel/analytics/react";
import { setRequestLocale } from "next-intl/server";

import { ThemeProvider } from "@/components/ui/theme-provider";
import { locales } from "@/i18n"; // Assuming your i18n.ts exports this

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  // Use 'params.locale' directly.
  // This function is designed to work in async Server Components.
  setRequestLocale(params.locale);

  return (
    <html lang={params.locale} className={inter.className} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
      <Analytics />
    </html>
  );
}

/**
 * Generate one static path per locale so ISR/SSG works.
 * Ensure your i18n.ts or config file properly exports the locales array.
 */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
