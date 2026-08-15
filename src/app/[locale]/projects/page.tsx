import Link from "next/link";

import { Metadata } from "next";

import { BuildCard } from "@/components/jn/build-card";
import { Reveal } from "@/components/jn/reveal";
import { SectionHeading } from "@/components/jn/section-heading";
import { JsonLd } from "@/components/json-ld";
import { getBuilds } from "@/lib/builds";
import { site } from "@/lib/site";

type Props = { params: { locale: string } };

const SUBTITLE =
  "Everything the model has shipped — course work, client platforms, and a product with users. Public repos link straight to the code.";

export function generateMetadata(): Metadata {
  return {
    title: "What the model has built",
    description: SUBTITLE,
    alternates: { canonical: "/projects" },
    openGraph: {
      title: `Projects · ${site.name}`,
      description: SUBTITLE,
      images: [{ url: "/og?title=Projects", width: 1200, height: 630 }],
    },
  };
}

export default async function ProjectsPage({ params: { locale } }: Props) {
  const builds = await getBuilds();

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Projects · ${site.name}`,
    description: SUBTITLE,
    url: `${site.url}/projects`,
    inLanguage: locale,
    hasPart: builds.map((b) => ({
      "@type": "SoftwareSourceCode",
      name: b.name,
      description: b.tagline,
      codeRepository: b.repoUrl ?? undefined,
      url: b.liveUrl ?? b.repoUrl ?? `${site.url}/projects`,
      keywords: b.stack.join(", "),
    })),
  };

  return (
    <main className="container-jn pb-28 pt-32">
      <Link
        href="/"
        className="font-mono text-xs font-medium leading-none text-muted-foreground hover:text-primary"
      >
        &#8592; jn&#8209;1
      </Link>

      <div className="mt-8">
        <SectionHeading
          index="03"
          title="What the model has built."
          meta={`${builds.length} builds`}
        />
      </div>

      <p className="-mt-6 mb-10 max-w-[60ch] text-pretty leading-relaxed text-muted-foreground">
        {SUBTITLE}
      </p>

      <div className="grid gap-3.5 lg:grid-cols-2">
        {builds.map((build, i) => (
          <Reveal key={build.slug} index={i} className="h-full">
            <BuildCard build={build} detailed />
          </Reveal>
        ))}
      </div>

      <a
        href={site.social.github}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-block font-mono text-xs font-bold uppercase leading-none tracking-[0.06em] text-primary hover:text-amber"
      >
        All repos on GitHub &#8594;
      </a>

      <JsonLd data={collectionJsonLd} />
    </main>
  );
}
