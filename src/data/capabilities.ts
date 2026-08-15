/**
 * Capabilities (confidence bars) and evals (coursework).
 *
 * Confidence values are self-reported and the section says so — they're a
 * relative ranking of what James reaches for first, not a benchmark score.
 */

export interface Capability {
  name: string;
  /** 0–1, rendered as both bar width and a `.NN` mono readout */
  confidence: number;
}

export interface CapabilityGroup {
  label: string;
  /** Which accent the bars use — never more than two accent uses per viewport */
  accent: "signal" | "amber";
  items: Capability[];
}

export const capabilityGroups: CapabilityGroup[] = [
  {
    label: "Languages",
    accent: "signal",
    items: [
      { name: "Python", confidence: 0.96 },
      { name: "SQL", confidence: 0.9 },
      { name: "TypeScript", confidence: 0.88 },
      { name: "Java", confidence: 0.85 },
      { name: "R", confidence: 0.74 },
      { name: "MATLAB", confidence: 0.7 },
      { name: "C", confidence: 0.68 },
    ],
  },
  {
    label: "ML & AI",
    accent: "amber",
    items: [
      { name: "scikit-learn", confidence: 0.92 },
      { name: "LLM systems", confidence: 0.9 },
      { name: "NLP", confidence: 0.89 },
      { name: "PyTorch", confidence: 0.88 },
      { name: "Transformers", confidence: 0.86 },
      { name: "Computer vision", confidence: 0.84 },
      { name: "TensorFlow", confidence: 0.8 },
    ],
  },
  {
    label: "Data & platform",
    accent: "signal",
    items: [
      { name: "ETL pipelines", confidence: 0.93 },
      { name: "Power BI", confidence: 0.91 },
      { name: "Cloudflare", confidence: 0.85 },
      { name: "Essbase / VBA", confidence: 0.82 },
      { name: "Docker / AWS", confidence: 0.78 },
      { name: "NoSQL", confidence: 0.76 },
      { name: "Supabase", confidence: 0.87 },
    ],
  },
];

export interface EvalGroup {
  label: string;
  /** Mono sub-label, e.g. "M.S. Artificial Intelligence" */
  detail: string;
  courses: string[];
}

export const evalGroups: EvalGroup[] = [
  {
    label: "Boston University",
    detail: "M.S. Artificial Intelligence · GPA 3.64",
    courses: [
      "Natural Language Processing",
      "Machine Learning",
      "Artificial Intelligence",
      "Image & Video Computing",
      "Data Science Tools & Applications",
      "Computer Graphics",
      "Computational Fabrication",
      "Advanced Topics in CS",
    ],
  },
  {
    label: "Colgate University",
    detail: "B.A. Computer Science & Applied Mathematics",
    courses: [
      "Data Structures & Algorithms",
      "Linear Algebra",
      "Real Analysis",
      "Numerical Analysis",
      "Computational Mathematics",
      "Database Management Systems",
      "Probability",
      "Calculus",
    ],
  },
];
