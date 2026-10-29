import { Fragment, useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { tools, toolsPage, type Tool } from "@/content/tools";
import { toolGuides } from "@/content/tool-guides";
import repositoryStats from "@/content/tool-stars.json";
import { Arrow, ArrowLink } from "./primitives";
import { ToolStudy } from "./ToolStudy";
import { ToolValidation } from "./ToolValidation";
import { IdentityMark } from "./IdentityMark";
import { FlowingMenuHighlight } from "./FlowingMenuHighlight";
import { useHoverHighlight } from "./useHoverHighlight";
import "./tool-catalogue.css";

type Filter = (typeof toolsPage.filters)[number];
const catalogueOrder = ["moose", "lion", "falcon", "puma", "nifti2dicom", "mosaicx", "annotatex"];
const pageSize = 8;

function ToolStars({ tool }: { tool: Tool }) {
  const stats = repositoryStats.repositories[tool.slug];
  if (!stats || stats.repository !== tool.repo) return null;
  const label = `${stats.stars.toLocaleString("en-GB")} GitHub stars, checked ${repositoryStats.checkedAt}`;
  return <span className="tool-github-stars" aria-label={label} title={label}>
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m12 3 2.78 5.63L21 9.54l-4.5 4.39 1.06 6.2L12 17.2l-5.56 2.93 1.06-6.2L3 9.54l6.22-.91Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>
    <span>{stats.stars.toLocaleString("en-GB")}</span>
  </span>;
}

/** Native modal keeps the full explanation and existing animation together.
 * Capture the actual trigger: Safari does not focus buttons on pointer clicks. */
function ToolFocus({ tool, trigger, onClose }: { tool: Tool; trigger: HTMLButtonElement | null; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const label = useId();
  const guide = toolGuides[tool.slug];
  useEffect(() => {
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element?.close();
      document.body.style.overflow = previousOverflow;
      trigger?.focus({ preventScroll: true });
    };
  }, [trigger]);
  return <dialog ref={dialog} className="tool-focus-dialog" aria-labelledby={label}
    onCancel={event => { event.preventDefault(); onClose(); }}
    onClick={event => {
      if (event.target !== event.currentTarget) return;
      const rect = event.currentTarget.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
    }}>
    <div className="tool-focus-top"><span id={label}>{tool.name} demonstration</span><button type="button" onClick={onClose} autoFocus>Back to tools <span aria-hidden="true">×</span></button></div>
    <header className="tool-focus-heading"><h3>{tool.name}</h3><span>{tool.data.map(kind => toolsPage.dataLabels[kind]).join(" / ")} · {toolsPage.statusLabel[tool.status]}</span></header>
    <p className="tool-focus-explanation">{guide.demo}</p>
    <div className="tool-focus-art"><ToolStudy slug={tool.slug} loop /></div>
    <nav className="tool-focus-resources" aria-label={`${tool.name} resources`}>
      <ArrowLink to={`/tools/${tool.slug}`}>{toolsPage.explore}</ArrowLink>
      {guide.citation?.kind === "Paper" && <ArrowLink to={guide.citation.href}>{toolsPage.paper}</ArrowLink>}
      {tool.repo && <ArrowLink to={tool.repo}>{toolsPage.repository}<ToolStars tool={tool} /></ArrowLink>}
    </nav>
  </dialog>;
}

/** Approved focus-view catalogue: browse a finite list, open one existing study.
 * Search/filter the entire collection before pagination; keep unreleased work separate. */
export function ToolCatalogue() {
  const id = useId();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [page, setPage] = useState(0);
  const [opened, setOpened] = useState<Tool | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const index = useRef<HTMLDivElement>(null);
  const { target, exitEdge } = useHoverHighlight(index, undefined, `${query}-${filter}-${page}`);
  const matching = tools.filter(tool => (filter === "All" || tool.data.includes(filter)) && `${tool.name} ${tool.function} ${tool.summary ?? ""}`.toLowerCase().includes(query.trim().toLowerCase()));
  const released = matching.filter(tool => tool.status === "released").sort((a, b) => {
    const rank = (slug: string) => { const position = catalogueOrder.indexOf(slug); return position < 0 ? catalogueOrder.length : position; };
    return rank(a.slug) - rank(b.slug);
  });
  const pages = Math.max(1, Math.ceil(released.length / pageSize));
  const currentPage = Math.min(page, pages - 1);
  // Like the publication archive, keep first/current/last plus compact gaps.
  const near = currentPage === 0 ? Math.min(1, pages - 1) : currentPage === pages - 1 ? Math.max(0, pages - 2) : currentPage;
  const pageNumbers = [...new Set([0, near, pages - 1])].sort((a, b) => a - b);
  const visible = released.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  const forthcoming = matching.filter(tool => tool.status === "validation");
  const development = matching.filter(tool => tool.status === "development");
  const changePage = (next: number) => {
    setPage(next);
    const top = index.current?.getBoundingClientRect().top ?? 0;
    if (top < 112) index.current?.scrollIntoView({ block: "start", behavior: "instant" });
  };

  return <div className="tool-catalogue">
    <div className="tool-directory-toolbar">
      <label className="tool-directory-search"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="1.4" /><path d="m15 15 6 6" stroke="currentColor" strokeWidth="1.4" /></svg><input aria-label="Search tools" aria-controls={`${id}-results`} type="search" placeholder="Search tools" value={query} onChange={event => { setQuery(event.target.value); setPage(0); }} /></label>
      <div className="tool-catalogue-filters" role="group" aria-label={toolsPage.filterLabel}>{toolsPage.filters.map(value => <button type="button" key={value} aria-pressed={filter === value} aria-controls={`${id}-results`} onClick={() => { setFilter(value); setPage(0); }}>{value === "All" ? value : toolsPage.dataLabels[value]}</button>)}</div>
    </div>
    <div id={`${id}-results`}>
      <p className="sr-only" role="status">{released.length} available tools, {forthcoming.length + development.length} forthcoming.</p>
      <div className="tool-directory-index flowing-menu-host" ref={index} aria-label={toolsPage.released}>
        <FlowingMenuHighlight target={target} exitEdge={exitEdge} inset={12} />
        {visible.map(tool => <button key={tool.slug} type="button" className="tool-directory-row" data-hover-item={tool.slug} data-lit={target?.id === tool.slug || undefined}
          aria-label={`Open ${tool.name} demonstration`} aria-describedby={`${id}-${tool.slug}-purpose`} aria-haspopup="dialog"
          onClick={event => { trigger.current = event.currentTarget; setOpened(tool); }}>
          <span className="tool-directory-name"><IdentityMark name={tool.slug} /><span className="tool-directory-title"><span>{tool.name}</span><ToolStars tool={tool} /></span></span>
          <span className="tool-directory-purpose" id={`${id}-${tool.slug}-purpose`}>{tool.summary ?? tool.function}</span>
          <span className="tool-directory-row-end" aria-hidden="true"><Arrow direction="diagonal" /></span>
        </button>)}
      </div>
      {matching.length === 0 && <div className="tool-directory-empty"><p>{toolsPage.empty}</p><button type="button" onClick={() => { setQuery(""); setFilter("All"); setPage(0); }}>{toolsPage.filterReset}<Arrow /></button></div>}
      {pages > 1 && <nav className="tool-directory-pagination" aria-label="Tools pages">
        <button type="button" disabled={currentPage === 0} aria-label="Previous tools page" onClick={() => changePage(currentPage - 1)}><span className="tool-directory-previous"><Arrow /></span></button>
        {pageNumbers.map((number, index) => <Fragment key={number}>
          {index > 0 && number - pageNumbers[index - 1] > 1 && <span className="tool-directory-page-gap" aria-hidden="true">…</span>}
          <button type="button" aria-label={`Tools page ${number + 1}`} aria-current={number === currentPage ? "page" : undefined} onClick={() => changePage(number)}>{number + 1}</button>
        </Fragment>)}
        <button type="button" disabled={currentPage + 1 === pages} aria-label="Next tools page" onClick={() => changePage(currentPage + 1)}><Arrow /></button>
        <span className="tool-directory-page-range" aria-live="polite">{currentPage * pageSize + 1}–{Math.min((currentPage + 1) * pageSize, released.length)} of {released.length}</span>
      </nav>}
      <ToolValidation tools={forthcoming} />
      {development.length > 0 && <section className="tool-directory-development" aria-labelledby={`${id}-development`}><h3 id={`${id}-development`}>{toolsPage.development}</h3><p>{toolsPage.developmentNote}</p>{development.map(tool => <article key={tool.slug}><h4><Link to={`/tools/${tool.slug}`}>{tool.name}<Arrow /></Link></h4><p>{tool.function}</p></article>)}</section>}
    </div>
    {opened && <ToolFocus tool={opened} trigger={trigger.current} onClose={() => setOpened(null)} />}
  </div>;
}
