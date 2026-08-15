/**
 * Builds that don't live in a public GitHub repo — coursework under an
 * academic-integrity hold, private product code, and client platforms.
 *
 * These are merged with the live GitHub feed in `@/lib/builds`. Anything here
 * outranks a repo of the same rank, because these are the strongest work.
 */
export interface CuratedBuild {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  /** Metric chips — real numbers only */
  highlights: string[];
  /** Where/why it was built */
  context: string;
  role?: string;
  period: string;
  stack: string[];
  liveUrl?: string | null;
  repoUrl?: string | null;
  /** Rank among featured builds (1 = first) */
  featured?: number;
  /** Why there's no public repo — shown as a mono note on the card */
  availability?: string;
}

export const curatedBuilds: CuratedBuild[] = [
  {
    slug: "agentgate",
    name: "AgentGate",
    tagline: "A policy-aware AI firewall that sits in front of LLM agents.",
    summary:
      "A reverse-proxy firewall that secures LLM agents by separating policy-based tool access from a five-layer NLP safety pipeline: semantic scope checking, prompt-injection detection, PII redaction, attachment inspection, and multimodal tool-misuse guarding. Prompt Guard 2 and Llama Guard sit behind an LLM-assisted policy compiler with deterministic validation, so a model proposes the rule and the system still proves it.",
    highlights: ["96.5% held-out accuracy", "4.6% false-positive rate", "5-layer safety pipeline"],
    context: "Boston University · M.S. AI",
    role: "Design, pipeline engineering & evaluation",
    period: "Spring 2026",
    stack: ["Python", "FastAPI", "Transformers", "Llama Guard", "Prompt Guard 2"],
    featured: 1,
    availability: "Private — academic integrity hold",
  },
  {
    slug: "visionsentry",
    name: "VisionSentry",
    tagline: "Thermal and RGB detection and tracking for small UAVs.",
    summary:
      "A modular computer-vision pipeline that finds and follows small drones across thermal and RGB imagery, pairing a YOLOv12 detector with a BoT-SORT multi-object tracker and MOT-format trajectory export. Trained on a ~400K-image thermal dataset using sequence-level splits, so frames from one flight can never leak between train and validation.",
    highlights: ["0.92 mAP@0.50", "0.91 precision · 0.89 recall", "~400K thermal images"],
    context: "Boston University · M.S. AI",
    role: "Pipeline engineering, training & evaluation",
    period: "Spring 2026",
    stack: ["Python", "PyTorch", "YOLOv12", "BoT-SORT", "OpenCV"],
    featured: 2,
    availability: "Private — academic integrity hold",
  },
  {
    slug: "kuja",
    name: "Kuja",
    tagline: "An event-led social network — founded, built, and shipped solo.",
    summary:
      "Kuja is a live social network built around gatherings: find events near you on a map, host your own, RSVP, and meet the people who showed up. A Flutter client for web, iOS, and Android runs on Supabase — Auth, Postgres with row-level security, Storage, and Edge Functions — with Spot Codes resolving places without over-sharing anyone's location. Delaware C-corp, one founder, in production.",
    highlights: ["Live in production", "Web · iOS · Android", "Founder & CEO"],
    context: "Kuja, Inc. · own venture",
    role: "Founder, CEO & sole engineer",
    period: "Feb 2026 — present",
    stack: ["Flutter", "Dart", "Supabase", "Postgres", "Edge Functions", "Render"],
    liveUrl: "https://www.kuja.app",
    featured: 3,
    availability: "Private — product code",
  },
  {
    slug: "berverly-gardens-platform",
    name: "Berverly Gardens Platform",
    tagline: "The edge-native platform a Kenyan property developer runs on.",
    summary:
      "The company stack, designed and driven as CTO: a static marketing site on Cloudflare Pages, business logic on Workers, records in D1, media in R2, and staff tools behind Cloudflare Access with Google Workspace identity. Lead capture runs form to Worker to database with bot protection and campaign attribution, and an admin CMS moved content updates off the deploy pipeline entirely.",
    highlights: ["Pages + Workers + D1 + R2", "Lead capture to CRM", "CMS-driven content ops"],
    context: "Berverly Gardens · CTO",
    role: "Architecture, delivery & vendor management",
    period: "2026 — present",
    stack: ["Cloudflare Workers", "D1", "R2", "TypeScript", "React", "Vite"],
    featured: 4,
    availability: "Private — client platform",
  },
];
