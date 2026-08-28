import { cn } from "@/lib/utils";

/** Outline pill — the default tag. `active` switches it to signal green. */
export function Pill({
  children,
  active,
  className,
}: {
  children: React.ReactNode;
  active?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1.5 font-mono text-[11px] font-medium leading-none",
        active ? "border-primary text-primary" : "border-border text-muted-foreground",
        className
      )}
    >
      {children}
    </span>
  );
}

/** Filled square-ish chip for stack items — smaller and quieter than a Pill. */
export function TechChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-sm bg-secondary px-2.5 py-1.5 font-mono text-[10px] font-medium leading-none text-muted-foreground">
      {children}
    </span>
  );
}

/** Pulsing "running" dot — the only thing on the page allowed to loop. */
export function StatusDot({ className }: { className?: string }) {
  return (
    <span className={cn("relative grid h-2 w-2 shrink-0 place-items-center", className)}>
      <span className="absolute inset-0 animate-pulse-ring rounded-full bg-primary" />
      <span className="h-2 w-2 rounded-full bg-primary" />
    </span>
  );
}

/** Mono kicker above a heading, e.g. "TRAINED AT COLGATE". */
export function Kicker({
  children,
  tone = "muted",
  className,
}: {
  children: React.ReactNode;
  tone?: "muted" | "signal" | "amber";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "telemetry font-medium",
        tone === "signal" && "text-primary",
        tone === "amber" && "text-amber",
        tone === "muted" && "text-muted-foreground",
        className
      )}
    >
      {children}
    </span>
  );
}

/** The 5px separator between mono metadata fragments. */
export function Sep({ live }: { live?: boolean }) {
  return (
    <span
      aria-hidden
      className={cn("h-[5px] w-[5px] shrink-0 rounded-full", live ? "bg-primary" : "bg-border")}
    />
  );
}
