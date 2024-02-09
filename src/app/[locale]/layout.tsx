import Head from 'next/head';
import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { locales } from "@/i18n";
import { unstable_setRequestLocale } from "next-intl/server";

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
    <>
      <Head>
        <title>James Njoroge | Personal Website</title>
        <meta name="description" content="James Njoroge's personal portfolio." />
        <meta property="og:title" content="James Njoroge - Software Developer" />
        <meta property="og:description" content="Explore my portfolio to see my projects, skills, and professional journey as a software developer." />
        <meta name="image" property="og:image" content="'/images/headshot.png'" />
      </Head>
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
    </>
  );
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}


<head>
  <title>{'James Njoroge'}</title>
  <meta name="description" content={'Personal Website'} />
  <meta property="og:image" content={'/images/headshot.png'} />
</head>