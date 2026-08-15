# Blog content

Every `.mdx` file in this folder becomes a post at `/blog/<filename>`. To
publish, drop a new file here and push — no code changes, no config.

## Add a post

Create `content/blog/my-post-slug.mdx`:

```mdx
---
title: "Your headline"
description: "One-sentence summary — used for SEO and social cards."
date: "2026-07-01" # ISO date; controls ordering
tags: ["ai", "football"] # optional
draft: false # optional; true hides it in production
cover: # optional; picks the generated cover art
  pattern: "beadwork" # beadwork | shuka | mudcloth | summit | kitenge
  accent: "green" # green | red | gold | indigo | teal
---

Write your post in Markdown / MDX here. Headings, lists, code blocks,
links, images, and blockquotes are all styled.
```

That's it. The post automatically appears in:

- the `/blog` index (newest first)
- the RSS feed at `/feed.xml`
- the sitemap at `/sitemap.xml`

Reading time is computed for you. Drafts (`draft: true`) are visible when
running `npm run dev` but hidden in production builds.
