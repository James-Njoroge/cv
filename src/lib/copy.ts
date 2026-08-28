/**
 * Every user-visible string on the site.
 *
 * `content/site-copy.json` is the source of truth — components read from here,
 * and the copy studio at /studio writes back to that same file. Nothing is
 * codegen'd, so an edit in the studio is an edit to the site.
 *
 * Adding a field: add it to the JSON, then read it here. The studio picks it
 * up automatically; give it a friendly label in `src/lib/copy-schema.ts`.
 */
import raw from "../../content/site-copy.json";

export type SiteCopy = typeof raw;

export const copy: SiteCopy = raw;

/**
 * Fill `{placeholder}` slots. Missing keys are left in place rather than
 * blanked, so a typo in the studio is visible instead of silent.
 */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match
  );
}
