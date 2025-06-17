import { notFound } from "next/navigation";
import type { AbstractIntlMessages } from "next-intl"; // Corrected import
import { getRequestConfig } from "next-intl/server";

/**
 * All locales your app supports.
 * Marked `as const` so TypeScript treats it as a readonly tuple
 * and we can derive a precise `AppLocale` union type.
 */
export const locales = ["en"] as const;
export type AppLocale = (typeof locales)[number];

// A type guard function to check if a string is a valid AppLocale
function isValidLocale(locale: any): locale is AppLocale {
  return locales.includes(locale);
}

/**
 * Next‑intl request‑time configuration.
 *
 * We return an object that satisfies the `RequestConfig` interface:
 * { locale: string; messages: Messages }
 */
export default getRequestConfig(async ({ locale }) => {
  // 1. Validate that the incoming `locale` parameter is a valid locale.
  if (!isValidLocale(locale)) {
    notFound();
  }

  // 2. Dynamically import the JSON message catalog.
  // The official recommendation is to use AbstractIntlMessages.
  const messages: AbstractIntlMessages = (await import(`./messages/${locale}.json`)).default;

  // 3. Return the full RequestConfig.
  return {
    locale,
    messages,
  };
});
