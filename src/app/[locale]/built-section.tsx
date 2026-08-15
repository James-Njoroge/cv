import Link from "next/link";

import { BuildCard } from "@/components/jn/build-card";
import { Reveal } from "@/components/jn/reveal";
import { SectionHeading } from "@/components/jn/section-heading";
import { getFeaturedBuilds } from "@/lib/builds";

export async function BuiltSection() {
  const builds = await getFeaturedBuilds();

  return (
    <section id="built" className="container-jn scroll-mt-24 pb-28">
      <SectionHeading index="03" title="What the model has built." meta="shipped · not shelved" />

      <div className="grid gap-3.5 lg:grid-cols-2">
        {builds.map((build, i) => (
          <Reveal key={build.slug} index={i} className="h-full">
            <BuildCard build={build} detailed />
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-8">
        <Link
          href="/projects"
          className="font-mono text-xs font-bold uppercase leading-none tracking-[0.06em] text-primary hover:text-amber"
        >
          Everything else &#8594;
        </Link>
      </Reveal>
    </section>
  );
}
