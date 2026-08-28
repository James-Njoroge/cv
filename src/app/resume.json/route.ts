import { getBuilds } from "@/lib/builds";
import { site } from "@/lib/site";

export const revalidate = 21600;

/**
 * JSON Resume (https://jsonresume.org/schema/) — the industry-standard
 * machine-readable resume. Recruiters' tools and ATS bots parse this directly.
 */
export async function GET() {
  const builds = await getBuilds();

  const resume = {
    $schema: "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json",
    basics: {
      name: site.fullName,
      label: site.role,
      email: site.email,
      phone: site.phone,
      url: site.url,
      image: `${site.url}/images/headshot2.jpg`,
      summary:
        "Kenyan-born AI engineer with an M.S. in Artificial Intelligence from Boston University and a cum laude B.A. in Computer Science & Applied Mathematics from Colgate. Founder and CEO of Kuja, CTO of Berverly Gardens. Builds ML systems end-to-end — LLM safety tooling, computer vision, and data pipelines used by global finance teams.",
      location: { city: "Boston", region: "MA", countryCode: "US" },
      profiles: [
        { network: "GitHub", username: site.githubUser, url: site.social.github },
        { network: "LinkedIn", username: "james-ngugi-njoroge", url: site.social.linkedin },
      ],
    },
    work: [
      {
        name: "Berverly Gardens",
        position: "Chief Technology Officer",
        startDate: "2026",
        summary: "Technology direction for a Kenyan property developer.",
        highlights: [
          "Designed the company platform: Cloudflare Pages, Workers, D1, and R2 with staff tools behind Cloudflare Access.",
          "Built lead capture end to end — form to Worker validation to database — with bot protection and campaign attribution.",
          "Moved content operations into an admin CMS so marketing ships without an engineering deploy.",
        ],
      },
      {
        name: "Kuja, Inc.",
        position: "Founder & CEO",
        url: "https://www.kuja.app",
        startDate: "2026-02",
        summary: "Event-led social network, live in production.",
        highlights: [
          "Founded and shipped Kuja solo — empty repository to production in under six months.",
          "Flutter client for web, iOS, and Android on Supabase: Auth, Postgres with row-level security, Storage, and Edge Functions.",
          "Built Spot Codes, a place-resolution scheme that locates an event without over-exposing user location.",
        ],
      },
      {
        name: "Mondelez International",
        position: "Digital Finance Intern",
        url: "https://www.mondelezinternational.com/",
        startDate: "2024-06",
        endDate: "2024-08",
        highlights: [
          "Automated global FP&A monthly ETL with Python, cutting processing time 75% (2 days/month saved).",
          "Reduced a 20-hour VBA financial-allocation process to 1 hour.",
          "Migrated the Incentive Program tracking tool from Excel to Essbase + PowerBI.",
          "Presented to the global CFO and treasurer, shaping future financial-technology decisions.",
        ],
      },
      {
        name: "Colgate University — Center for Learning, Teaching & Research",
        position: "Generative AI Student Explorer",
        startDate: "2024-08",
        endDate: "2025-06",
        highlights: ["Researched emerging GenAI tools and trends in academic environments."],
      },
      {
        name: "Colgate University — Computer Science",
        position: "Teaching Assistant (Data Structures & Algorithms)",
        startDate: "2023-01",
        endDate: "2024-12",
        highlights: ["Mentored students in Python and Java; debugging and concept support."],
      },
    ],
    education: [
      {
        institution: "Boston University",
        studyType: "Master of Science",
        area: "Artificial Intelligence",
        startDate: "2025",
        endDate: "2026",
      },
      {
        institution: "Colgate University",
        studyType: "Bachelor of Arts",
        area: "Computer Science & Applied Mathematics",
        startDate: "2021",
        endDate: "2025",
        note: "Cum Laude",
      },
    ],
    skills: [
      {
        name: "Languages",
        keywords: ["Python", "Java", "TypeScript", "JavaScript", "R", "C", "SQL", "MATLAB"],
      },
      {
        name: "AI & Data",
        keywords: [
          "Machine Learning",
          "NLP",
          "scikit-learn",
          "ETL",
          "Statistical Modeling",
          "PowerBI",
          "Tableau",
        ],
      },
      { name: "Systems", keywords: ["Docker", "AWS", "MongoDB", "Next.js", "Git"] },
    ],
    projects: builds.map((b) => ({
      name: b.name,
      description: b.summary ?? b.tagline,
      highlights: b.highlights,
      keywords: b.stack,
      roles: b.role ? [b.role] : undefined,
      entity: b.context,
      url: b.liveUrl ?? b.repoUrl ?? site.url,
      source: b.repoUrl ?? undefined,
    })),
    interests: [
      { name: "LLM safety", keywords: ["prompt injection", "agent guardrails"] },
      { name: "Football analytics", keywords: ["Premier League", "predictive modeling"] },
      { name: "AI for Africa" },
    ],
    meta: {
      canonical: `${site.url}/resume.json`,
      version: "1.0.0",
      lastModified: new Date().toISOString(),
    },
  };

  return new Response(JSON.stringify(resume, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
