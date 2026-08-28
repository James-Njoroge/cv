import Link from "next/link";

import { BuildCard } from "@/components/jn/build-card";
import { Reveal } from "@/components/jn/reveal";
import { SectionHeading } from "@/components/jn/section-heading";
import { getHomeBuilds } from "@/lib/builds";
import { copy } from "@/lib/copy";

export async function BuiltSection() {
  const builds = await getHomeBuilds();

  return (
    <section id="built" className="container-jn scroll-mt-24 pb-28">
      <SectionHeading {...copy.sections.built} />

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
          {copy.buildCard.allBuildsLabel}
        </Link>
      </Reveal>
    </section>
  );
}
