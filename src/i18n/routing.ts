import { defineRouting } from "next-intl/routing";

/**
 * All locales the site supports, plus how they appear in the URL.
 * This is the single source of truth shared by the middleware, the request
 * config and `generateStaticParams`.
 */
export const routing = defineRouting({
  locales: ["en"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});

export const locales = routing.locales;
export type AppLocale = (typeof routing.locales)[number];
