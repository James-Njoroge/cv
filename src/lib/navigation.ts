import { createSharedPathnamesNavigation } from "next-intl/navigation";

export const locales = ["en"] as const;

export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation({
  locales,
  localePrefix: "as-needed", // This must match your middleware config
});
