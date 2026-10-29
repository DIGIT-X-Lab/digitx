import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { nav, type SiteSection } from "@/content/site";

/** Track the reading position without changing the URL or pushing scroll history. */
export function useActiveSection() {
  const { pathname } = useLocation();
  const [active, setActive] = useState<SiteSection>("home");
  useEffect(() => {
    if (pathname !== "/") return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const header = document.querySelector(".header-inner")?.getBoundingClientRect().height ?? 88;
      const readingLine = header + Math.min(innerHeight * .2, 160);
      let current: SiteSection = "home";
      for (const item of nav) {
        const chapter = document.querySelector(`[data-site-section="${item.id}"]`);
        if (chapter && chapter.getBoundingClientRect().top <= readingLine) current = item.id;
      }
      // A short final chapter cannot always reach the reading line before
      // native scrolling stops at the footer.
      const last = nav[nav.length - 1];
      const finalChapter = document.querySelector(`[data-site-section="${last.id}"]`);
      const finalBounds = finalChapter?.getBoundingClientRect();
      const atEnd = window.scrollY + innerHeight >= document.documentElement.scrollHeight - 2;
      if (atEnd && finalBounds && finalBounds.top < innerHeight && finalBounds.bottom > header) current = last.id;
      setActive(current);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const resize = new ResizeObserver(schedule);
    const main = document.getElementById("main");
    if (main) resize.observe(main);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [pathname]);
  if (pathname.startsWith("/tools/")) return "tools";
  if (pathname.startsWith("/careers/")) return "people";
  if (pathname === "/people-preview") return "people";
  return pathname === "/" ? active : nav.find(item => pathname === `/${item.id}`)?.id;
}
