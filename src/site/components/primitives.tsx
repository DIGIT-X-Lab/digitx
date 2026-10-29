import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { showSlots } from "../env";

export function Arrow({ direction = "right" }: { direction?: "right" | "diagonal" | "down" }) {
  const directions = { right: "site-arrow-right", diagonal: "site-arrow-diagonal", down: "site-arrow-down" };
  return <svg className={`site-arrow ${directions[direction]}`} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

/** The deck's ivory title strip marks page openings, not every subheading. */
export function Tape({ children, as: Tag = "h2", size = "headline", className = "", id }: { children: ReactNode; as?: "h1" | "h2" | "h3"; size?: "display" | "headline"; className?: string; id?: string }) {
  return <Tag id={id} className={`${size} ${className}`}>{asHeading(children, size)}</Tag>;
}

function asHeading(children: ReactNode, size: "display" | "headline") {
  return size === "display" ? <span className="tape">{children}</span> : children;
}

export function Section({ id, label, title, children, className = "", titleAs = "h2" }: { id?: string; label?: string; title?: string; children?: ReactNode; className?: string; titleAs?: "h1" | "h2" }) {
  return <section id={id} className={`shell page-section ${className}`} aria-labelledby={id && title ? `${id}-title` : undefined}>
    {label && <p className="section-kicker">{label}</p>}{title && <Tape as={titleAs} id={id ? `${id}-title` : undefined}>{title}</Tape>}{children}
  </section>;
}

export function ArrowLink({ to, children, className = "" }: { to: string; children: ReactNode; className?: string }) {
  const external = /^(https?:|mailto:)/.test(to);
  const content = <><span>{children}</span><Arrow direction={external && !to.startsWith("mailto:") ? "diagonal" : "right"} /></>;
  return external ? <a href={to} className={`link-arrow ${className}`} target={to.startsWith("mailto:") ? undefined : "_blank"} rel="noopener noreferrer">{content}</a> : <Link to={to} className={`link-arrow ${className}`}>{content}</Link>;
}

/** Editorial instructions remain inspectable in development without dominating the page. */
export function Slot({ note, className = "" }: { note: string; className?: string; tall?: boolean }) {
  if (!showSlots) return null;
  return <details className={`editorial-note ${className}`}><summary>Editorial note</summary><p>{note}</p></details>;
}

export function Verify({ note }: { note: string }) {
  if (!showSlots) return null;
  return <span className="verify-note" title={note}>verify · {note}</span>;
}

export function Figure({ title, subtitle, status, children, className = "" }: { title?: string; subtitle?: string; status?: string; children: ReactNode; className?: string }) {
  return <figure className={`site-figure ${className}`}>
    {(title || subtitle) && <div className="figure-heading">{title && <p className="title">{title}</p>}{subtitle && <p>{subtitle}</p>}</div>}
    {children}{status && <figcaption className="meta">{status}</figcaption>}
  </figure>;
}

export function Chip({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "dev" }) {
  return <span className={`site-chip${tone === "dev" ? " site-chip-dev" : ""}`}>{children}</span>;
}
