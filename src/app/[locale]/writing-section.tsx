import Link from "next/link";

import { Kicker, Sep } from "@/components/jn/atoms";
import { Reveal } from "@/components/jn/reveal";
import { SectionHeading } from "@/components/jn/section-heading";
import { getAllPosts } from "@/lib/blog";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function WritingSection() {
  const posts = getAllPosts().slice(0, 4);

  return (
    <section id="writing" className="container-jn scroll-mt-24 pb-28">
      <SectionHeading
        index="05"
        title="Discover the model's thoughts."
        meta={posts.length > 0 ? `${posts.length} entries · sampled at temp 0.7` : "warming up"}
      />

      {posts.length === 0 ? (
        <Reveal className="hatch rounded-xl border border-dashed border-border p-12 text-center">
          <p className="m-0 font-display text-lg font-semibold">No tokens emitted yet.</p>
          <p className="mx-auto mt-2 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
            The first entries are being written — on LLM safety, shipping a product alone, and what
            the Nairobi-to-Boston route actually teaches you. The feed will know before anyone else.
          </p>
          <a
            href="/feed.xml"
            className="mt-5 inline-block font-mono text-[11px] font-bold uppercase leading-none tracking-[0.06em] text-primary hover:text-amber"
          >
            Subscribe via RSS &#8594;
          </a>
        </Reveal>
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
                  <Kicker tone="amber">{post.readingTime} min read</Kicker>
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

          <Reveal className="mt-4">
            <Link
              href="/blog"
              className="font-mono text-xs font-bold uppercase leading-none tracking-[0.06em] text-primary hover:text-amber"
            >
              All writing &#8594;
            </Link>
          </Reveal>
        </div>
      )}
    </section>
  );
}
