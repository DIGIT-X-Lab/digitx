import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigationType } from "react-router-dom";
import { identity, legal, nav } from "@/content/site";
import { affiliations } from "@/data/affiliations";
import { Arrow } from "./primitives";
import { useActiveSection } from "./useActiveSection";

function Header() {
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const header = useRef<HTMLDivElement>(null);
  const navigation = useRef<HTMLUListElement>(null);
  const { pathname, key } = useLocation();
  const active = useActiveSection();
  const toggle = useRef<HTMLButtonElement>(null);
  const mobile = useRef<HTMLElement>(null);
  useEffect(() => setOpen(false), [key]);
  useEffect(() => {
    // Enlarged browser text can need the menu before the viewport breakpoint.
    // Keep measuring the hidden list so reducing text size restores the links.
    const measure = () => {
      const row = header.current;
      const list = navigation.current;
      if (!row || !list) return;
      const style = getComputedStyle(row);
      const available = row.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      const required = (row.querySelector(".site-brand")?.getBoundingClientRect().width ?? 0) + parseFloat(style.columnGap) + list.getBoundingClientRect().width;
      const next = matchMedia("(min-width: 1024px)").matches && required > available;
      setCompact(next);
    };
    const observer = new ResizeObserver(measure);
    if (header.current) observer.observe(header.current);
    if (navigation.current) observer.observe(navigation.current);
    window.addEventListener("resize", measure);
    measure();
    return () => { observer.disconnect(); window.removeEventListener("resize", measure); };
  }, []);
  useEffect(() => { if (!compact && matchMedia("(min-width: 1024px)").matches) setOpen(false); }, [compact]);
  useEffect(() => {
    const page = nav.find(item => item.id === active)?.label;
    document.title = !page || active === "home" ? "DIGITX · Research into human biology" : `${page} · DIGITX`;
  }, [active]);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const first = mobile.current?.querySelector<HTMLAnchorElement>("a");
    first?.focus();
    const keydown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); toggle.current?.focus(); }
      if (event.key !== "Tab") return;
      const links = Array.from(mobile.current?.querySelectorAll<HTMLAnchorElement>("a") || []);
      const last = links[links.length - 1];
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); toggle.current?.focus(); }
      if (event.shiftKey && document.activeElement === toggle.current) { event.preventDefault(); last?.focus(); }
    };
    const desktop = matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    document.addEventListener("keydown", keydown);desktop.addEventListener("change", closeOnDesktop);
    return () => { document.body.style.overflow = previous;document.removeEventListener("keydown", keydown);desktop.removeEventListener("change", closeOnDesktop); };
  }, [open]);
  return <header className={`site-header${open ? " menu-open" : ""}`} data-compact={compact}><div ref={header} className="header-inner shell">
    <Link to="/#home" aria-label="DIGITX home" className="site-brand">DIGIT<span>X</span></Link>
    <nav aria-label="Main navigation" className="desktop-navigation"><ul ref={navigation}>{nav.map(item => <li key={item.id}><Link to={item.to} className={active === item.id ? "active" : undefined} aria-current={active === item.id ? pathname === "/" ? "location" : "page" : undefined}>{item.label}</Link></li>)}</ul></nav>
    <button type="button" ref={toggle} className="menu-toggle" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(value => !value)}><span>{open ? "Close" : "Menu"}</span><span className="menu-mark" aria-hidden="true"><i /><i /></span></button>
  </div>{open && <nav ref={mobile} id="mobile-nav" aria-label="Mobile navigation" className="mobile-navigation shell"><ul>{nav.map(item => <li key={item.id}><Link to={item.to} onClick={() => setOpen(false)} className={active === item.id ? "active" : undefined} aria-current={active === item.id ? pathname === "/" ? "location" : "page" : undefined}>{item.label}<Arrow direction="diagonal" /></Link></li>)}</ul><p>{identity}</p></nav>}</header>;
}

function ScrollRestore() {
  const { pathname, hash, key } = useLocation();
  const navigationType = useNavigationType();
  const previousPath = useRef<string>();
  useEffect(() => {
    const samePage = previousPath.current === pathname;
    previousPath.current = pathname;
    let observer: MutationObserver | undefined;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let dimensions: ResizeObserver | undefined;
    let settleTimeout: ReturnType<typeof setTimeout> | undefined;
    let frame = 0;
    const inputEvents = ["wheel", "touchstart", "pointerdown", "keydown"] as const;
    const stopSettling = () => {
      dimensions?.disconnect();
      cancelAnimationFrame(frame);
      if (settleTimeout) clearTimeout(settleTimeout);
      inputEvents.forEach(type => window.removeEventListener(type, stopSettling));
    };
    if (hash) {
      let id: string;
      try { id = decodeURIComponent(hash.slice(1)); } catch { id = hash.slice(1); }
      const reveal = () => {
        const element = document.getElementById(id);
        if (!element) return false;
        const smooth = samePage && navigationType !== "POP" && !matchMedia("(prefers-reduced-motion: reduce)").matches;
        element.scrollIntoView({ behavior: smooth ? "smooth" : "instant" });
        if (element.hasAttribute("data-site-section")) element.focus({ preventScroll: true });
        // On entry, the project stack can acquire its height after the first
        // anchor scroll. Follow that initial reflow, yielding as soon as the
        // visitor interacts. Same-page smooth scrolling remains native.
        if (!samePage && id !== "home") {
          const align = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
              if (!element.isConnected) return;
              const margin = parseFloat(getComputedStyle(element).scrollMarginTop) || 0;
              if (Math.abs(element.getBoundingClientRect().top - margin) > 1) element.scrollIntoView({ behavior: "instant" });
            });
          };
          dimensions = new ResizeObserver(align);
          dimensions.observe(document.getElementById("main")!);
          inputEvents.forEach(type => window.addEventListener(type, stopSettling, { passive: true }));
          settleTimeout = setTimeout(stopSettling, 2000);
        }
        observer?.disconnect();if (timeout) clearTimeout(timeout);
        return true;
      };
      if (!reveal()) { observer = new MutationObserver(reveal);observer.observe(document.getElementById("main")!, { childList: true, subtree: true });timeout = setTimeout(() => observer?.disconnect(), 3000); }
    } else window.scrollTo({ top: 0, behavior: "instant" });
    return () => { observer?.disconnect();if (timeout) clearTimeout(timeout);stopSettling(); };
  }, [pathname, hash, key, navigationType]);
  return null;
}

function Footer() {
  return <footer className="site-footer shell"><div className="footer-top">
    <Link to="/#home" aria-label="DIGITX home" className="footer-brand">DIGIT<span>X</span></Link>
    <p>{affiliations.radiology}</p>
    <ul className="footer-legal">{legal.map(link => <li key={link.href}><a href={link.href} target="_blank" rel="noopener noreferrer">{link.label}<Arrow direction="diagonal" /></a></li>)}</ul>
  </div></footer>;
}

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const surface = pathname === "/" || pathname === "/people-preview" ? "home" : pathname === "/research" ? "research" : pathname.startsWith("/careers/") ? "job" : null;
  return <div className={`site-layout${surface ? ` site-layout--${surface}` : ""}`}><a className="skip-link" href="#main">Skip to content</a><ScrollRestore /><Header /><main id="main" tabIndex={-1}>{children}</main><Footer /></div>;
}
