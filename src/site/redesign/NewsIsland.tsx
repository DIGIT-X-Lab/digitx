import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import news from "@/data/news.json";
import { Arrow } from "../components/primitives";
import "./news-island.css";

/** Announcements island: the lab's news in a soft tape pill, centred in
 * the header. Collapsed it carries the latest headline; it springs open
 * into the full list and folds back when the reader scrolls on.
 *
 * The morph animates the shell's explicit width and height while the two
 * content layers only cross-fade: nothing with text in it ever scales,
 * which is what keeps the move fluid in every engine. */

type NewsItem = { date: string; title: string; description: string; type: string; link?: string };

const items = [...(news as NewsItem[])].sort((a, b) => b.date.localeCompare(a.date));
/* The island is a glance surface: the latest item in full, the two before
   it as dated titles. Older news waits for a dedicated announcements page. */
const shown = items.slice(0, 3);
const formatter = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });

export function NewsIsland() {
  const [open, setOpen] = useState(false);
  /* Entrance: a compact "News" chip that grows into the full pill. */
  const [intro, setIntro] = useState(true);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const settled = useRef(false);
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const pillLayer = useRef<HTMLDivElement>(null);
  const panelLayer = useRef<HTMLElement>(null);
  const wasOpen = useRef(false);
  useEffect(() => {
    if (reduced) { setIntro(false); return; }
    const chip = setTimeout(() => setIntro(false), 1600);
    return () => clearTimeout(chip);
  }, [reduced]);
  /* Scrolling on while the panel is open folds it back to the pill. */
  useEffect(() => {
    if (!open) return;
    const origin = window.scrollY;
    const onScroll = () => { if (Math.abs(window.scrollY - origin) > 120) setOpen(false); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);
  /* The shell follows the active layer's natural size. */
  useLayoutEffect(() => {
    const measure = () => {
      const active = open ? panelLayer.current : pillLayer.current;
      if (!active) return;
      setSize({ width: active.offsetWidth, height: active.offsetHeight });
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (pillLayer.current) observer.observe(pillLayer.current);
    if (panelLayer.current) observer.observe(panelLayer.current);
    window.addEventListener("resize", measure);
    return () => { observer.disconnect(); window.removeEventListener("resize", measure); };
  }, [open, intro]);
  useEffect(() => { if (size) settled.current = true; }, [size]);
  useLayoutEffect(() => {
    if (open) panelLayer.current?.focus({ preventScroll: true });
    else if (wasOpen.current) root.current?.querySelector<HTMLElement>(".news-pill")?.focus({ preventScroll: true });
    wasOpen.current = open;
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const onDown = (event: PointerEvent) => {
      if (root.current && !root.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);
  if (!items.length) return null;
  const latest = shown[0];
  const animatable = settled.current && !reduced;
  return <div ref={root} className="news-island" data-open={open} onKeyDown={event => {
    if (event.key === "Escape" && open) { event.stopPropagation(); setOpen(false); }
  }}>
    <motion.div className="news-island-shape"
      initial={reduced ? false : { y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1, width: size?.width, height: size?.height, borderRadius: open ? 18 : intro ? 12 : 22 }}
      transition={animatable ? { type: "spring", stiffness: 550, damping: 45 } : { duration: 0 }}>
      <div ref={pillLayer} className="news-layer" data-active={!open} data-compact={intro || undefined}>
        <button type="button" className="news-pill" aria-expanded={open} aria-label={`News: ${latest.title}`}
          tabIndex={open ? -1 : 0} onClick={() => { setIntro(false); setOpen(true); }}>
          <span className="news-dot" aria-hidden="true" />
          <span className="news-kicker">News</span>
          <span className="news-latest">{latest.title}</span>
        </button>
      </div>
      <section ref={panelLayer} tabIndex={-1} role="dialog" aria-label="Announcements"
        className="news-layer news-panel" data-active={open}>
        <header>
          <p>Announcements</p>
          <button type="button" aria-label="Close announcements" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>×</button>
        </header>
        <ol>
          {shown.map((item, index) => <li key={item.title} className={index ? "news-item-brief" : undefined}>
            <p className="news-date">{formatter.format(new Date(item.date))}</p>
            <h3>{item.title}</h3>
            {index === 0 && <p className="news-body">{item.description}</p>}
            {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1}>
              {new URL(item.link).hostname.replace(/^www\./, "")}<Arrow direction="diagonal" />
            </a>}
          </li>)}
        </ol>
      </section>
    </motion.div>
  </div>;
}
