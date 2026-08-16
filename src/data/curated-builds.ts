/**
 * Builds that don't live in a public GitHub repo — coursework under an
 * academic-integrity hold, private product code, and client platforms.
 *
 * These are merged with the live GitHub feed in `@/lib/builds`. Anything here
 * outranks a repo of the same rank, because these are the strongest work.
 * The copy lives in `content/site-copy.json`.
 */
import { copy } from "@/lib/copy";

export interface CuratedBuild {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  /** Metric chips — real numbers only */
  highlights: string[];
  /** Where/why it was built */
  context: string;
  role?: string;
  period: string;
  stack: string[];
  liveUrl?: string | null;
  repoUrl?: string | null;
  /** Rank among featured builds (1 = first) */
  featured?: number;
  /** Why there's no public repo — shown as a mono note on the card */
  availability?: string;
}

export const curatedBuilds: CuratedBuild[] = copy.curatedBuilds.map((b) => ({
  slug: b.slug,
  name: b.name,
  tagline: b.tagline,
  summary: b.summary,
  highlights: b.highlights,
  context: b.context,
  role: b.role || undefined,
  period: b.period,
  stack: b.stack,
  liveUrl: b.liveUrl || null,
  repoUrl: b.repoUrl || null,
  featured: b.featured,
  availability: b.availability || undefined,
}));
