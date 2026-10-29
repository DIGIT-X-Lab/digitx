import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { identity, legal, nav } from "@/content/site";
import { affiliations } from "@/data/affiliations";
import { Arrow } from "../../components/primitives";
import "./review-prototype.css";

export const REVIEW_PATH = "/review-prototype";
const destinations = [
  ...nav.filter(item => item.id !== "home" && item.id !== "contact"),
  { id: "opportunities", label: "Opportunities" },
  { id: "contact", label: "Contact" },
];

/** The comparison has its own navigation, leaving the original header untouched. */
export function ReviewLayout({ children }: { children: ReactNode }) {
  const { pathname, hash, key, state } = useLocation();
  const keepFocus = state?.reviewKeepFocus === true;
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const toggle = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLElement>(null);
  const header = useRef<HTMLDivElement>(null);
  const onLanding = pathname === REVIEW_PATH;

  useEffect(() => setOpen(false), [key]);
  useEffect(() => {
    const original = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const meta = original ?? document.createElement("meta");
    const previous = meta.content;
    meta.name = "robots"; meta.content = "noindex, nofollow";
    if (!original) document.head.append(meta);
    return () => { if (original) meta.content = previous; else meta.remove(); };
  }, []);

  useEffect(() => {
    if (!open) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    menu.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const keydown = (event: KeyboardEvent) => {
      const links = menu.current?.querySelectorAll<HTMLAnchorElement>("a");
      const last = links?.[links.length - 1];
      if (event.key === "Escape") { setOpen(false); toggle.current?.focus(); }
      if (event.key === "Tab" && !event.shiftKey && document.activeElement === last) { event.preventDefault(); toggle.current?.focus(); }
      if (event.key === "Tab" && event.shiftKey && document.activeElement === toggle.current) { event.preventDefault(); last?.focus(); }
    };
    document.addEventListener("keydown", keydown);
    return () => { document.body.style.overflow = overflow; document.removeEventListener("keydown", keydown); };
  }, [open]);

  useEffect(() => {
    if (!onLanding) { setActive(pathname.includes("/tools/") ? "tools" : "opportunities"); return; }
    let frame = 0;
    const update = () => {
      frame = 0;
      const top = (header.current?.offsetHeight ?? 88) + Math.min(innerHeight * .2, 160);
      let found = "home";
      destinations.forEach(item => { const el = document.getElementById(item.id); if (el && el.getBoundingClientRect().top <= top) found = item.id; });
      if (scrollY + innerHeight >= document.documentElement.scrollHeight - 2) found = "contact";
      setActive(found);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(schedule);
    const main = document.getElementById("main");
    if (main) observer.observe(main);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, [onLanding, pathname]);

  useEffect(() => {
    document.title = `${destinations.find(item => item.id === active)?.label ?? "DIGITX"} · Review mockup`;
  }, [active]);

  useEffect(() => {
    let frame = 0;
    let observer: MutationObserver | undefined;
    let expiry = 0;
    let id: string;
    try { id = decodeURIComponent(hash.slice(1)); } catch { id = hash.slice(1); }
    const reveal = () => {
      const destination = id && document.getElementById(id);
      if (!destination) return false;
      // Settle the temporary hero height BEFORE measuring the anchor destination.
      window.dispatchEvent(new Event("digitx:preview-navigate"));
      frame = requestAnimationFrame(() => {
        destination.scrollIntoView({ block: "start", behavior: "instant" });
        if (!keepFocus) {
          if (!destination.matches("button, a, input, select, textarea")) destination.tabIndex = -1;
          destination.focus({ preventScroll: true });
        }
      });
      observer?.disconnect(); clearTimeout(expiry);
      return true;
    };
    if (id) {
      if (!reveal()) {
        observer = new MutationObserver(reveal);
        observer.observe(document.getElementById("main")!, { subtree: true, childList: true });
        expiry = window.setTimeout(() => observer?.disconnect(), 4000);
      }
    } else window.scrollTo({ top: 0, behavior: "instant" });
    return () => { cancelAnimationFrame(frame); clearTimeout(expiry); observer?.disconnect(); };
  }, [pathname, hash, key, keepFocus]);

  // Shared detail pages retain their original source links. Resolve local return
  // links within this throwaway route so exploring the mock stays in the mock.
  const keepLocal = (event: MouseEvent<HTMLDivElement>) => {
    if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = (event.target as Element).closest<HTMLAnchorElement>("a[href]");
    if (!link || link.target === "_blank" || link.dataset.original !== undefined) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin) return;
    let path = url.pathname;
    if (path === "/" && url.hash) path = REVIEW_PATH;
    else if (path.startsWith("/tools/") || path.startsWith("/careers/")) path = REVIEW_PATH + path;
    else if (!path.startsWith(REVIEW_PATH)) return;
    event.preventDefault(); event.stopPropagation();
    if (url.hash && url.hash !== "#home") window.dispatchEvent(new Event("digitx:preview-navigate"));
    setOpen(false);
    navigate(path + url.search + url.hash);
  };
  const originalHref = `${pathname.slice(REVIEW_PATH.length) || "/"}${hash}`;
  return <div className={`site-layout review-layout ${onLanding ? "site-layout--home" : pathname.includes("/careers/") ? "site-layout--job" : ""}`} onClickCapture={keepLocal}>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className={`site-header${open ? " menu-open" : ""}`}>
      <div ref={header} className="header-inner shell">
        <div className="review-brand-group"><Link to={`${REVIEW_PATH}#home`} className="site-brand" aria-label="DIGITX home">DIGIT<span>X</span></Link><nav className="review-comparison" aria-label="Mockup comparison"><span>Mockup</span><a href={originalHref} data-original target="_blank" rel="noopener noreferrer" aria-label="View current site in another tab">Original <Arrow direction="diagonal" /></a></nav></div>
        <nav className="desktop-navigation" aria-label="Main navigation"><ul>{destinations.map(item => <li key={item.id}><Link to={`${REVIEW_PATH}#${item.id}`} className={active === item.id ? "active" : undefined} aria-current={active === item.id ? "location" : undefined}>{item.label}</Link></li>)}</ul></nav>
        <button ref={toggle} className="menu-toggle" aria-expanded={open} aria-controls="review-mobile-menu" onClick={() => setOpen(value => !value)}><span>{open ? "Close" : "Menu"}</span><span className="menu-mark" aria-hidden="true"><i /><i /></span></button>
      </div>
      {open && <nav ref={menu} id="review-mobile-menu" className="mobile-navigation shell" aria-label="Mobile navigation"><ul>{destinations.map(item => <li key={item.id}><Link to={`${REVIEW_PATH}#${item.id}`} aria-current={active === item.id ? "location" : undefined}>{item.label}<Arrow /></Link></li>)}</ul><p>{identity}</p></nav>}
    </header>
    <main id="main" tabIndex={-1}>{children}</main>
    <footer className="site-footer shell"><div className="footer-top"><Link to={`${REVIEW_PATH}#home`} aria-label="DIGITX home" className="footer-brand">DIGIT<span>X</span></Link><p>{affiliations.radiology}</p><ul className="footer-legal">{legal.map(link => <li key={link.href}><a href={link.href} target="_blank" rel="noopener noreferrer">{link.label}<Arrow direction="diagonal" /></a></li>)}</ul></div></footer>
  </div>;
}
