/**
 * One global clock for the whole page.
 *
 * Scroll progress is the training run: the header bar, the step counter, the
 * loss readout, and the loss curve all read the same scalar 0→1. A single
 * rAF-throttled listener feeds every subscriber so they can never disagree.
 */

/** Total steps in the run — the denominator on the header counter. */
export const TOTAL_STEPS = 2400;

type Listener = (t: number) => void;

const listeners = new Set<Listener>();
let attached = false;
let frame: number | null = null;
let last = 0;

function progress(): number {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollable <= 0) return 0;
  return Math.min(1, Math.max(0, window.scrollY / scrollable));
}

function emit() {
  frame = null;
  last = progress();
  listeners.forEach((fn) => fn(last));
}

function schedule() {
  if (frame !== null) return;
  frame = requestAnimationFrame(emit);
}

/** Subscribe to scroll progress. Returns an unsubscribe function. */
export function subscribeToScroll(fn: Listener): () => void {
  listeners.add(fn);

  if (!attached) {
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    attached = true;
  }
  // Hand the new subscriber the current value immediately.
  fn(progress());

  return () => {
    listeners.delete(fn);
    if (listeners.size === 0 && attached) {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      attached = false;
      if (frame !== null) {
        cancelAnimationFrame(frame);
        frame = null;
      }
    }
  };
}

/** Decaying training loss with a little noise, so the curve reads as real. */
export function lossAt(t: number): number {
  return 0.055 + 4.76 * Math.exp(-3.5 * t) * (1 + 0.055 * Math.sin(t * 26));
}

/** Map progress onto the 260×130 loss-curve viewBox. */
export function curvePoint(t: number): [number, number] {
  const loss = lossAt(t);
  return [t * 258 + 1, 118 - ((loss - 0.05) / 4.82) * 104];
}

/** Serialise the curve from 0 → t as an SVG `points` string. */
export function curvePoints(t: number, segments = 120): string {
  const n = Math.max(1, Math.round(t * segments));
  const points: string[] = [];
  for (let i = 0; i <= n; i++) {
    const [x, y] = curvePoint((i / segments) * 1);
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return points.join(" ");
}

export function formatStep(t: number): string {
  return `step ${String(Math.round(t * TOTAL_STEPS)).padStart(4, "0")}/${TOTAL_STEPS}`;
}
