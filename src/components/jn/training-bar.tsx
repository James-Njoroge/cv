"use client";

import { useEffect, useRef } from "react";

import { copy } from "@/lib/copy";
import { formatStep, lossAt, subscribeToScroll } from "@/lib/scroll-clock";

import { ThemeToggle } from "./theme-toggle";

const NAV = copy.nav;

/**
 * The fixed instrument bar: progress through the page is progress through the
 * training run. Values are written straight to the DOM rather than through
 * state — this updates on every animation frame while scrolling.
 */
export function TrainingBar() {
  const bar = useRef<HTMLDivElement>(null);
  const step = useRef<HTMLSpanElement>(null);
  const loss = useRef<HTMLSpanElement>(null);

  useEffect(
    () =>
      subscribeToScroll((t) => {
        if (bar.current) bar.current.style.width = `${(t * 100).toFixed(2)}%`;
        if (step.current) step.current.textContent = formatStep(t);
        if (loss.current) loss.current.textContent = `loss ${lossAt(t).toFixed(3)}`;
      }),
    []
  );

  return (
    <div className="fixed inset-x-0 top-0 z-50 bg-gradient-to-b from-background via-background/60 to-transparent backdrop-blur-md print:hidden">
      <div className="container-jn flex flex-wrap items-center gap-x-5 gap-y-3 pb-3 pt-4">
        <a href="#top" className="flex shrink-0 items-center gap-2.5 text-foreground">
          <span className="grid h-[26px] w-[26px] place-items-center rounded-[7px] border border-border bg-secondary font-mono text-[11px] font-bold leading-none tracking-[-0.5px] text-primary">
            JN
          </span>
          <span className="font-mono text-[13px] font-medium leading-none tracking-[0.02em]">
            jn&#8209;1
          </span>
        </a>

        <div className="flex min-w-0 flex-1 items-center gap-3" aria-hidden>
          <div className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-border">
            <div
              ref={bar}
              className="absolute inset-y-0 left-0 w-0 rounded-full bg-gradient-to-r from-amber to-primary"
            />
          </div>
          <span
            ref={step}
            className="whitespace-nowrap font-mono text-[11px] font-medium leading-none text-muted-foreground"
          >
            step 0000/2400
          </span>
          <span
            ref={loss}
            className="hidden whitespace-nowrap font-mono text-[11px] font-medium leading-none text-amber sm:inline"
          >
            loss 4.812
          </span>
        </div>

        <nav
          aria-label="Sections"
          className="hidden gap-[18px] font-mono text-xs font-medium leading-none md:flex"
        >
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <ThemeToggle />
      </div>
    </div>
  );
}
