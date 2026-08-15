import { cn } from "@/lib/utils";

import { Reveal } from "./reveal";

/**
 * Numbered section heading with the 1px rule underneath — the rhythm marker
 * that separates every section in the jn-1 system.
 */
export function SectionHeading({
  index,
  title,
  meta,
  id,
  className,
}: {
  /** Two-digit section number, e.g. "03" */
  index: string;
  title: string;
  /** Right-aligned mono metadata, e.g. "5 checkpoints · 2018–present" */
  meta?: string;
  id?: string;
  className?: string;
}) {
  return (
    <Reveal className={cn("mb-12 sm:mb-14", className)}>
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 border-b border-border pb-5">
        <span className="font-mono text-xs font-medium leading-none text-primary">{index}</span>
        <h2
          id={id}
          className="m-0 font-display text-[clamp(1.875rem,3.6vw,2.875rem)] font-semibold leading-tight tracking-[-0.03em]"
        >
          {title}
        </h2>
        {meta && (
          <span className="font-mono text-xs leading-none text-muted-foreground sm:ml-auto">
            {meta}
          </span>
        )}
      </div>
    </Reveal>
  );
}
