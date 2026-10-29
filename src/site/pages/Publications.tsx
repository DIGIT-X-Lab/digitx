import { useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { publications, type Publication } from "@/data/publications";
import { publicationsPage as copy } from "@/content/publications";
import { Arrow, Tape } from "../components/primitives";
import { filterPublications, publicationPages, selectPublications } from "./publication-archive";
import { usePublicationLayout } from "./use-publication-layout";
import "./publications.css";
import "./publication-accordion.css";

/** Approved accordion archive: collapsed strips determine page capacity. */
function StripContent({ paper }: { paper: Publication }) {
  return <>
    <span className="pa-year">{paper.year ?? "Undated"}</span>
    <span className="pa-paper-title">{paper.title}</span>
    <span className="pa-journal">{paper.venue}</span>
    <span className="pa-mark" aria-hidden="true"><i /><i /></span>
  </>;
}

function Paper({ paper, open, embedded, onToggle }: { paper: Publication; open: boolean; embedded: boolean; onToggle: () => void }) {
  const Heading = embedded ? "h3" : "h2";
  const DetailHeading = embedded ? "h4" : "h3";
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();
  const doi = paper.note?.doi ?? paper.doi;
  const source = doi ? `https://doi.org/${doi}` : paper.sourceUrl;
  const groupAuthors = paper.note?.groupAuthors ?? paper.groupAuthors ?? [];
  return <li className="pa-paper" data-paper-id={paper.paperId} data-open={open} onKeyDown={event => {
    if (open && event.key === "Escape") { event.preventDefault(); onToggle(); trigger.current?.focus(); }
  }}>
    <Heading><button ref={trigger} id={`${id}-trigger`} className="pa-strip" type="button" aria-expanded={open} aria-controls={`${id}-details`}
      aria-label={`${open ? "Hide" : "Show"} details: ${paper.title}`} onClick={() => { trigger.current?.focus({ preventScroll: true }); onToggle(); }}>
      <StripContent paper={paper} />
    </button></Heading>
    <AnimatePresence initial={false}>
      {open && <motion.div key="details" id={`${id}-details`} role="region" aria-labelledby={`${id}-trigger`} className="pa-detail-reveal"
        initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
        transition={{ duration: reduced ? 0 : .2, ease: [.2, .7, .2, 1] }}>
        <div className="pa-details">
          <div className="pa-summary"><DetailHeading>Summary</DetailHeading><p>{paper.note?.summary ?? "Read the original paper for its findings and methods."}</p></div>
          {groupAuthors.length > 0 && <div className="pa-authors"><DetailHeading>From our group</DetailHeading>{groupAuthors.map(name => <p key={name}>{name}</p>)}
            {paper.note?.affiliationNote && <p className="pa-affiliation">{paper.note.affiliationNote}</p>}
          </div>}
          <div className="pa-links">
            {source && <a href={source} target="_blank" rel="noopener noreferrer">Read paper <Arrow direction="diagonal" /></a>}
            {(paper.citationCount ?? 0) > 0 && paper.citationUrl && <a href={paper.citationUrl} target="_blank" rel="noopener noreferrer">{paper.citationCount} citations <Arrow direction="diagonal" /></a>}
          </div>
        </div>
      </motion.div>}
    </AnimatePresence>
  </li>;
}

export default function Publications({ embedded = false }: { embedded?: boolean }) {
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("all");
  const [anchor, setAnchor] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const measure = useRef<HTMLDivElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const results = useRef<HTMLDivElement>(null);
  const years = useMemo(() => [...new Set(publications.map(paper => paper.year).filter((value): value is number => value !== null))].sort((a, b) => b - a), []);
  const matches = useMemo(() => filterPublications(publications, { query, year }), [query, year]);
  const geometry = usePublicationLayout(root, measure, matches);
  const archive = selectPublications(publications, { query, year, anchor }, geometry?.layout);
  const reset = () => { setQuery(""); setYear("all"); setAnchor(null); setExpanded(null); search.current?.focus(); };
  const changePage = (page: number) => {
    setAnchor(archive.pageAnchors[page - 1] ?? null); setExpanded(null);
    results.current?.focus({ preventScroll: true });
    root.current?.scrollIntoView({ behavior: "instant", block: "start" });
  };
  return <div className="publications-page pa-page" ref={root}>
      <div className="publication-viewport-size" aria-hidden="true" />
      <header className="shell publications-opening"><Tape as={embedded ? "h2" : "h1"} size="display" id="publications-title">{copy.title}</Tape><p className="page-lead">{copy.intro}</p></header>
      <section className="shell publication-index pa-index" aria-label="Publication archive">
        <div className="publication-controls pa-controls">
          <div className="publication-search"><div className="publication-input-wrap">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.4" /><path d="m16 16 5 5" stroke="currentColor" strokeWidth="1.4" /></svg>
            <input ref={search} type="search" placeholder={copy.controls.search} aria-label={copy.controls.search} aria-controls="pa-results" value={query}
              onChange={event => { setQuery(event.target.value); setAnchor(null); setExpanded(null); }}
              onKeyDown={event => { if (event.key === "Escape") { setQuery(""); setAnchor(null); setExpanded(null); } }} />
            {query && <button type="button" className="publication-clear-search" aria-label="Clear search" onClick={() => { setQuery(""); setAnchor(null); setExpanded(null); search.current?.focus(); }}>×</button>}
          </div></div>
          <div className="publication-year-options" role="group" aria-label="Filter publications by year">
            {["all", ...years.map(String)].map(value => <button key={value} type="button" aria-pressed={year === value} onClick={() => { setYear(value); setAnchor(null); setExpanded(null); }}>{value === "all" ? "All years" : value}</button>)}
          </div>
          <div className="pa-results-line"><p role="status" aria-live="polite">{archive.total ? `${archive.from}–${archive.to} of ${archive.total} publications` : "0 publications"}</p>
            {(query || year !== "all") && <button type="button" onClick={reset}>Reset filters</button>}
          </div>
        </div>
        <div className="publication-viewport">
          <div className="publication-measure" ref={measure} aria-hidden="true">
            {matches.map(paper => <div key={paper.paperId} className="publication-row pa-measure-row" data-paper-id={paper.paperId}><div className="pa-strip"><StripContent paper={paper} /></div></div>)}
            <div className="publication-pagination pa-pagination"><span>1</span></div>
          </div>
          <div ref={results} id="pa-results" tabIndex={-1}>
            {archive.total ? <ol className="pa-list">{archive.items.map(paper => <Paper key={paper.paperId} paper={paper} embedded={embedded} open={expanded === paper.paperId} onToggle={() => setExpanded(value => value === paper.paperId ? null : paper.paperId)} />)}</ol>
              : <div className="pa-empty"><p>{copy.empty}</p><button type="button" onClick={reset}>Show all publications <Arrow /></button></div>}
          </div>
        </div>
        {archive.pageCount > 1 && <nav className="publication-pagination pa-pagination" aria-label="Publication pages">
          <button type="button" aria-label="Previous page" disabled={archive.page === 1} onClick={() => changePage(archive.page - 1)}><span className="publication-back-arrow"><Arrow /></span></button>
          {publicationPages(archive.page, archive.pageCount).map((page, index) => page === "gap" ? <span key={`gap-${index}`} aria-hidden="true">…</span>
            : <button key={page} type="button" aria-label={`Page ${page}`} aria-current={page === archive.page ? "page" : undefined} onClick={() => changePage(page)}>{page}</button>)}
          <button type="button" aria-label="Next page" disabled={archive.page === archive.pageCount} onClick={() => changePage(archive.page + 1)}><Arrow /></button>
        </nav>}
      </section>
  </div>;
}
