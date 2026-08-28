/** @type {import('tailwindcss').Config} */

/**
 * Colours live in globals.css as bare OKLCH components (`L C H`) so that
 * Tailwind's `/opacity` modifiers keep working through `<alpha-value>`.
 */
const oklchVar = (name) => `oklch(var(--${name}) / <alpha-value>)`;

module.exports = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1.75rem",
      screens: {
        "2xl": "1180px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        border: oklchVar("border"),
        input: oklchVar("input"),
        ring: oklchVar("ring"),
        background: oklchVar("background"),
        foreground: oklchVar("foreground"),
        /** Signal green — live / current / affirmative */
        signal: oklchVar("signal"),
        /** Amber — secondary emphasis and metadata highlights */
        amber: oklchVar("amber"),
        primary: {
          DEFAULT: oklchVar("primary"),
          foreground: oklchVar("primary-foreground"),
        },
        secondary: {
          DEFAULT: oklchVar("secondary"),
          foreground: oklchVar("secondary-foreground"),
        },
        destructive: {
          DEFAULT: oklchVar("destructive"),
          foreground: oklchVar("destructive-foreground"),
        },
        muted: {
          DEFAULT: oklchVar("muted"),
          foreground: oklchVar("muted-foreground"),
        },
        accent: {
          DEFAULT: oklchVar("accent"),
          foreground: oklchVar("accent-foreground"),
        },
        popover: {
          DEFAULT: oklchVar("popover"),
          foreground: oklchVar("popover-foreground"),
        },
        card: {
          DEFAULT: oklchVar("card"),
          foreground: oklchVar("card-foreground"),
        },
      },
      borderRadius: {
        // 6 (tech tag) · 12 (row) · 14–18 (card) · 99 (pill)
        sm: "0.375rem",
        md: "0.75rem",
        lg: "var(--radius)",
        xl: "1.125rem",
      },
      transitionTimingFunction: {
        jn: "cubic-bezier(.2,.8,.2,1)",
      },
      keyframes: {
        blink: {
          "0%,49%": { opacity: "1" },
          "50%,100%": { opacity: "0" },
        },
        drift: {
          from: { backgroundPosition: "0 0" },
          to: { backgroundPosition: "0 -40px" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(1)", opacity: "0.55" },
          "70%,100%": { transform: "scale(2.6)", opacity: "0" },
        },
      },
      animation: {
        blink: "blink 1s step-end infinite",
        drift: "drift 12s linear infinite",
        "pulse-ring": "pulse-ring 2.4s ease-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
