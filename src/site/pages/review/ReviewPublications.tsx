import { useId, useMemo, useRef, useState } from "react";
import { publications, type Publication } from "@/data/publications";
import { publicationsPage as copy } from "@/content/publications";
import { Arrow, Tape } from "../../components/primitives";
import { filterPublications, publicationPages } from "../publication-archive";
import "../publications.css";
import "./review-publications.css";

const PAGE_SIZE = 6;

/** An isolated, fixed-batch reading view of the canonical publication archive. */
export function ReviewPublications() {
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("all");
  const [requestedPage, setRequestedPage] = useState(1);
  const searchRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const resultsId = useId();
  const searchId = useId();
  const years = useMemo(() => [...new Set(publications.map((paper) => paper.year)
    .filter((value): value is number => value !== null))].sort((a, b) => b - a), []);
  const matches = useMemo(() => filterPublications(publications, { query, year }), [query, year]);
  const pageCount = Math.max(1, Math.ceil(matches.length / PAGE_SIZE));
  const page = Math.min(requestedPage, pageCount);
  const start = (page - 1) * PAGE_SIZE;
  const items = matches.slice(start, start + PAGE_SIZE);
  const filtersActive = Boolean(query.trim()) || year !== "all";

  function clearSearch() {
    setQuery("");
    setRequestedPage(1);
    searchRef.current?.focus();
  }

  function resetFilters() {
    setQuery("");
    setYear("all");
    setRequestedPage(1);
    searchRef.current?.focus();
  }

  function changePage(next: number) {
    setRequestedPage(next);
    resultsRef.current?.focus({ preventScroll: true });
    resultsRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
  }

  return <div className="publications-page rvp-page">
    <header className="shell rvp-opening">
      <Tape as="h2" size="display" id="publications-title">{copy.title}</Tape>
      <p className="page-lead">{copy.intro}</p>
    </header>

    <div className="shell rvp-archive">
      <div className="rvp-controls">
        <div className="rvp-search">
          <label className="rvp-sr-only" htmlFor={searchId}>{copy.controls.search}</label>
          <svg className="rvp-search-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.4" />
            <path d="m16 16 5 5" stroke="currentColor" strokeWidth="1.4" />
          </svg>
          <input id={searchId} ref={searchRef} type="search" value={query}
            placeholder={copy.controls.search} aria-controls={resultsId}
            aria-description="Search by title, topic, author or journal"
            onChange={(event) => { setQuery(event.target.value); setRequestedPage(1); }}
            onKeyDown={(event) => { if (event.key === "Escape") clearSearch(); }} />
          {query && <button className="rvp-clear" type="button" aria-label="Clear search" onClick={clearSearch}>
            <span aria-hidden="true">×</span>
          </button>}
        </div>
        <div className="rvp-years" role="group" aria-label="Filter publications by year">
          {["all", ...years.map(String)].map((value) => <button key={value} type="button"
            aria-pressed={year === value} aria-controls={resultsId}
            onClick={() => { setYear(value); setRequestedPage(1); }}>
            {value === "all" ? "All years" : value}
          </button>)}
        </div>
      </div>

      <div className="rvp-results" id={resultsId} ref={resultsRef} tabIndex={-1} role="region" aria-label="Publication results">
        <div className="rvp-results-heading">
          <p className="rvp-status" role="status" aria-live="polite" aria-atomic="true">
            {matches.length ? <>{start + 1}–{start + items.length} of {matches.length} {matches.length === 1 ? "publication" : "publications"}</> : "0 publications"}
            {year !== "all" && <> from {year}</>}
            {matches.length > 0 && <span className="rvp-page-status">{` Page ${page} of ${pageCount}`}</span>}
          </p>
          {filtersActive && <button className="rvp-reset" type="button" onClick={resetFilters}>Reset filters</button>}
        </div>

        {matches.length ? <ol className="rvp-list" start={start + 1}>
          {items.map((paper) => <PublicationRecord key={paper.paperId} paper={paper} />)}
        </ol> : <div className="rvp-empty">
          <p>{copy.empty}</p>
          <button className="rvp-action" type="button" onClick={resetFilters}>Show all publications <Arrow /></button>
        </div>}
      </div>

      {pageCount > 1 && <nav className="rvp-pagination" aria-label="Publication pages">
        <button className="rvp-page-direction" type="button" disabled={page === 1} onClick={() => changePage(page - 1)} aria-controls={resultsId}>
          <span className="rvp-arrow-back"><Arrow /></span><span>Previous</span>
        </button>
        <div className="rvp-page-numbers">
          {publicationPages(page, pageCount).map((item, index) => item === "gap"
            ? <span className="rvp-page-gap" key={`gap-${index}`} aria-hidden="true">…</span>
            : <button key={item} type="button" aria-label={`Page ${item}`} aria-current={item === page ? "page" : undefined}
              aria-controls={resultsId} onClick={() => changePage(item)}>{item}</button>)}
        </div>
        <button className="rvp-page-direction" type="button" disabled={page === pageCount} onClick={() => changePage(page + 1)} aria-controls={resultsId}>
          <span>Next</span><Arrow />
        </button>
      </nav>}
    </div>
  </div>;
}

function PublicationRecord({ paper }: { paper: Publication }) {
  const [expanded, setExpanded] = useState(false);
  const detailsId = useId();
  const titleId = useId();
  const doi = paper.note?.doi ?? paper.doi;
  const paperUrl = doi ? `https://doi.org/${doi}` : paper.sourceUrl;
  const groupAuthors = paper.note?.groupAuthors ?? paper.groupAuthors ?? [];
  const fullAuthorUrl = paper.note?.evidenceUrl ?? paper.sourceUrl ?? paperUrl;
  const hasDetails = Boolean(paper.note?.summary || groupAuthors.length || fullAuthorUrl);

  return <li className="rvp-record" data-paper-id={paper.paperId}>
    <div className="rvp-record-heading">
      <div className="rvp-record-text">
        <h3 className="rvp-title" id={titleId}>{paperUrl ? <a className="rvp-title-link" href={paperUrl}
          target="_blank" rel="noopener noreferrer" aria-label={`${paper.title} (original paper, opens in a new tab)`}>
          {paper.title}<Arrow direction="diagonal" />
        </a> : paper.title}</h3>
        <p className="rvp-venue"><span className="rvp-year">{paper.year ?? "Undated"}</span><span>{paper.venue}</span></p>
      </div>
      <div className="rvp-record-actions">
        {hasDetails && <button className="rvp-disclosure" type="button" aria-expanded={expanded} aria-controls={detailsId}
          aria-label={`${expanded ? "Hide" : "Show"} details, summary and authors: ${paper.title}`} onClick={() => setExpanded(!expanded)}>
          <span>Details</span><span className="rvp-disclosure-mark" aria-hidden="true">{expanded ? "−" : "+"}</span>
        </button>}
      </div>
    </div>
    {hasDetails && <div className="rvp-details" id={detailsId} hidden={!expanded} role="region" aria-labelledby={titleId}>
      {paper.note?.summary && <div className="rvp-summary">
        <h4 className="rvp-detail-label">Summary</h4>
        <p>{paper.note.summary}</p>
      </div>}
      <div className="rvp-authors">
        {groupAuthors.length > 0 && <>
          <h4 className="rvp-detail-label">From our group</h4>
          {groupAuthors.map((name) => <p className="rvp-author" key={name}>{name}</p>)}
        </>}
        {paper.note?.affiliationNote && <p className="rvp-affiliation">{paper.note.affiliationNote}</p>}
        {fullAuthorUrl && <a className="rvp-author-link" href={fullAuthorUrl} target="_blank" rel="noopener noreferrer"
          aria-label={`Full author list: ${paper.title} (opens in a new tab)`}>Full author list <Arrow direction="diagonal" /></a>}
      </div>
    </div>}
  </li>;
}

export default ReviewPublications;
