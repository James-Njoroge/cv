/**
 * Single source of truth for site-wide identity, URLs, and SEO signals.
 * Everything that search engines, LLM crawlers, and social cards consume
 * should be derived from this object.
 *
 * The prose half (headline, description, availability wording) comes from
 * `content/site-copy.json` so it's editable in the copy studio; the structural
 * half (URLs, handles, paths) stays here.
 */
import { copy } from "./copy";

const c = copy.site;

export const site = {
  url: "https://jnjoroge.dev",
  name: c.name,
  fullName: c.fullName,
  githubUser: "James-Njoroge",
  headline: c.headline,
  role: c.role,
  description: c.description,
  email: c.email,
  phone: c.phone,
  location: c.location,
  origin: c.origin,
  /** Static PDF resume, served from /public */
  resumePath: "/files/James-Njoroge-Resume.pdf",
  social: {
    github: "https://github.com/James-Njoroge",
    linkedin: "https://www.linkedin.com/in/james-ngugi-njoroge/",
  },
  availability: {
    open: true,
    label: c.availabilityLabel,
    detail: c.availabilityDetail,
  },
  keywords: c.keywords,
  /** Topics used for JSON-LD `knowsAbout` and llms.txt */
  knowsAbout: c.knowsAbout,
} as const;

export type Site = typeof site;
