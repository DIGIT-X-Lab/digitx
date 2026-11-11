import { useEffect, useRef, useState } from "react";
import "./theme-light.css";
import "./theme-toggle.css";

/** Theme toggle for the redesign previews: dark is home, light is the
 * mirror. The switch sweeps across the page as a circle growing from the
 * button (View Transitions API); browsers without it, and reduced-motion
 * visitors, get an instant swap. The choice persists per browser. */

const KEY = "digitx-theme";
type Theme = "dark" | "light";

const setAttribute = (theme: Theme) => {
  if (theme === "light") document.documentElement.dataset.theme = "light";
  else delete document.documentElement.dataset.theme;
};

export function ThemeToggle() {
  const button = useRef<HTMLButtonElement>(null);
  const [theme, setTheme] = useState<Theme>("dark");
  useEffect(() => {
    let saved: string | null = null;
    try { saved = localStorage.getItem(KEY); } catch { /* storage may be unavailable */ }
    if (saved === "light") { setTheme("light"); setAttribute("light"); }
    /* Leaving the preview registers returns the site to its own ground. */
    return () => setAttribute("dark");
  }, []);
  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try { localStorage.setItem(KEY, next); } catch { /* fine without persistence */ }
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const doc = document as Document & { startViewTransition?: (update: () => void) => { ready: Promise<void> } };
    const anchor = button.current;
    if (!doc.startViewTransition || reduced || !anchor) { setAttribute(next); return; }
    const transition = doc.startViewTransition(() => setAttribute(next));
    transition.ready.then(() => {
      const rect = anchor.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 650, easing: "ease-in-out", pseudoElement: "::view-transition-new(root)" },
      );
    }).catch(() => undefined);
  };
  return <button ref={button} type="button" className="theme-toggle" onClick={toggle}
    aria-pressed={theme === "light"} aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
    <svg viewBox="0 0 16 16" aria-hidden="true">
      {theme === "dark"
        ? <>
          <path d="M8 1.2v2.1M8 12.7v2.1M1.2 8h2.1M12.7 8h2.1M3.3 3.3l1.5 1.5M11.2 11.2l1.5 1.5M12.7 3.3l-1.5 1.5M4.8 11.2l-1.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          <circle cx="8" cy="8" r="3" fill="currentColor" />
        </>
        : <path d="M13.2 9.6A5.6 5.6 0 0 1 6.4 2.8a5.6 5.6 0 1 0 6.8 6.8Z" fill="currentColor" />}
    </svg>
  </button>;
}
