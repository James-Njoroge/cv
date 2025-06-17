import { Inter } from "next/font/google";

import { Analytics } from "@vercel/analytics/react";
import { unstable_setRequestLocale } from "next-intl/server";

import { ThemeProvider } from "@/components/ui/theme-provider";
import { locales } from "@/i18n";

import "./globals.css";

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);

  return (
    <html lang={locale} className={inter.className}>
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

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
