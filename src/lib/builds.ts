/**
 * One list of everything the model has built.
 *
 * Two sources feed it: hand-written entries for work with no public repo
 * (`@/data/curated-builds`) and the live GitHub feed (`@/lib/github`). Both
 * normalise to `Build` so the section, the /projects page, resume.json, and
 * llms.txt all read from the same shape.
 */
import { curatedBuilds } from "@/data/curated-builds";

import { getProjects } from "./github";

export interface Build {
  slug: string;
  name: string;
  tagline: string;
  summary?: string;
  highlights: string[];
  context?: string;
  role?: string;
  period?: string;
  stack: string[];
  repoUrl: string | null;
  liveUrl: string | null;
  /** Rank among featured builds; unranked builds sort after by recency */
  featured?: number;
  /** Mono note explaining a missing repo, e.g. "Private — client platform" */
  availability?: string;
  stars: number;
  /** ISO timestamp, used only for sorting unranked builds */
  updatedAt: string;
}

/**
 * Every build, featured first (by rank), then most recently touched.
 * Falls back to the bundled GitHub snapshot when the API is unreachable.
 */
export async function getBuilds(): Promise<Build[]> {
  const repos = await getProjects();

  const fromGitHub: Build[] = repos.map((p) => ({
    slug: p.name,
    name: p.displayName,
    tagline: p.tagline,
    summary: p.meta?.summary,
    highlights: p.meta?.highlights ?? [],
    context: p.meta?.context,
    role: p.meta?.role,
    stack: p.stack,
    repoUrl: p.htmlUrl,
    liveUrl: p.liveUrl,
    // Curated builds hold ranks 1–4, so repo ranks are offset behind them.
    featured: p.meta?.featured === undefined ? undefined : p.meta.featured + curatedBuilds.length,
    stars: p.stars,
    updatedAt: p.pushedAt,
  }));

  const fromCurated: Build[] = curatedBuilds.map((b) => ({
    slug: b.slug,
    name: b.name,
    tagline: b.tagline,
    summary: b.summary,
    highlights: b.highlights,
    context: b.context,
    role: b.role,
    period: b.period,
    stack: b.stack,
    repoUrl: b.repoUrl ?? null,
    liveUrl: b.liveUrl ?? null,
    featured: b.featured,
    availability: b.availability,
    stars: 0,
    // Curated entries have no push timestamp; keep them ahead of stale repos.
    updatedAt: new Date().toISOString(),
  }));

  return [...fromCurated, ...fromGitHub].sort((a, b) => {
    const ra = a.featured ?? Number.MAX_SAFE_INTEGER;
    const rb = b.featured ?? Number.MAX_SAFE_INTEGER;
    if (ra !== rb) return ra - rb;
    if (b.stars !== a.stars) return b.stars - a.stars;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}

export async function getFeaturedBuilds(): Promise<Build[]> {
  return (await getBuilds()).filter((b) => b.featured !== undefined);
}
