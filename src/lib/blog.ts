import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

export interface PostFrontmatter {
  title: string;
  description: string;
  date: string; // ISO yyyy-mm-dd
  tags?: string[];
  draft?: boolean;
}

export interface Post extends PostFrontmatter {
  slug: string;
  content: string;
  readingTime: number; // minutes
}

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

function readingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

/** All non-draft posts, newest first. Safe if the directory is empty/missing. */
export function getAllPosts(): Post[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return (
    fs
      .readdirSync(BLOG_DIR)
      .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
      .filter((f) => f.toLowerCase() !== "readme.md")
      .map((file) => {
        const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
        const { data, content } = matter(raw);
        const fm = data as PostFrontmatter;
        return {
          ...fm,
          slug: file.replace(/\.mdx?$/, ""),
          content,
          readingTime: readingTime(content),
        };
      })
      // Guard against files missing required frontmatter (title/date)
      .filter((post) => Boolean(post.title && post.date))
      .filter((post) => process.env.NODE_ENV === "development" || !post.draft)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  );
}

export function getPost(slug: string): Post | null {
  return getAllPosts().find((p) => p.slug === slug) ?? null;
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  for (const post of getAllPosts()) (post.tags ?? []).forEach((t) => tags.add(t));
  return Array.from(tags).sort();
}
