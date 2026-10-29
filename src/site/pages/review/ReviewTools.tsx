import { Fragment, useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { tools, toolsPage, type Tool } from "@/content/tools";
import { toolGuides } from "@/content/tool-guides";
import { toolTeasers, toolValidation, validationContactHref } from "@/content/tool-validation";
import repositoryStats from "@/content/tool-stars.json";
import { Arrow, ArrowLink, Tape } from "../../components/primitives";
import { IdentityMark } from "../../components/IdentityMark";
import { FlowingMenuHighlight } from "../../components/FlowingMenuHighlight";
import { useHoverHighlight } from "../../components/useHoverHighlight";
import { ToolStudy } from "../../components/ToolStudy";
import { ToolTeaserVisual } from "../../components/ToolTeaserVisual";
import "./review-tools.css";

/* THESIS: the catalogue is the route to the software; demos are a deliberate choice.
 * OWN-WORLD: existing warm black, ivory flow highlight, permanent identity marks.
 * STORY: identify a tool, read its purpose, open its details, docs, code or demo.
 * FIRST VIEWPORT: compact title and approved lead, then search and released tools.
 * FORM: an isolated refinement of the existing index; forthcoming work folds open.
 */
type Filter = (typeof toolsPage.filters)[number];
const order = ["moose", "lion", "falcon", "puma", "nifti2dicom", "mosaicx", "annotatex"];
const pageSize = 8;
const detailsPath = (slug: string) => `/review-prototype/tools/${slug}`;
const introBreak = toolsPage.intro.indexOf(". ") + 1;

function Stars({ tool }: { tool: Tool }) {
  const stats = repositoryStats.repositories[tool.slug];
  if (!stats || stats.repository !== tool.repo) return null;
  const label = `${stats.stars.toLocaleString("en-GB")} GitHub stars, checked ${repositoryStats.checkedAt}`;
  return <span className="rvt-stars" aria-label={label} title={label}>
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m12 3 2.78 5.63L21 9.54l-4.5 4.39 1.06 6.2L12 17.2l-5.56 2.93 1.06-6.2L3 9.54l6.22-.91Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>
    {stats.stars.toLocaleString("en-GB")}
  </span>;
}

function Demo({ tool, trigger, onClose }: { tool: Tool; trigger: HTMLButtonElement; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const title = useId();
  const guide = toolGuides[tool.slug];
  useEffect(() => {
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element?.close();
      document.body.style.overflow = previousOverflow;
      trigger.focus({ preventScroll: true });
    };
  }, [trigger]);

  return <dialog ref={dialog} className="rvt-demo" aria-labelledby={title}
    onCancel={event => { event.preventDefault(); onClose(); }}
    onClick={event => {
      if (event.target !== event.currentTarget) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
    }}>
    <div className="rvt-demo-top"><span>Tool demonstration</span><button type="button" autoFocus onClick={onClose}>Close demo<span aria-hidden="true">×</span></button></div>
    <header className="rvt-demo-heading"><h3 id={title}><IdentityMark name={tool.slug} />{tool.name}</h3><span>{toolsPage.statusLabel[tool.status]}</span></header>
    <p className="rvt-demo-explanation">{guide.demo}</p>
    <nav className="rvt-demo-resources" aria-label={`${tool.name} resources`}>
      <ArrowLink to={detailsPath(tool.slug)}>Tool details</ArrowLink>
      <ArrowLink to={guide.docs}>Documentation</ArrowLink>
      {tool.repo && <ArrowLink to={tool.repo}>Code on GitHub</ArrowLink>}
      {guide.citation?.kind === "Paper" && <ArrowLink to={guide.citation.href}>{toolsPage.paper}</ArrowLink>}
    </nav>
    <div className="rvt-demo-art"><ToolStudy slug={tool.slug} loop /></div>
  </dialog>;
}

function Forthcoming({ items }: { items: Tool[] }) {
  const id = useId();
  const [expanded, setExpanded] = useState<string | null>(null);
  const triggers = useRef<Record<string, HTMLButtonElement | null>>({});
  if (!items.length) return null;
  return <section className="rvt-forthcoming" aria-labelledby={`${id}-title`}
    onKeyDown={event => {
      if (event.key !== "Escape" || !expanded) return;
      event.preventDefault();
      triggers.current[expanded]?.focus({ preventScroll: true });
      setExpanded(null);
    }}>
    <header className="rvt-forthcoming-heading"><div><h3 id={`${id}-title`}>Forthcoming tools</h3><p>{toolValidation.intro}</p></div><span>{toolValidation.availability}</span></header>
    <div className="rvt-forthcoming-list">{items.map(tool => {
      const open = expanded === tool.slug;
      const teaser = toolTeasers[tool.slug];
      return <article key={tool.slug} className="rvt-forthcoming-item">
        <h4><button ref={element => { triggers.current[tool.slug] = element; }} type="button" className="rvt-forthcoming-toggle"
          id={`${id}-${tool.slug}-trigger`} aria-expanded={open} aria-controls={`${id}-${tool.slug}-panel`}
          onClick={() => setExpanded(open ? null : tool.slug)}>
          <span className="rvt-forthcoming-name"><IdentityMark name={tool.slug} />{tool.name}</span>
          <span className="rvt-forthcoming-purpose">{tool.function}</span>
          <span className="rvt-forthcoming-plus" aria-hidden="true">{open ? "−" : "+"}</span>
        </button></h4>
        <div id={`${id}-${tool.slug}-panel`} hidden={!open} role="region" aria-labelledby={`${id}-${tool.slug}-trigger`}>
          {open && <div className="rvt-forthcoming-panel">
            <div className="rvt-forthcoming-story"><span className="rvt-status">{toolsPage.statusLabel[tool.status]}</span><h5>{teaser?.headline ?? tool.name}</h5>
              <p>{teaser?.summary ?? tool.function}</p>
              {teaser && <p className="rvt-invitation">{teaser.invitation}</p>}
              <div className="rvt-forthcoming-links"><ArrowLink to={detailsPath(tool.slug)}>Tool details</ArrowLink><ArrowLink to={validationContactHref(tool.name)}>{toolValidation.action}</ArrowLink></div>
            </div>
            {teaser && <ToolTeaserVisual slug={tool.slug} />}
          </div>}
        </div>
      </article>;
    })}</div>
  </section>;
}

export function ReviewTools() {
  const id = useId();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [page, setPage] = useState(0);
  const [demo, setDemo] = useState<{ tool: Tool; trigger: HTMLButtonElement } | null>(null);
  const index = useRef<HTMLDivElement>(null);
  const { target, exitEdge } = useHoverHighlight(index, undefined, `${query}-${filter}-${page}`);
  const matching = tools.filter(tool => (filter === "All" || tool.data.includes(filter)) && `${tool.name} ${tool.function} ${tool.summary ?? ""}`.toLowerCase().includes(query.trim().toLowerCase()));
  const rank = (slug: string) => { const position = order.indexOf(slug); return position < 0 ? order.length : position; };
  const released = matching.filter(tool => tool.status === "released").sort((a, b) => rank(a.slug) - rank(b.slug));
  const forthcoming = matching.filter(tool => tool.status !== "released");
  const pages = Math.max(1, Math.ceil(released.length / pageSize));
  const currentPage = Math.min(page, pages - 1);
  const visible = released.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  const pageNumbers = [...new Set([0, Math.max(0, currentPage - 1), currentPage, Math.min(pages - 1, currentPage + 1), pages - 1])].sort((a, b) => a - b);
  const reset = () => { setQuery(""); setFilter("All"); setPage(0); };
  const changePage = (next: number) => {
    setPage(next);
    if ((index.current?.getBoundingClientRect().top ?? 0) < 112) index.current?.scrollIntoView({ block: "start", behavior: "instant" });
  };

  return <div className="rvt-tools shell">
    <header className="rvt-opening">
      <Tape as="h2" size="display" id="tools-title">{toolsPage.title}</Tape>
      <div className="rvt-opening-copy"><p className="page-lead">{toolsPage.intro.slice(0, introBreak)}</p>
        <details className="rvt-context"><summary>About these tools<Arrow direction="down" /></summary><p>{toolsPage.intro.slice(introBreak).trim()}</p></details>
      </div>
    </header>
    <div className="rvt-toolbar">
      <label className="rvt-search"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="1.4" /><path d="m15 15 6 6" stroke="currentColor" strokeWidth="1.4" /></svg><input aria-label="Search tools" aria-controls={`${id}-results`} type="search" placeholder="Search tools" value={query} onChange={event => { setQuery(event.target.value); setPage(0); }} /></label>
      <div className="rvt-filters" role="group" aria-label={toolsPage.filterLabel}>{toolsPage.filters.map(value => <button type="button" key={value} aria-pressed={filter === value} aria-controls={`${id}-results`} onClick={() => { setFilter(value); setPage(0); }}>{value === "All" ? value : toolsPage.dataLabels[value]}</button>)}</div>
    </div>
    <div id={`${id}-results`}>
      <p className="sr-only" role="status">{released.length} available tools, {forthcoming.length} forthcoming.</p>
      {released.length > 0 && <>
        <div className="rvt-list-heading"><h3>{toolsPage.released}</h3><span>{released.length} {released.length === 1 ? "tool" : "tools"}</span></div>
        <div className="rvt-index flowing-menu-host" ref={index}>
          <FlowingMenuHighlight target={target} exitEdge={exitEdge} inset={12} />
          {visible.map(tool => <article key={tool.slug} className="rvt-row" data-lit={target?.id === tool.slug || undefined}>
            <Link to={detailsPath(tool.slug)} className="rvt-tool-link" data-hover-item={tool.slug} aria-label={`${tool.name}: tool details`}>
              <div className="rvt-tool-identity"><IdentityMark name={tool.slug} /><div><h4>{tool.name}<Arrow direction="diagonal" /></h4><Stars tool={tool} /></div></div>
              <p>{tool.summary ?? tool.function}</p>
            </Link>
            <div className="rvt-row-actions">
              <button type="button" className="rvt-watch" aria-label={`Watch ${tool.name} demo`} aria-haspopup="dialog" onClick={event => setDemo({ tool, trigger: event.currentTarget })}>
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m9 5 11 7-11 7Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>Watch demo
              </button>
              <nav className="rvt-code-links" aria-label={`${tool.name} resources`}>
                <a href={toolGuides[tool.slug].docs} target="_blank" rel="noopener noreferrer" aria-label={`${tool.name} documentation`}>Docs<Arrow direction="diagonal" /></a>
                {tool.repo && <a href={tool.repo} target="_blank" rel="noopener noreferrer" aria-label={`${tool.name} code on GitHub`}>Code<Arrow direction="diagonal" /></a>}
              </nav>
            </div>
          </article>)}
        </div>
        {pages > 1 && <nav className="rvt-pagination" aria-label="Tools pages">
          <button type="button" disabled={currentPage === 0} aria-label="Previous tools page" onClick={() => changePage(currentPage - 1)}><span className="rvt-previous"><Arrow /></span></button>
          {pageNumbers.map((number, i) => <Fragment key={number}>
            {i > 0 && number - pageNumbers[i - 1] > 1 && <span aria-hidden="true">…</span>}
            <button type="button" aria-label={`Tools page ${number + 1}`} aria-current={number === currentPage ? "page" : undefined} onClick={() => changePage(number)}>{number + 1}</button>
          </Fragment>)}
          <button type="button" disabled={currentPage + 1 === pages} aria-label="Next tools page" onClick={() => changePage(currentPage + 1)}><Arrow /></button>
          <span className="rvt-page-range" aria-live="polite">{currentPage * pageSize + 1}–{Math.min((currentPage + 1) * pageSize, released.length)} of {released.length}</span>
        </nav>}
        <p className="rvt-local-note">{toolsPage.localNote}</p>
      </>}
      {released.length === 0 && <div className="rvt-empty"><p>{matching.length ? "No available tools match this selection." : toolsPage.empty}</p><button type="button" onClick={reset}>{toolsPage.filterReset}<Arrow /></button></div>}
      <Forthcoming items={forthcoming} />
    </div>
    {demo && <Demo tool={demo.tool} trigger={demo.trigger} onClose={() => setDemo(null)} />}
  </div>;
}
