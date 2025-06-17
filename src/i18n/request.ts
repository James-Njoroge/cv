import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ requestLocale }) => {
  // `requestLocale` comes from the /en/, /fr/, … prefix; add a fallback
  const locale = (await requestLocale) ?? "en";

  return {
    locale, // ← required
    messages: (await import("../messages/en.json")).default,
  };
});
