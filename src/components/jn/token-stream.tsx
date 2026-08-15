"use client";

import { useEffect, useState } from "react";

const CHAR_MS = 26;

/**
 * Token stream: 26ms per character, one pass, no loop. The cursor keeps
 * blinking after it finishes. Reduced-motion users get the finished string.
 */
export function TokenStream({ text }: { text: string }) {
  const [shown, setShown] = useState("");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(text);
      return;
    }

    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, CHAR_MS);

    return () => clearInterval(id);
  }, [text]);

  return (
    <>
      {/* Screen readers get the whole sentence; the animation is decorative. */}
      <span className="sr-only">{text}</span>
      <span aria-hidden>{shown}</span>
      <span
        aria-hidden
        className="ml-0.5 inline-block h-4 w-2 animate-blink bg-primary align-[-3px]"
      />
    </>
  );
}
