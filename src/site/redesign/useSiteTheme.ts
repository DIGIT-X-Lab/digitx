import { useEffect, useState } from "react";

/** The live site theme, reactive to the ThemeToggle's html[data-theme]
 * attribute. On routes without the toggle the attribute never exists and
 * this stays "dark", the site's native ground. */

export type SiteTheme = "dark" | "light";

const read = (): SiteTheme => document.documentElement.dataset.theme === "light" ? "light" : "dark";

export function useSiteTheme(): SiteTheme {
  const [theme, setTheme] = useState<SiteTheme>(read);
  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(read()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);
  return theme;
}

/** The portrait file for the current theme; falls back to the original
 * for members without baked variants. */
export function portraitSource(portrait: { src: string; dark?: string; light?: string }, theme: SiteTheme): string {
  return (theme === "light" ? portrait.light : portrait.dark) ?? portrait.src;
}
