import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { peoplePage } from "@/content/people";
import { contactPage } from "@/content/contact";
import { contactEmail } from "@/content/site";
import { endingPreviewCopy as copy } from "@/content/ending-preview";
import { jobs } from "@/data/jobs";
import { Arrow, Tape } from "../components/primitives";
import { FlowingMenuHighlight } from "../components/FlowingMenuHighlight";
import { useHoverHighlight } from "../components/useHoverHighlight";
import { useRegister } from "../redesign/useRegister";
import { CollabMap } from "../redesign/CollabMap";
import "./ending-prototype.css";

/** Throwaway comparison of the current ending and the proposed human invitation.
 * Lives on the existing homepage via ?ending-preview=current|proposed. */
export function OpportunitiesPrototype() {
  const surface = useRef<HTMLDivElement>(null);
  const highlight = useHoverHighlight(surface);
  const register = useRegister();
  /* A navigation destination in the redesign registers, so its heading level
     matches its chapter-scale tape; the live page keeps its h3 nested outline. */
  const ItemHeading = register === "current" ? "h4" : "h3";
  const closed = peoplePage.opportunities.categories.filter(category => !jobs.some(job => job.category === category.id));
  return <section id="opportunities" data-site-section="opportunities" tabIndex={-1} className="shell ep-opportunities" aria-labelledby="opps-title">
    <Tape as={register === "current" ? "h3" : "h2"} size="display" id="opps-title">{peoplePage.opportunities.title}</Tape>
    <div className="ep-opportunity-grid">
      <figure className="ep-culture">
        <img className="ep-culture-logo" src="/brand/digitx-lmu-aligned.svg" alt="DIGITX · LMU" width="240" height="240" />
        <figcaption><p>{copy.cultureStatement}</p></figcaption>
      </figure>
      <div className="ep-positions">
        <div ref={surface} className="ep-openings flowing-menu-host">
          {jobs.map(job => <Link key={job.id} to={`/careers/${job.id}`} data-hover-item={job.id} className="ep-opening">
            <span className="ep-opening-status">{peoplePage.opportunities.open}</span>
            <ItemHeading>{job.title}</ItemHeading>
            <p>{job.shortDescription}</p>
            <span className="ep-opening-action">{copy.openingAction}<Arrow direction="diagonal" /></span>
          </Link>)}
          <FlowingMenuHighlight target={highlight.target} exitEdge={highlight.exitEdge} inset={12} />
        </div>
        <div className="ep-closed">{closed.map(category => <div key={category.id}><ItemHeading>{category.title}</ItemHeading><p>{peoplePage.opportunities.closed}</p></div>)}</div>
      </div>
    </div>
  </section>;
}

export function ContactPrototype() {
  const reduced = useReducedMotion();
  const register = useRegister();
  return <div className="ep-contact">
    <motion.section className="shell ep-contact-inner" aria-labelledby="contact-title" initial={reduced ? false : "hidden"} whileInView="visible" viewport={{ once: true, amount: .25 }}>
      <motion.h2 id="contact-title" variants={{ hidden: { clipPath: "inset(0 100% 0 0)" }, visible: { clipPath: "inset(0)" } }} transition={{ duration: reduced ? 0 : .55, ease: [.16, 1, .3, 1] }}>{contactPage.title}</motion.h2>
      <div className="ep-contact-bottom">
        <p className="page-lead">{contactPage.body}</p>
        <a href={`mailto:${contactEmail}`} className="ep-email"><span>{contactPage.cta}</span><Arrow direction="diagonal" /></a>
      </div>
      {register !== "current" && <CollabMap />}
    </motion.section>
  </div>;
}

export function EndingPreviewControls({ variant }: { variant: "current" | "proposed" }) {
  const [params, setParams] = useSearchParams();
  const change = (value: "current" | "proposed") => {
    const next = new URLSearchParams(params); next.set("ending-preview", value);
    setParams(next, { replace: true });
  };
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.target instanceof HTMLElement && event.target.closest("input, textarea, select, button, a, [contenteditable]")) return;
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const next = new URLSearchParams(params); next.set("ending-preview", variant === "current" ? "proposed" : "current");
      setParams(next, { replace: true });
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [params, setParams, variant]);
  useEffect(() => {
    const existing = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const meta = existing ?? document.createElement("meta"); const previous = meta.content;
    meta.name = "robots"; meta.content = "noindex, nofollow";
    if (!existing) document.head.append(meta);
    return () => { if (existing) meta.content = previous; else meta.remove(); };
  }, []);
  return <nav className="ep-switcher" aria-label="Ending design comparison">
    <span>{copy.previewLabel}</span>
    <button aria-label="Previous design" onClick={() => change(variant === "current" ? "proposed" : "current")}><span className="ep-arrow-back"><Arrow /></span></button>
    <button aria-pressed={variant === "current"} onClick={() => change("current")}>Current</button>
    <button aria-pressed={variant === "proposed"} onClick={() => change("proposed")}>Proposed</button>
    <button aria-label="Next design" onClick={() => change(variant === "current" ? "proposed" : "current")}><Arrow /></button>
  </nav>;
}
