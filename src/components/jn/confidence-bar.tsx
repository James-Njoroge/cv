"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Confidence bar: name, track, and a `.NN` readout. The fill grows once when
 * the row scrolls in — 1100ms, nothing bounces.
 */
export function ConfidenceBar({
  name,
  confidence,
  accent = "signal",
}: {
  name: string;
  confidence: number;
  accent?: "signal" | "amber";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setFilled(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setFilled(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const readout = confidence.toFixed(2).replace(/^0/, "");

  return (
    <div
      ref={ref}
      className="grid grid-cols-[8rem_minmax(0,1fr)_2.25rem] items-center gap-3"
      role="meter"
      aria-valuenow={confidence}
      aria-valuemin={0}
      aria-valuemax={1}
      aria-label={`${name} — self-reported confidence ${readout}`}
    >
      <span className="truncate font-mono text-[13px] font-medium leading-none text-foreground">
        {name}
      </span>
      <span className="block h-[7px] overflow-hidden rounded-full bg-secondary">
        <span
          className={cn(
            "block h-full rounded-full transition-[width] duration-1000 ease-jn",
            accent === "amber" ? "bg-amber" : "bg-primary"
          )}
          style={{ width: filled ? `${confidence * 100}%` : 0 }}
        />
      </span>
      <span className="text-right font-mono text-[11px] font-medium leading-none text-muted-foreground">
        {readout}
      </span>
    </div>
  );
}
