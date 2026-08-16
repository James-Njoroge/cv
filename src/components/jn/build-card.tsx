import type { Build } from "@/lib/builds";
import { copy } from "@/lib/copy";

import { Kicker, Pill, Sep, TechChip } from "./atoms";

/**
 * One build. Text-forward by design — in the jn-1 system a project earns
 * attention through its numbers and its stack, not through cover art.
 */
export function BuildCard({ build, detailed = false }: { build: Build; detailed?: boolean }) {
  const body = detailed ? (build.summary ?? build.tagline) : build.tagline;

  return (
    <article className="flex h-full flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary sm:p-7">
      <div className="mb-3.5 flex flex-wrap items-center gap-2.5">
        {build.context && <Kicker>{build.context}</Kicker>}
        {build.context && build.period && <Sep />}
        {build.period && <Kicker tone="amber">{build.period}</Kicker>}
      </div>

      <h3 className="m-0 font-display text-2xl font-semibold leading-tight tracking-[-0.02em]">
        {build.name}
      </h3>

      <p className="mt-2.5 text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground">
        {body}
      </p>

      {build.role && (
        <p className="mt-2.5 font-mono text-[11px] leading-relaxed text-muted-foreground">
          {build.role}
        </p>
      )}

      {build.highlights.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {build.highlights.map((highlight) => (
            <Pill key={highlight} active>
              {highlight}
            </Pill>
          ))}
        </div>
      )}

      {build.stack.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {build.stack.map((tech) => (
            <TechChip key={tech}>{tech}</TechChip>
          ))}
        </div>
      )}

      {/* Links pinned to the bottom so cards in a row line up */}
      <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-5">
        {build.liveUrl && (
          <a
            href={build.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] font-bold uppercase leading-none tracking-[0.06em] text-primary hover:text-amber"
          >
            {copy.buildCard.liveLabel}
          </a>
        )}
        {build.repoUrl && (
          <a
            href={build.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] font-bold uppercase leading-none tracking-[0.06em] text-primary hover:text-amber"
          >
            {copy.buildCard.codeLabel}
          </a>
        )}
        {!build.repoUrl && build.availability && (
          <span className="font-mono text-[11px] uppercase leading-none tracking-[0.06em] text-muted-foreground">
            {build.availability}
          </span>
        )}
      </div>
    </article>
  );
}
