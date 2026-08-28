/**
 * Capabilities (confidence bars) and evals (coursework).
 *
 * Confidence values are self-reported and the section says so — they're a
 * relative ranking of what James reaches for first, not a benchmark score.
 * Words and numbers both live in `content/site-copy.json`.
 */
import { copy } from "@/lib/copy";

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

export interface EvalGroup {
  label: string;
  /** Mono sub-label, e.g. "M.S. Artificial Intelligence" */
  detail: string;
  passLabel: string;
  courses: string[];
}

export const capabilityGroups: CapabilityGroup[] = copy.capabilityGroups.map((group) => ({
  label: group.label,
  accent: group.accent === "amber" ? "amber" : "signal",
  // Highest confidence first, so each column reads as a ranking.
  items: [...group.items].sort((a, b) => b.confidence - a.confidence),
}));

export const evalGroups: EvalGroup[] = copy.evalGroups;
