/**
 * Single source of truth for site-wide identity, URLs, and SEO signals.
 * Everything that search engines, LLM crawlers, and social cards consume
 * should be derived from this object.
 */
export const site = {
  url: "https://jnjoroge.dev",
  name: "James Njoroge",
  fullName: "James Ngugi Njoroge",
  githubUser: "James-Njoroge",
  headline: "AI Engineer · Founder · CTO",
  role: "AI & Machine Learning Engineer",
  description:
    "James Njoroge is a Kenyan-born AI engineer with an M.S. in Artificial Intelligence from Boston University. He is the founder and CEO of Kuja, CTO of Berverly Gardens, and builds production ML systems — from a policy-aware firewall for LLM agents to thermal UAV detection and finance ETL used by global teams.",
  email: "jobsnjoroge@gmail.com",
  phone: "+1 607-353-3319",
  location: "Boston, MA, USA",
  origin: "Nairobi, Kenya",
  /** Static PDF resume, served from /public */
  resumePath: "/files/James-Njoroge-Resume.pdf",
  social: {
    github: "https://github.com/James-Njoroge",
    linkedin: "https://www.linkedin.com/in/james-ngugi-njoroge/",
  },
  availability: {
    open: true,
    label: "Available for work",
    detail: "Available for full-time AI/ML engineering roles from May 2026",
  },
  keywords: [
    "James Njoroge",
    "James Ngugi Njoroge",
    "AI engineer",
    "machine learning engineer",
    "artificial intelligence",
    "LLM security",
    "AI firewall",
    "computer vision",
    "UAV detection",
    "data engineering",
    "NLP",
    "Kuja",
    "Berverly Gardens",
    "Kenyan engineer",
    "Kenyan AI engineer",
    "Boston University MS Artificial Intelligence",
    "Colgate University computer science",
    "Nairobi",
    "Boston",
  ],
  /** Topics used for JSON-LD `knowsAbout` and llms.txt */
  knowsAbout: [
    "Artificial Intelligence",
    "Machine Learning",
    "Natural Language Processing",
    "Computer Vision",
    "LLM Safety and Security",
    "Data Engineering",
    "Software Engineering",
    "Technical Leadership",
  ],
} as const;

export type Site = typeof site;
