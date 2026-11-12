import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import "./staggered-menu.css";

/** Collapsed navigation for the redesign registers: one Menu button, an
 * ivory panel sweeping in from the right behind a pale-blue prelayer, the
 * chapters staggering up with their indices. Closes on navigation, Escape,
 * the scrim, or the button. */

type Item = { id: string; label: string; to: string };

const spring = { type: "spring" as const, stiffness: 380, damping: 40 };

export function StaggeredMenu({ items, linkTo, active }: {
  items: readonly Item[]; linkTo: (item: Item) => string; active: string | null;
}) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);
  const { key } = useLocation();
  useEffect(() => setOpen(false), [key]);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => panel.current?.querySelector<HTMLAnchorElement>("a")?.focus({ preventScroll: true }));
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); toggle.current?.focus(); }
      if (event.key !== "Tab") return;
      /* The overlay portals above the page, so the trap cycles inside it. */
      const stops = Array.from(panel.current?.querySelectorAll<HTMLElement>("a, button") ?? []);
      const first = stops[0];
      const last = stops[stops.length - 1];
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    };
    document.addEventListener("keydown", keydown);
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", keydown);
    };
  }, [open]);
  const slide = {
    hidden: { x: "100%" },
    visible: { x: 0 },
  };
  return <>
    <button ref={toggle} type="button" className="sm-toggle" aria-expanded={open} aria-controls="staggered-menu"
      onClick={() => setOpen(value => !value)}>
      <span>{open ? "Close" : "Menu"}</span>
      <span className="sm-mark" aria-hidden="true"><i /><i /></span>
    </button>
    {createPortal(<AnimatePresence>
      {open && <motion.div className="sm-root" initial="hidden" animate="visible" exit="hidden">
        <motion.button type="button" className="sm-scrim" aria-label="Close menu" onClick={() => setOpen(false)}
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} transition={{ duration: reduced ? 0 : .25 }} />
        <motion.div className="sm-prelayer" aria-hidden="true" variants={slide}
          transition={reduced ? { duration: 0 } : spring} />
        <motion.nav id="staggered-menu" ref={panel} className="sm-panel" aria-label="Site menu" variants={slide}
          transition={reduced ? { duration: 0 } : { ...spring, delay: .07 }}>
          <button type="button" className="sm-close" onClick={() => { setOpen(false); toggle.current?.focus(); }}>
            <span>Close</span><span className="sm-mark sm-mark--open" aria-hidden="true"><i /><i /></span>
          </button>
          <motion.ol initial="hidden" animate="visible"
            variants={{ visible: { transition: reduced ? undefined : { staggerChildren: .055, delayChildren: .18 } } }}>
            {items.map((item, index) => <motion.li key={item.id}
              variants={{ hidden: { y: reduced ? 0 : 30, opacity: reduced ? 1 : 0 }, visible: { y: 0, opacity: 1, transition: reduced ? { duration: 0 } : spring } }}>
              <Link to={linkTo(item)} aria-current={active === item.id ? "page" : undefined} onClick={() => setOpen(false)}>
                <span className="sm-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{item.label}
              </Link>
            </motion.li>)}
          </motion.ol>
          <div className="sm-theme">
            <span className="sm-theme-label">Appearance</span>
            <ThemeToggle variant="labels" />
          </div>
        </motion.nav>
      </motion.div>}
    </AnimatePresence>, document.body)}
  </>;
}
