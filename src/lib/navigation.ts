// import { createSharedPathnamesNavigation } from "next-intl/navigation";

// import { locales } from "@/i18n";

// export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation({
//   locales,
// });

// src/navigation.ts

import { createLocalizedPathnamesNavigation, Pathnames } from "next-intl/navigation";

export const locales = ["en"] as const;

// The `pathnames` object holds the translations for of all paths that you wish to translate.
// The key is the route path, and the value is an object with the locale as the key and the translated path as the value.
export const pathnames = {
  "/": "/",
  // Example:
  // '/about': {
  //   en: '/about',
  //   de: '/ueber-uns'
  // }
} satisfies Pathnames<typeof locales>;

export const { Link, redirect, usePathname, useRouter } = createLocalizedPathnamesNavigation({
  locales,
  pathnames,
  localePrefix: "as-needed", // This must match your middleware config
});
