import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en"],
  localePrefix: "as-needed",
  defaultLocale: "en",
});

export const config = {
  // Run on all localized pages, but skip:
  //  - /api            (route handlers)
  //  - /_next, /_vercel (framework internals)
  //  - /og             (dynamic OG image route handler, not under [locale])
  //  - any path with a dot (feed.xml, resume.json, llms.txt, sitemap.xml,
  //    robots.txt, images, favicons, etc.)
  matcher: ["/((?!api|_next|_vercel|og|.*\\..*).*)"],
};
