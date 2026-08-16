/**
 * Human labels for the copy studio.
 *
 * The studio renders `content/site-copy.json` generically, so it works without
 * any of this — but a bare key like `hero.titleLead` tells you nothing about
 * where it lands on the page. This file supplies the "where does this appear"
 * context for the fields worth explaining.
 *
 * Paths use `.` for object keys and `[]` for array items, so one entry covers
 * every row of a list: `deployments[].role` labels the role on all seven jobs.
 */

export interface FieldHelp {
  label?: string;
  hint?: string;
  /** Force a textarea regardless of current length */
  multiline?: boolean;
}

/** Top-level groups, in the order they appear on the page. */
export const GROUPS: Array<{ key: string; title: string; blurb: string }> = [
  {
    key: "site",
    title: "Identity",
    blurb: "Name, contact details, and the sentence search engines quote.",
  },
  { key: "nav", title: "Navigation", blurb: "The links in the fixed instrument bar at the top." },
  {
    key: "hero",
    title: "Hero",
    blurb: "The first screen — headline, intro, terminal, buttons, spec card.",
  },
  {
    key: "sections",
    title: "Section headings",
    blurb: "The numbered heading above each section. {count} fills itself in.",
  },
  {
    key: "checkpoints",
    title: "01 · Checkpoints",
    blurb: "Education, told as training checkpoints.",
  },
  {
    key: "deploymentCard",
    title: "01 · Deployment card",
    blurb: "The green card that wraps the job list.",
  },
  { key: "deployments", title: "01 · Deployments", blurb: "Jobs and ventures, newest first." },
  {
    key: "lossCurve",
    title: "01 · Loss curve",
    blurb: "Labels on the sticky chart beside the checkpoints.",
  },
  {
    key: "capabilityGroups",
    title: "02 · Capabilities",
    blurb: "Skill bars. Confidence is 0–1 and sorts itself highest-first.",
  },
  {
    key: "curatedBuilds",
    title: "03 · Builds",
    blurb: "Projects with no public repo. GitHub repos come from projects-meta.ts.",
  },
  {
    key: "buildCard",
    title: "03 · Build card labels",
    blurb: "Shared link labels on every project card.",
  },
  { key: "evalGroups", title: "04 · Evals", blurb: "Coursework, grouped by institution." },
  { key: "writing", title: "05 · Writing", blurb: "The writing section and its empty state." },
  {
    key: "chat",
    title: "06 · Chat",
    blurb: "Every line the contact chatbot can say, plus the contact cards.",
  },
  { key: "footer", title: "Footer", blurb: "The bottom bar." },
  { key: "projectsPage", title: "Page · /projects", blurb: "The standalone projects page." },
  { key: "blogPage", title: "Page · /blog", blurb: "The blog index and post pages." },
  {
    key: "seo",
    title: "Search & social",
    blurb: "Link-preview image text and the structured data Google reads.",
  },
];

export const FIELD_HELP: Record<string, FieldHelp> = {
  // Identity
  "site.headline": { label: "Headline", hint: "Browser tab, link previews. Sits after your name." },
  "site.role": { label: "Job title", hint: "Used in structured data as your primary role." },
  "site.description": {
    label: "Search description",
    hint: "The paragraph Google and ChatGPT quote. Aim for 150–300 characters.",
    multiline: true,
  },
  "site.availabilityLabel": { label: "Availability badge", hint: "Short status chip." },
  "site.availabilityDetail": {
    label: "Availability detail",
    hint: "Full sentence, used in structured data.",
  },
  "site.keywords": { label: "SEO keywords", hint: "Not shown on the page; helps search engines." },
  "site.knowsAbout": { label: "Expertise topics", hint: "Structured data + llms.txt." },

  // Nav
  "nav[].label": { label: "Link text", hint: "Lowercase, mono. Keep it to one word." },
  "nav[].href": { label: "Anchor", hint: "Must match a section id, e.g. #built." },

  // Hero
  "hero.kicker": { label: "Status line", hint: "Mono text beside the pulsing green dot." },
  "hero.titleLine1": { label: "Headline line 1", hint: "Sits on its own line." },
  "hero.titleLead": {
    label: "Headline line 2 — grey part",
    hint: "The muted lead-in before the bright word.",
  },
  "hero.titleAccent": {
    label: "Headline line 2 — bright part",
    hint: "The bright word on line 2.",
  },
  "hero.titleLine3": { label: "Headline line 3", hint: "The last line of the headline." },
  "hero.intro": {
    label: "Intro paragraph",
    hint: "The sentence under the headline.",
    multiline: true,
  },
  "hero.terminalEndpoint": { label: "Terminal title bar" },
  "hero.terminalUserLabel": { label: "Terminal — user prefix" },
  "hero.terminalUserLine": { label: "Terminal — the question" },
  "hero.terminalModelLabel": { label: "Terminal — model prefix" },
  "hero.stream": {
    label: "Typed answer",
    hint: "Types out one character at a time. Long lines are fine.",
    multiline: true,
  },
  "hero.ctaPrimary": { label: "Button 1 (green)" },
  "hero.ctaResume": { label: "Button 2 — résumé download" },
  "hero.ctaChat": { label: "Button 3 — jump to chat" },
  "hero.imageAlt": { label: "Photo alt text", hint: "Read aloud by screen readers." },
  "hero.specs[].key": { label: "Spec label", hint: "Left column of the card under your photo." },
  "hero.specs[].value": { label: "Spec value", hint: "Right column." },
  "hero.specs[].highlight": { label: "Show in green?" },

  // Section headings
  "sections.*.index": { label: "Number", hint: "Two digits, e.g. 03." },
  "sections.*.title": { label: "Heading" },
  "sections.*.meta": { label: "Right-hand note", hint: "{count} is filled in automatically." },
  "sections.*.metaEmpty": { label: "Right-hand note when empty" },

  // Checkpoints
  "checkpoints[].id": {
    label: "Internal id",
    hint: "Used by the scroll tracker — avoid changing.",
  },
  "checkpoints[].step": { label: "Step number", hint: "Shown as CKPT-0900." },
  "checkpoints[].label": { label: "Kicker", hint: "Small uppercase line above the title." },
  "checkpoints[].title": { label: "Institution" },
  "checkpoints[].honour": {
    label: "Honour",
    hint: "Amber text beside the title, e.g. cum laude. Blank to hide.",
  },
  "checkpoints[].period": { label: "Dates", hint: "Blank to hide." },
  "checkpoints[].body": { label: "Description", multiline: true },
  "checkpoints[].tags": { label: "Tags", hint: "Outline pills at the bottom of the card." },
  "checkpoints[].augmentation.kicker": { label: "Sub-block kicker" },
  "checkpoints[].augmentation.title": { label: "Sub-block title" },
  "checkpoints[].augmentation.period": { label: "Sub-block dates" },
  "checkpoints[].augmentation.detail": { label: "Sub-block detail" },

  // Deployment card
  "deploymentCard.step": { label: "Step number" },
  "deploymentCard.kicker": { label: "Kicker" },
  "deploymentCard.title": { label: "Heading" },
  "deploymentCard.body": {
    label: "Intro paragraph",
    hint: "{count} = number of jobs, {live} = how many are current.",
    multiline: true,
  },

  // Deployments
  "deployments[].org": { label: "Organisation" },
  "deployments[].role": { label: "Role" },
  "deployments[].link": { label: "Link", hint: "Makes the name clickable. Blank for no link." },
  "deployments[].period": { label: "Dates" },
  "deployments[].live": { label: "Currently running?", hint: "Adds the pulsing green dot." },
  "deployments[].location": { label: "Location" },
  "deployments[].points": {
    label: "Bullet points",
    hint: "One achievement each. Lead with the verb.",
    multiline: true,
  },
  "deployments[].stack": { label: "Tech chips" },

  // Loss curve
  "lossCurve.readoutLabel": { label: "Chart label" },
  "lossCurve.axisStart": { label: "Left axis label" },
  "lossCurve.axisEnd": { label: "Right axis label" },
  "lossCurve.activePrefix": { label: "Active-checkpoint prefix" },

  // Capabilities
  "capabilityGroups[].label": { label: "Column heading" },
  "capabilityGroups[].accent": { label: "Bar colour", hint: "Either signal (green) or amber." },
  "capabilityGroups[].items[].name": { label: "Skill" },
  "capabilityGroups[].items[].confidence": {
    label: "Confidence",
    hint: "0 to 1. Shown as .96 and as bar width.",
  },

  // Builds
  "curatedBuilds[].slug": { label: "Internal id" },
  "curatedBuilds[].name": { label: "Project name" },
  "curatedBuilds[].tagline": {
    label: "One-liner",
    hint: "Shown on the card under the name.",
    multiline: true,
  },
  "curatedBuilds[].summary": {
    label: "Full description",
    hint: "The paragraph on the card.",
    multiline: true,
  },
  "curatedBuilds[].highlights": { label: "Metric chips", hint: "Green pills. Real numbers only." },
  "curatedBuilds[].context": {
    label: "Where it was built",
    hint: "Kicker at the top of the card.",
  },
  "curatedBuilds[].role": { label: "Your role" },
  "curatedBuilds[].period": { label: "When" },
  "curatedBuilds[].stack": { label: "Tech chips" },
  "curatedBuilds[].liveUrl": { label: "Live URL", hint: "Blank hides the Live link." },
  "curatedBuilds[].repoUrl": { label: "Repo URL", hint: "Blank hides the Code link." },
  "curatedBuilds[].featured": { label: "Rank", hint: "1 = first on the homepage." },
  "curatedBuilds[].availability": {
    label: "Why no repo",
    hint: "Shown when there's no repo link.",
  },
  "buildCard.liveLabel": { label: "Live link text" },
  "buildCard.codeLabel": { label: "Code link text" },
  "buildCard.allBuildsLabel": { label: "Link to /projects" },

  // Evals
  "evalGroups[].label": { label: "Institution" },
  "evalGroups[].detail": { label: "Degree line" },
  "evalGroups[].passLabel": { label: "Badge text", hint: "The green badge on each row." },
  "evalGroups[].courses": { label: "Courses" },

  // Writing
  "writing.emptyTitle": { label: "Empty state — heading" },
  "writing.emptyBody": { label: "Empty state — body", multiline: true },
  "writing.rssLabel": { label: "RSS link text" },
  "writing.allLabel": { label: "Link to /blog" },
  "writing.readingTimeSuffix": {
    label: "Reading-time suffix",
    hint: "Follows the number, e.g. 3 min read.",
  },

  // Chat
  "chat.endpointLabel": { label: "Terminal title bar" },
  "chat.prompts.name": { label: "Question 1 — name", multiline: true },
  "chat.prompts.contact": { label: "Question 2 — email or phone", multiline: true },
  "chat.prompts.message": { label: "Question 3 — message", multiline: true },
  "chat.prompts.review": { label: "Confirmation prompt" },
  "chat.nameAcknowledgement": {
    label: "Name acknowledgement",
    hint: "{name} is what they typed. Prefixes question 2.",
  },
  "chat.placeholders.name": { label: "Placeholder — name" },
  "chat.placeholders.contact": { label: "Placeholder — contact" },
  "chat.placeholders.message": { label: "Placeholder — message" },
  "chat.labels.name": { label: "Screen-reader label — name" },
  "chat.labels.contact": { label: "Screen-reader label — contact" },
  "chat.labels.message": { label: "Screen-reader label — message" },
  "chat.reviewLabels.name": { label: "Summary row — name" },
  "chat.reviewLabels.contact": { label: "Summary row — contact" },
  "chat.reviewLabels.message": { label: "Summary row — message" },
  "chat.intents": { label: "Quick-reply chips", hint: "Clicking one pre-fills the message box." },
  "chat.validation.messageTooLong": {
    label: "Error — message too long",
    hint: "{count} = how many characters they typed.",
  },
  "chat.successMessage": { label: "Success line", hint: "{contact} = the address they gave." },
  "chat.successBadge": { label: "Success badge" },
  "chat.endpoints[].label": { label: "Card label" },
  "chat.endpoints[].value": { label: "Card value" },
  "chat.endpoints[].href": { label: "Card link" },

  // Footer
  "footer.identity": { label: "Left text", hint: "{name} and {year} fill themselves in." },
  "footer.closing": { label: "Right text" },
  "footer.closingLink": { label: "Right text — link" },
  "footer.links[].label": { label: "Link text" },
  "footer.links[].href": { label: "Link target" },

  // Pages
  "projectsPage.backLabel": { label: "Back link" },
  "projectsPage.title": { label: "Heading" },
  "projectsPage.metaTitle": { label: "Browser tab title" },
  "projectsPage.meta": { label: "Right-hand note", hint: "{count} fills itself in." },
  "projectsPage.subtitle": { label: "Intro paragraph", multiline: true },
  "projectsPage.allReposLabel": { label: "GitHub link text" },
  "blogPage.backLabel": { label: "Back link" },
  "blogPage.title": { label: "Heading" },
  "blogPage.metaTitle": { label: "Browser tab title" },
  "blogPage.meta": { label: "Right-hand note", hint: "{count} fills itself in." },
  "blogPage.metaEmpty": { label: "Right-hand note when empty" },
  "blogPage.subtitle": { label: "Intro paragraph", multiline: true },
  "blogPage.emptyTitle": { label: "Empty state — heading" },
  "blogPage.emptyBody": { label: "Empty state — body", multiline: true },
  "blogPage.rssLabel": { label: "RSS link text" },
  "blogPage.postBackLabel": { label: "Back link on a post" },

  // SEO
  "seo.ogKicker": { label: "Link preview — kicker" },
  "seo.ogTitle": { label: "Link preview — title", hint: "Shown when someone shares jnjoroge.dev." },
  "seo.ogSubtitle": { label: "Link preview — subtitle", multiline: true },
  "seo.ogStep": { label: "Link preview — step counter" },
  "seo.jobTitles": {
    label: "Job titles",
    hint: "Structured data. Your main role is appended automatically.",
  },
  "seo.worksFor[].name": { label: "Company" },
  "seo.worksFor[].url": { label: "Company URL" },
  "seo.worksFor[].description": { label: "Company description", multiline: true },
  "seo.alumniOf[].name": { label: "School" },
  "seo.alumniOf[].description": { label: "Qualification" },
};

/** Normalise a concrete path (`deployments.2.role`) into a schema key. */
export function schemaKey(path: string): string {
  return path.replace(/\.(\d+)(?=\.|$)/g, "[]").replace(/^sections\.[^.]+\./, "sections.*.");
}

export function helpFor(path: string): FieldHelp {
  return FIELD_HELP[schemaKey(path)] ?? {};
}

/** Fall back to a readable label when the schema has no entry. */
export function prettify(key: string): string {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/^./, (ch) => ch.toUpperCase());
}
