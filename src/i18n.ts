import { notFound } from "next/navigation";
import { Messages } from "next-intl";
import { getRequestConfig } from "next-intl/server";

/**
 * All locales your app supports.
 * Marked `as const` so TypeScript treats it as a readonly tuple
 * and we can derive a precise `AppLocale` union type.
 */
export const locales = ["en"] as const;
export type AppLocale = (typeof locales)[number];

/**
 * Next‑intl request‑time configuration.
 *
 * We return an object that satisfies the `RequestConfig` interface:
 * { locale: string; messages: Messages }
 */
export default getRequestConfig(async ({ locale }) => {
  // 1  Ensure the requested locale is supported; otherwise 404
  if (!locales.includes(locale as AppLocale)) {
    notFound();
  }

  // 2  Dynamically import the JSON message catalog and type it
  const messages: Messages = (await import(`./messages/${locale}.json`)).default;

  // 3  Return the full RequestConfig (needs both locale & messages)
  return {
    locale,
    messages,
  } as const;
});
