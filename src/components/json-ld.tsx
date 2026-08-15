import { site } from "@/lib/site";

/**
 * Structured data for search engines and LLM crawlers. The Person node is
 * the canonical "who is James Njoroge" answer; keep it in sync with reality.
 */
export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${site.url}/#person`,
    name: site.name,
    alternateName: site.fullName,
    url: site.url,
    image: `${site.url}/images/headshot2.jpg`,
    email: `mailto:${site.email}`,
    jobTitle: ["Founder & CEO", "Chief Technology Officer", site.role],
    description: site.description,
    telephone: site.phone,
    worksFor: [
      {
        "@type": "Organization",
        name: "Kuja, Inc.",
        url: "https://www.kuja.app",
        description: "Event-led social network. James is the founder and CEO.",
      },
      {
        "@type": "Organization",
        name: "Berverly Gardens",
        description: "Kenyan property developer. James is the Chief Technology Officer.",
      },
    ],
    nationality: { "@type": "Country", name: "Kenya" },
    birthPlace: { "@type": "Place", name: "Nairobi, Kenya" },
    homeLocation: { "@type": "Place", name: site.location },
    alumniOf: [
      {
        "@type": "CollegeOrUniversity",
        name: "Boston University",
        description: "M.S. in Artificial Intelligence",
      },
      {
        "@type": "CollegeOrUniversity",
        name: "Colgate University",
        description: "B.A. in Computer Science and Applied Mathematics, cum laude",
      },
      { "@type": "HighSchool", name: "Choate Rosemary Hall" },
    ],
    knowsAbout: [...site.knowsAbout],
    sameAs: [site.social.github, site.social.linkedin],
    seeks: {
      "@type": "Demand",
      description: site.availability.detail,
    },
  };
}

export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: `${site.name} — ${site.headline}`,
    description: site.description,
    author: { "@id": `${site.url}/#person` },
    inLanguage: "en",
  };
}

export function profilePageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${site.url}/#profilepage`,
    url: site.url,
    mainEntity: { "@id": `${site.url}/#person` },
    isPartOf: { "@id": `${site.url}/#website` },
  };
}

export function JsonLd({
  data,
}: {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
}) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
