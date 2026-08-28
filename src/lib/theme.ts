/**
 * Colour theme plumbing, shared by the root layout (a Server Component) and
 * the toggle (a Client Component). It lives in its own plain module because
 * anything exported from a `"use client"` file reaches the server as a client
 * reference, not as the string the layout needs to inline.
 *
 * Three states. "auto" is the default and stores nothing — it leaves
 * `[data-theme]` off the document so the `prefers-color-scheme` query in
 * globals.css decides. "light" and "dark" write the attribute and persist.
 */
export type Theme = "auto" | "light" | "dark";

export const THEME_STORAGE_KEY = "jn1-theme";

/** Read the persisted choice. Storage can throw in private modes; treat that as auto. */
export function readStoredTheme(): Theme {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : "auto";
  } catch {
    return "auto";
  }
}

/** Apply a theme to the document and remember it. "auto" clears both. */
export function applyTheme(theme: Theme): void {
  if (theme === "auto") {
    delete document.documentElement.dataset.theme;
  } else {
    document.documentElement.dataset.theme = theme;
  }
  try {
    if (theme === "auto") window.localStorage.removeItem(THEME_STORAGE_KEY);
    else window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // A themed page that forgets the choice beats a page that throws.
  }
}

/**
 * Inlined in <head> and run synchronously while the HTML parses, so a stored
 * choice is applied before the first paint rather than after hydration.
 */
export const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;
