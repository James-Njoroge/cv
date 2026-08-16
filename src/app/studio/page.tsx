import { notFound } from "next/navigation";

import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";

import { StudioClient } from "./studio-client";

/**
 * /studio — edit every string on the site, then save straight back to
 * `content/site-copy.json`. Dev-only; the route 404s in a production build.
 */
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Copy studio",
  robots: { index: false, follow: false },
};

export default async function StudioPage() {
  if (process.env.NODE_ENV !== "development") notFound();

  const raw = await readFile(path.join(process.cwd(), "content", "site-copy.json"), "utf8");
  // Must match the hash the API computes, so the first save validates.
  const version = createHash("sha256").update(raw).digest("hex").slice(0, 16);
  return <StudioClient initial={JSON.parse(raw)} initialVersion={version} />;
}
