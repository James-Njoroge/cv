/**
 * Hand-curated metadata layered on top of live GitHub repo data.
 * The GitHub API supplies the facts (stars, language, last push);
 * this file supplies the story (taglines, metrics, and context).
 *
 * To feature a new repo: add an entry keyed by repo name and give it a
 * `featured` rank. Everything else is optional.
 */

export interface ProjectMeta {
  /** GitHub repo name (case-sensitive) */
  repo: string;
  displayName?: string;
  /** One-line hook shown on cards */
  tagline?: string;
  /** Longer blurb that overrides the GitHub description */
  summary?: string;
  /** Metric / achievement chips, e.g. "82% R²" */
  highlights?: string[];
  /** Display rank on /projects (1 = first), shared with the curated builds. Unranked repos sort after. */
  featured?: number;
  /** Where/why it was built, e.g. "Boston University · CS 506" */
  context?: string;
  role?: string;
  /** Override or suppress the repo homepage (set null to suppress) */
  liveUrl?: string | null;
  /** Display stack (falls back to GitHub language data) */
  stack?: string[];
  hidden?: boolean;
}

export const projectsMeta: Record<string, ProjectMeta> = {
  FootyLiveliness: {
    repo: "FootyLiveliness",
    displayName: "Footy Liveliness",
    tagline:
      "Machine learning that predicts how exciting a Premier League match will be — before kickoff.",
    summary:
      "An end-to-end ML system that scores upcoming Premier League fixtures by predicted 'liveliness', helping fans pick the best match to watch. Covers the full lifecycle: scraping and feature engineering on historical team/player stats, model iteration from R² −0.15 to 0.82, and a production web app serving live rankings.",
    highlights: ["0.821 R²", "90% top-10 hit rate", "0.896 Spearman ρ", "Live in production"],
    featured: 6,
    context: "Boston University · CS 506 Data Science",
    role: "ML engineering, modeling & deployment (team of 3)",
    stack: ["Python", "scikit-learn", "Flask", "JavaScript", "Heroku"],
  },
  "nlp-final": {
    repo: "nlp-final",
    displayName: "Premier League NLP",
    tagline: "Forecasting EPL team performance with natural language processing.",
    summary:
      "Applied NLP techniques to three decades of English Premier League data (1993–2024) to predict team performance metrics — from preprocessing pipelines and custom train/validation/test splits to model evaluation and error analysis.",
    highlights: ["30+ seasons of EPL data", "Full NLP pipeline"],
    featured: 7,
    context: "Colgate University · COSC 426 NLP",
    role: "Modeling & evaluation (team of 3)",
    stack: ["Python", "Jupyter", "Transformers"],
  },
  // Retired venture — kept here only to keep the repo out of the live feed.
  "sloop-landing-page": {
    repo: "sloop-landing-page",
    hidden: true,
  },
  "nlp-midterm": {
    repo: "nlp-midterm",
    displayName: "Multilingual NLP Models",
    tagline: "Benchmarking language models across multiple languages.",
    summary:
      "Course project building a reusable data-processing template extended across several languages, comparing model behavior and performance per language.",
    context: "Colgate University · COSC 426 NLP",
    role: "With Toby Xu",
    stack: ["Python"],
  },
  cv: {
    repo: "cv",
    displayName: "jnjoroge.dev",
    tagline: "This website — an open-source, SEO-first portfolio and blog.",
    summary:
      "The site you are reading: a Next.js portfolio that pulls projects live from GitHub, ships structured data for search engines and LLMs, and doubles as a printable resume.",
    featured: 3,
    context: "Personal · open source",
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
  },
};
