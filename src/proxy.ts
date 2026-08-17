import createMiddleware from "next-intl/middleware";

import { routing } from "@/i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Next 16 renamed the `middleware` file convention to `proxy`; the matcher
  // semantics are unchanged.
  // Run on all localized pages, but skip:
  //  - /api            (route handlers)
  //  - /_next, /_vercel (framework internals)
  //  - /og             (dynamic OG image route handler, not under [locale])
  //  - /studio         (dev-only copy editor, has its own document shell)
  //  - any path with a dot (feed.xml, resume.json, llms.txt, sitemap.xml,
  //    robots.txt, images, favicons, etc.)
  matcher: ["/((?!api|_next|_vercel|og|studio|.*\\..*).*)"],
};
