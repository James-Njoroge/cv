import Link from "next/link";
import { notFound } from "next/navigation";

import { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";

import { Kicker, Pill, Sep } from "@/components/jn/atoms";
import { JsonLd } from "@/components/json-ld";
import { getAllPosts, getPost } from "@/lib/blog";
import { copy } from "@/lib/copy";
import { site } from "@/lib/site";

type Props = { params: { locale: string; slug: string } };

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const post = getPost(params.slug);
  if (!post) return {};
  const ogUrl = `/og?title=${encodeURIComponent(post.title)}&subtitle=${encodeURIComponent("Writing")}`;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      authors: [site.fullName],
      tags: post.tags,
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.description },
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

export default function BlogPostPage({ params }: Props) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    keywords: post.tags?.join(", "),
    url: `${site.url}/blog/${post.slug}`,
    mainEntityOfPage: `${site.url}/blog/${post.slug}`,
    author: { "@id": `${site.url}/#person`, name: site.fullName, url: site.url },
    publisher: { "@id": `${site.url}/#person` },
  };

  return (
    <main className="mx-auto w-full max-w-[720px] px-5 pb-28 pt-32 sm:px-7">
      <Link
        href="/blog"
        className="font-mono text-xs font-medium leading-none text-muted-foreground hover:text-primary"
      >
        {copy.blogPage.postBackLabel}
      </Link>

      <article className="mt-8">
        <header className="border-b border-border pb-7">
          <div className="mb-4 flex flex-wrap items-center gap-2.5">
            <Kicker>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </Kicker>
            <Sep />
            <Kicker tone="amber">
              {post.readingTime} {copy.writing.readingTimeSuffix}
            </Kicker>
          </div>

          <h1 className="m-0 text-balance font-display text-[clamp(2rem,5vw,3rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
            {post.title}
          </h1>

          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            {post.description}
          </p>

          {post.tags && post.tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Pill key={tag}>#{tag}</Pill>
              ))}
            </div>
          )}
        </header>

        <div className="prose-jn">
          <MDXRemote source={post.content} />
        </div>
      </article>

      <JsonLd data={articleJsonLd} />
    </main>
  );
}
