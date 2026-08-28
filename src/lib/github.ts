import snapshot from "@/data/github-snapshot.json";
import { ProjectMeta, projectsMeta } from "@/data/projects-meta";

import { site } from "./site";

/** Slimmed-down GitHub repo shape shared by the live API and the local snapshot. */
export interface RepoData {
  name: string;
  description: string | null;
  htmlUrl: string;
  homepage: string | null;
  language: string | null;
  languages?: string[];
  topics: string[];
  stars: number;
  createdAt: string;
  pushedAt: string;
}

export interface Project extends RepoData {
  meta?: ProjectMeta;
  displayName: string;
  tagline: string;
  liveUrl: string | null;
  stack: string[];
}

interface GitHubApiRepo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  stargazers_count: number;
  created_at: string;
  pushed_at: string;
  fork: boolean;
  private: boolean;
}

const REVALIDATE_SECONDS = 60 * 60 * 6; // refresh from GitHub every 6 hours

/**
 * Fetch public repos straight from GitHub. Runs on the server with ISR, so
 * the site stays current without rebuilds. Returns null on any failure so
 * callers can fall back to the bundled snapshot.
 */
async function fetchLiveRepos(): Promise<RepoData[] | null> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${site.githubUser}/repos?per_page=100&sort=pushed`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
          ...(process.env.GITHUB_TOKEN
            ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
            : {}),
        },
        next: { revalidate: REVALIDATE_SECONDS },
      }
    );
    if (!res.ok) return null;
    const repos = (await res.json()) as GitHubApiRepo[];
    return repos
      .filter((r) => !r.fork && !r.private)
      .map((r) => ({
        name: r.name,
        description: r.description,
        htmlUrl: r.html_url,
        homepage: r.homepage,
        language: r.language,
        topics: r.topics ?? [],
        stars: r.stargazers_count,
        createdAt: r.created_at,
        pushedAt: r.pushed_at,
      }));
  } catch {
    return null;
  }
}

function toProject(repo: RepoData): Project {
  const meta = projectsMeta[repo.name];
  const homepage = repo.homepage && repo.homepage.trim() !== "" ? repo.homepage : null;
  return {
    ...repo,
    meta,
    displayName: meta?.displayName ?? repo.name,
    tagline: meta?.tagline ?? meta?.summary ?? repo.description ?? "",
    // meta.liveUrl === null means "suppress the homepage"; undefined means "use it"
    liveUrl: meta?.liveUrl === undefined ? homepage : meta.liveUrl,
    stack: meta?.stack ?? (repo.language ? [repo.language] : []),
  };
}

/**
 * All public, non-fork projects: live GitHub data when reachable, bundled
 * snapshot otherwise. Featured projects first (by rank), then by recency.
 */
export async function getProjects(): Promise<Project[]> {
  const live = await fetchLiveRepos();
  const repos = live ?? (snapshot as RepoData[]);
  return repos
    .map(toProject)
    .filter((p) => !p.meta?.hidden)
    .sort((a, b) => {
      const ra = a.meta?.featured ?? Number.MAX_SAFE_INTEGER;
      const rb = b.meta?.featured ?? Number.MAX_SAFE_INTEGER;
      if (ra !== rb) return ra - rb;
      if (b.stars !== a.stars) return b.stars - a.stars;
      return new Date(b.pushedAt).getTime() - new Date(a.pushedAt).getTime();
    });
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getProjects();
  return projects.filter((p) => p.meta?.featured !== undefined);
}
