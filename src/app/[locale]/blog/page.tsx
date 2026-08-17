import Link from "next/link";

import { Metadata } from "next";

import { Kicker, Sep } from "@/components/jn/atoms";
import { Reveal } from "@/components/jn/reveal";
import { SectionHeading } from "@/components/jn/section-heading";
import { JsonLd } from "@/components/json-ld";
import { getAllPosts } from "@/lib/blog";
import { copy, fill } from "@/lib/copy";
import { site } from "@/lib/site";

type Props = { params: Promise<{ locale: string }> };

const c = copy.blogPage;
const SUBTITLE = c.subtitle;

export function generateMetadata(): Metadata {
  return {
    title: c.metaTitle,
    description: SUBTITLE,
    alternates: {
      canonical: "/blog",
      types: { "application/rss+xml": `${site.url}/feed.xml` },
    },
    openGraph: {
      title: `Writing · ${site.name}`,
      description: SUBTITLE,
      images: [{ url: "/og?title=Writing", width: 1200, height: 630 }],
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  const posts = getAllPosts();

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `Writing · ${site.name}`,
    description: SUBTITLE,
    url: `${site.url}/blog`,
    inLanguage: locale,
    author: { "@id": `${site.url}/#person` },
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.description,
      datePublished: p.date,
      url: `${site.url}/blog/${p.slug}`,
    })),
  };

  return (
    <main className="container-jn pb-28 pt-32">
      <Link
        href="/"
        className="font-mono text-xs font-medium leading-none text-muted-foreground hover:text-primary"
      >
        {c.backLabel}
      </Link>

      <div className="mt-8">
        <SectionHeading
          index={copy.sections.writing.index}
          title={c.title}
          meta={posts.length > 0 ? fill(c.meta, { count: posts.length }) : c.metaEmpty}
        />
      </div>

      <p className="-mt-6 mb-10 max-w-[60ch] text-pretty leading-relaxed text-muted-foreground">
        {SUBTITLE}
      </p>

      {posts.length === 0 ? (
        <div className="hatch rounded-xl border border-dashed border-border p-12 text-center">
          <p className="m-0 font-display text-lg font-semibold">{c.emptyTitle}</p>
          <p className="mx-auto mt-2 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
            {c.emptyBody}
          </p>
          <a
            href="/feed.xml"
            className="mt-5 inline-block font-mono text-[11px] font-bold uppercase leading-none tracking-[0.06em] text-primary hover:text-amber"
          >
            {c.rssLabel}
          </a>
        </div>
      ) : (
        <div className="flex flex-col gap-3.5">
          {posts.map((post, i) => (
            <Reveal key={post.slug} index={i}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary sm:p-7"
              >
                <span className="mb-3 flex flex-wrap items-center gap-2.5">
                  <Kicker>
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                  </Kicker>
                  <Sep />
                  <Kicker tone="amber">
                    {post.readingTime} {copy.writing.readingTimeSuffix}
                  </Kicker>
                  {post.draft && (
                    <>
                      <Sep />
                      <Kicker tone="amber">draft</Kicker>
                    </>
                  )}
                </span>
                <span className="font-display text-xl font-semibold leading-tight tracking-[-0.02em] text-foreground transition-colors group-hover:text-primary">
                  {post.title}
                </span>
                <span className="mt-2 text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground">
                  {post.description}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      )}

      <JsonLd data={blogJsonLd} />
    </main>
  );
}
