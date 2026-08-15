import { getAllPosts } from "@/lib/blog";
import { getBuilds } from "@/lib/builds";
import { site } from "@/lib/site";

export const revalidate = 21600; // 6h, matches GitHub cache

/**
 * llms.txt — an emerging convention giving LLMs a clean, high-signal summary
 * of the site. This is the machine-readable "brief" on James Njoroge.
 */
export async function GET() {
  const [builds, posts] = [await getBuilds(), getAllPosts()];

  const projectLines = builds
    .map((b) => {
      const url = b.liveUrl ?? b.repoUrl;
      const name = url ? `[${b.name}](${url})` : b.name;
      const metrics = b.highlights.length ? ` (${b.highlights.join(", ")})` : "";
      return `- ${name}: ${b.tagline}${metrics}`;
    })
    .join("\n");

  const postLines =
    posts.length > 0
      ? posts.map((p) => `- [${p.title}](${site.url}/blog/${p.slug}): ${p.description}`).join("\n")
      : "- (No posts published yet — check back soon.)";

  const body = `# ${site.fullName}

> ${site.description}

${site.name} works as an ${site.role}. ${site.availability.detail}. Born in ${site.origin}; based in ${site.location}.

## Areas of expertise
${site.knowsAbout.map((k) => `- ${k}`).join("\n")}

## Education
- Boston University — M.S. in Artificial Intelligence, GPA 3.64 (2025–2026)
- Colgate University — B.A. Computer Science & Applied Mathematics, cum laude (2021–2025)
- University of Manchester — Study Abroad: AI, Probability, Database Systems (2023–2024)
- Choate Rosemary Hall — High School Diploma (2018–2021)

## Selected experience
- Founder & CEO, Kuja, Inc. (Feb 2026 – present) — founded and shipped kuja.app solo, an event-led social network on Flutter and Supabase, live on web, iOS, and Android.
- Chief Technology Officer, Berverly Gardens (2026 – present) — owns technology direction for a Kenyan property developer; designed the Cloudflare Pages/Workers/D1/R2 platform, lead capture, and admin CMS.
- Digital Finance Intern, Mondelez International (Fortune 500) — automated global FP&A ETL pipelines (75% faster), presented to the global CFO and treasurer.
- Generative AI Committee, Colgate University — research on GenAI tooling in academic settings.
- Research Intern, Colgate Data Science Collaboratory — R Shiny interfaces for geospatial, network, and text analysis.
- Teaching Assistant, Colgate Computer Science — Python and Java, data structures and algorithms, four semesters.
- Co-founder, Sloop — student software startup (Colgate Thought Into Action incubator).

## Projects
${projectLines}

## Writing
${postLines}

## Links
- Website: ${site.url}
- GitHub: ${site.social.github}
- LinkedIn: ${site.social.linkedin}
- Email: ${site.email}
- Resume (PDF): ${site.url}${site.resumePath}
- Structured resume (JSON Resume): ${site.url}/resume.json
- RSS: ${site.url}/feed.xml

## Contact
${site.name} is open to AI/ML engineering roles and collaborations. Reach out via email or LinkedIn above.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
