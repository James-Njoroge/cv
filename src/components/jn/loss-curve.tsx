"use client";

import { useEffect, useRef, useState } from "react";

import { copy } from "@/lib/copy";
import { curvePoint, curvePoints, lossAt, subscribeToScroll } from "@/lib/scroll-clock";

/** Full-run ghost curve, drawn once behind the live one. */
const GHOST = curvePoints(1);

export function LossCurve({
  /** id → human label, e.g. { training: "training" } */
  marks,
}: {
  marks: Array<{ id: string; step: string; label: string }>;
}) {
  const readout = useRef<HTMLSpanElement>(null);
  const line = useRef<SVGPolylineElement>(null);
  const dot = useRef<SVGCircleElement>(null);
  const [active, setActive] = useState(marks[0]);

  useEffect(
    () =>
      subscribeToScroll((t) => {
        if (readout.current) readout.current.textContent = lossAt(t).toFixed(3);
        if (line.current) line.current.setAttribute("points", curvePoints(t));
        if (dot.current) {
          const [x, y] = curvePoint(t);
          dot.current.setAttribute("cx", x.toFixed(1));
          dot.current.setAttribute("cy", y.toFixed(1));
        }
      }),
    []
  );

  // Track which checkpoint is under the reader's eye. Intersection ratios
  // don't work here — the deployment card is taller than the viewport, so it
  // can never cross a ratio threshold. Pick the last card whose top has passed
  // the reading line instead, which is size-independent.
  useEffect(() => {
    const byId = new Map(marks.map((m) => [m.id, m]));

    return subscribeToScroll(() => {
      const line = window.innerHeight * 0.38;
      let current = marks[0];
      for (const card of document.querySelectorAll<HTMLElement>("[data-ckpt]")) {
        if (card.getBoundingClientRect().top > line) break;
        current = byId.get(card.dataset.ckpt ?? "") ?? current;
      }
      setActive((prev) => (prev.id === current.id ? prev : current));
    });
  }, [marks]);

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="mb-3 flex justify-between font-mono text-[11px] font-medium leading-none text-muted-foreground">
          <span>{copy.lossCurve.readoutLabel}</span>
          <span ref={readout} className="text-primary">
            4.812
          </span>
        </div>
        <svg viewBox="0 0 260 130" className="h-auto w-full overflow-visible" aria-hidden>
          <line x1="0" y1="118" x2="260" y2="118" stroke="oklch(var(--border))" strokeWidth="1" />
          <line
            x1="0"
            y1="62"
            x2="260"
            y2="62"
            stroke="oklch(var(--secondary))"
            strokeWidth="1"
            strokeDasharray="3 5"
          />
          <line
            x1="0"
            y1="12"
            x2="260"
            y2="12"
            stroke="oklch(var(--secondary))"
            strokeWidth="1"
            strokeDasharray="3 5"
          />
          <polyline fill="none" stroke="oklch(var(--border))" strokeWidth="2" points={GHOST} />
          <polyline
            ref={line}
            fill="none"
            stroke="oklch(var(--primary))"
            strokeWidth="2.5"
            strokeLinecap="round"
            points=""
          />
          <circle
            ref={dot}
            cx="1"
            cy="12"
            r="4.5"
            fill="oklch(var(--primary))"
            stroke="oklch(var(--card))"
            strokeWidth="3"
          />
        </svg>
        <div className="mt-2.5 flex justify-between font-mono text-[10px] leading-none text-muted-foreground">
          <span>{copy.lossCurve.axisStart}</span>
          <span>{copy.lossCurve.axisEnd}</span>
        </div>
      </div>

      <p className="pl-0.5 font-mono text-xs font-medium leading-[1.7] text-muted-foreground">
        {copy.lossCurve.activePrefix}
        {active.step}
        <br />
        <span className="text-foreground">{active.label}</span>
      </p>
    </div>
  );
}
