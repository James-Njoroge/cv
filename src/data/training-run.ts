/**
 * The training run — education as checkpoints, work as deployments.
 *
 * The ML metaphor lives in the labels; the sentences underneath stay plain,
 * specific, and human (jn-1 voice rule). Numbers appear only when they're real.
 */

export interface Checkpoint {
  /** Step number in the run, e.g. "0900" — drives the sticky loss-curve label */
  step: string;
  /** Mono kicker, e.g. "TRAINED AT COLGATE" */
  label: string;
  /** Stable key used by the scroll observer */
  id: string;
  title: string;
  /** Small honorific rendered in amber next to the title */
  honour?: string;
  period?: string;
  body: string;
  tags: string[];
  /** Optional nested "data augmentation" block (study abroad, etc.) */
  augmentation?: {
    kicker: string;
    title: string;
    period: string;
    detail: string;
  };
}

export const checkpoints: Checkpoint[] = [
  {
    id: "ideation",
    step: "0000",
    label: "Ideated in Kenya",
    title: "Nairobi, Kenya",
    body: "Initialized from scratch. Curiosity, a very slow internet connection, and a habit of taking things apart to see what was inside — the pretraining corpus for everything that came after.",
    tags: ["random init", "high curiosity"],
  },
  {
    id: "pretraining",
    step: "0300",
    label: "Pretrained in Connecticut",
    title: "Choate Rosemary Hall",
    period: "2018 — 2021",
    body: "High school diploma, and a first real pass over a broad dataset: 5,000 miles from home, first lines of code, first taste of building for other people.",
    tags: ["broad corpus", "first code"],
  },
  {
    id: "training",
    step: "0900",
    label: "Trained at Colgate",
    title: "Colgate University",
    honour: "cum laude",
    period: "2021 — 2025",
    body: "B.A. Computer Science & Applied Mathematics. Where the objective function got specific: algorithms, proofs, and two years TA'ing data structures — teaching turned out to be the best regularizer.",
    augmentation: {
      kicker: "+ Data augmentation",
      title: "University of Manchester · study abroad",
      period: "Sep 2023 — Jan 2024",
      detail: "Artificial Intelligence · Probability · Database Systems",
    },
    tags: ["CS", "applied math", "teaching"],
  },
  {
    id: "fine-tuning",
    step: "1600",
    label: "Fine-tuned at Boston University",
    title: "Boston University",
    period: "Sep 2025 — May 2026",
    body: "M.S. Artificial Intelligence, 3.64 GPA. A narrow, high-quality dataset: NLP, machine learning, image and video computing, and the engineering that separates a notebook from something in production.",
    tags: ["M.S. AI", "LLMs", "computer vision", "ML systems"],
  },
];

export interface Deployment {
  org: string;
  role: string;
  link?: string;
  /** Rendered right-aligned in mono. Use `status` for live roles instead. */
  period: string;
  /** Marks the row as currently running (green period + pulse dot) */
  live?: boolean;
  location?: string;
  points: string[];
  stack: string[];
}

/**
 * Ordered newest first. The two live rows lead: they're the strongest current
 * signal, and one of them is a company he owns.
 */
export const deployments: Deployment[] = [
  {
    org: "Berverly Gardens",
    role: "Chief Technology Officer",
    period: "2026 — present",
    live: true,
    location: "Nairobi, Kenya",
    points: [
      "Own the technology direction of a Kenyan real-estate developer — architecture, delivery, and the systems the sales and marketing teams run on every day.",
      "Designed and drove the company platform: static site on Cloudflare Pages, business logic on Workers, records in D1, media in R2, and staff tools behind Cloudflare Access.",
      "Stood up lead capture end to end — form to Worker validation to database — with bot protection and campaign attribution, so marketing spend can finally be traced to revenue.",
      "Moved content operations out of code deploys and into an admin CMS, so the marketing team ships property updates without waiting on an engineer.",
      "Run the vendor relationship and delivery schedule against a fixed-term statement of work, with acceptance criteria written per deliverable.",
    ],
    stack: ["Cloudflare Workers", "D1", "R2", "Pages", "TypeScript", "React", "Google Workspace"],
  },
  {
    org: "Kuja, Inc.",
    role: "Founder & CEO",
    link: "https://www.kuja.app",
    period: "Feb 2026 — present",
    live: true,
    location: "Delaware, USA",
    points: [
      "Founded Kuja and shipped it solo — an event-led social network for finding gatherings, hosting them, and meeting people in the real world. Live at kuja.app.",
      "Empty repository to production in under six months: Flutter client for web, iOS, and Android on a Supabase backend — Auth, Postgres with row-level security, Storage, and Edge Functions.",
      "Built Spot Codes, a place-resolution scheme that pins an event to a real location without exposing more of anyone's whereabouts than it has to.",
      "Own the whole loop: product decisions, engineering, deploys, error monitoring, incident response, and the legal and privacy surface a live social product needs.",
    ],
    stack: ["Flutter", "Dart", "Supabase", "Postgres", "Edge Functions", "Render", "Sentry"],
  },
  {
    org: "Mondelez International",
    role: "Digital Finance Intern",
    link: "https://www.mondelezinternational.com/",
    period: "Jun — Aug 2024",
    location: "Chicago, IL",
    points: [
      "Rebuilt the global incentive-program tracker as an integrated Excel, Essbase, and Power BI solution.",
      "Automated the global FP&A team's monthly financial-data ETL in Python — 75% less processing time, roughly two days a month given back.",
      "Optimized financial allocations with VBA scripts, taking a 20-hour process down to one hour.",
      "Presented the finished tooling to executive leadership, including the global CFO and treasurer.",
    ],
    stack: ["Python", "Power BI", "Oracle Essbase", "Tableau", "VBA"],
  },
  {
    org: "Colgate Learning, Teaching & Research",
    role: "Generative AI Committee",
    link: "https://www.colgate.edu/about/offices-centers-institutes/centers-institutes/center-learning-teaching-and-research",
    period: "Sep 2024 — May 2025",
    location: "Hamilton, NY",
    points: [
      "Explored emerging generative-AI tools and assessed their real effect on student learning.",
      "Met weekly with staff and faculty to share findings and guide how GenAI gets used in coursework.",
    ],
    stack: ["GenAI", "academic policy"],
  },
  {
    org: "Colgate Data Science Collaboratory",
    role: "Research Intern",
    link: "https://shiny.colgate.edu/",
    period: "Jun — Aug 2023",
    location: "Hamilton, NY",
    points: [
      "Designed R Shiny interfaces that made complex R-based analyses usable by researchers across programming skill levels.",
      "Built and maintained applications for statistical analysis of geospatial data, social networks, and textual corpora.",
    ],
    stack: ["R", "R Shiny", "Statistics"],
  },
  {
    org: "Colgate Computer Science",
    role: "Teaching Assistant",
    link: "https://www.colgate.edu/academics/departments-programs/department-computer-science",
    period: "Aug 2023 — Dec 2024",
    location: "Hamilton, NY",
    points: [
      "Tutored Python and Java across four semesters, reinforcing data structures and algorithms.",
      "Ran debugging sessions and office hours, and mentored students through the courses that make people quit CS.",
    ],
    stack: ["Data structures", "Algorithms", "Mentoring"],
  },
  {
    org: "Sloop Software",
    role: "Co-founder",
    link: "https://www.colgate.edu/success-after-colgate/entrepreneurship-and-innovation/thought-action/thought-action-incubator",
    period: "venture",
    location: "Hamilton, NY",
    points: [
      "Student-run software company shipping client projects out of Colgate's Thought Into Action incubator.",
      "React Native and SQL builds, scoped and delivered end to end.",
    ],
    stack: ["React Native", "SQL", "JavaScript"],
  },
];
