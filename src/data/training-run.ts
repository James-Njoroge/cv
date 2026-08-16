/**
 * The training run — education as checkpoints, work as deployments.
 *
 * Structure and types live here; the words live in `content/site-copy.json`
 * so they can be edited in the copy studio at /studio.
 */
import { copy } from "@/lib/copy";

export interface Checkpoint {
  /** Step number in the run, e.g. "0900" — drives the sticky loss-curve label */
  step: string;
  /** Mono kicker, e.g. "Trained at Colgate" */
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

export interface Deployment {
  org: string;
  role: string;
  link?: string;
  /** Rendered right-aligned in mono; live roles also get a pulse dot. */
  period: string;
  live?: boolean;
  location?: string;
  points: string[];
  stack: string[];
}

/** Empty strings in the JSON mean "not set" — drop them rather than render blanks. */
const trim = (value: string | undefined) => (value ? value : undefined);

export const checkpoints: Checkpoint[] = copy.checkpoints.map((c) => ({
  id: c.id,
  step: c.step,
  label: c.label,
  title: c.title,
  honour: trim(c.honour),
  period: trim(c.period),
  body: c.body,
  tags: c.tags,
  augmentation: "augmentation" in c ? c.augmentation : undefined,
}));

/** Ordered newest first; the two live rows lead. */
export const deployments: Deployment[] = copy.deployments.map((d) => ({
  org: d.org,
  role: d.role,
  link: trim(d.link),
  period: d.period,
  live: d.live,
  location: trim(d.location),
  points: d.points,
  stack: d.stack,
}));
