"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * jn-1 reveal: 20px rise + fade, once per element, staggered 60ms in groups
 * of three. Never re-animates on scroll-back, and respects reduced motion.
 */
export function Reveal({
  children,
  className,
  /** Position within its group — multiplies the 60ms stagger */
  index = 0,
  as: Tag = "div",
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  index?: number;
  as?: "div" | "article" | "section" | "li";
} & React.HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      // Capability detection is browser-only, so the state starts at the
      // SSR-safe value and is corrected here — a lazy initialiser would
      // read `window` during render and cause a hydration mismatch.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setShown(true);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      {...rest}
      ref={ref as React.Ref<never>}
      data-shown={shown ? "" : undefined}
      className={cn(
        "translate-y-5 opacity-0 transition-[opacity,transform] duration-700 ease-jn data-[shown]:translate-y-0 data-[shown]:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100",
        className
      )}
      style={{ transitionDelay: `${(index % 3) * 60}ms` }}
    >
      {children}
    </Tag>
  );
}
