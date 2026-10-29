import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--c-bg) / <alpha-value>)",
        surface: "rgb(var(--c-surface) / <alpha-value>)",
        ink: "rgb(var(--c-ink) / <alpha-value>)",
        subtle: "rgb(var(--c-subtle) / <alpha-value>)",
        muted: "rgb(var(--c-muted) / <alpha-value>)",
        dim: "rgb(var(--c-dim) / <alpha-value>)",
        line: "rgb(var(--c-line) / <alpha-value>)",
        strong: "rgb(var(--c-strong) / <alpha-value>)",
        tape: "rgb(var(--c-tape) / <alpha-value>)",
        coral: "rgb(var(--c-coral) / <alpha-value>)",
        blue: "rgb(var(--c-blue) / <alpha-value>)",
        green: "rgb(var(--c-green) / <alpha-value>)",
      },
      fontFamily: {
        sans: ['"Inter Variable"', "Inter", "system-ui", "sans-serif"],
      },
      transitionTimingFunction: {
        deck: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
} satisfies Config;
