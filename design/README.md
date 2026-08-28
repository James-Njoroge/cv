# jn-1 — design source

The mock this site was built from. These files are the reference, not the build:
nothing in `src/` imports them, and nothing here ships to production.

| File                       | What it is                                                       |
| -------------------------- | ---------------------------------------------------------------- |
| `JN-1 Design System.dc.html` | The system itself — colour, type, components, motion, spacing, voice |
| `Portfolio.dc.html`        | The full-page mock the live site implements                       |
| `favicon.svg`              | The JN mark (also copied to `src/app/icon.svg`)                   |
| `support.js`               | Runtime the `.dc.html` mocks need in order to open in a browser    |

Open either `.dc.html` file directly in a browser to view it.

## Where the system lives in code

| System rule                              | Implementation                              |
| ---------------------------------------- | ------------------------------------------- |
| Colour tokens (OKLCH)                    | `src/app/[locale]/globals.css`              |
| Tailwind colour/radius/motion mapping    | `tailwind.config.js`                        |
| Two families: Space Grotesk + JetBrains  | `src/app/[locale]/layout.tsx`               |
| Scroll = training run (one global clock) | `src/lib/scroll-clock.ts`                   |
| Reveal, token stream, bars, curve        | `src/components/jn/`                        |
| Copy (checkpoints, deployments, evals)   | `src/data/`                                 |

## Rules worth not breaking

- **Two accents, never more than two accent uses per viewport.** Green = live /
  current / affirmative. Amber = secondary emphasis and metadata.
- **Mono is for machine sentences only** — labels, metrics, timestamps,
  endpoints. If a string looks like telemetry it's mono, uppercase, 0.06–0.1em.
- **Nothing bounces.** `cubic-bezier(.2,.8,.2,1)`, 700ms reveals, 1000–1100ms bars.
- **Reveals fire once.** Never re-animate on scroll-back.
- **Numbers only when they're real.** Every metric on the site traces to the
  résumé or to a shipped system.

## Editing the copy

Every string on the site lives in `content/site-copy.json`. Components read it
through `src/lib/copy.ts`, so editing that file *is* editing the site — there is
no build step or codegen in between.

To edit it in a browser instead of a text editor, run the dev server and open
**http://localhost:3000/studio**. Fields are grouped by section, each one
labelled with where it appears, and **Save to file** writes back to
`content/site-copy.json`. `Cmd/Ctrl+S` saves; **Undo last save** restores the
previous version from `content/.site-copy.backup.json` (gitignored).

The studio 404s and its API returns 403 outside `next dev` — it is a local
authoring tool, not a production CMS.

`{count}`, `{live}`, `{name}`, `{year}`, and `{contact}` in a string are
placeholders the site fills in. Leave them in place.

New fields: add to the JSON, read it in the component, then give it a friendly
label in `src/lib/copy-schema.ts`. The studio picks up unlabelled fields on its
own — the schema only supplies nicer names and hints.
