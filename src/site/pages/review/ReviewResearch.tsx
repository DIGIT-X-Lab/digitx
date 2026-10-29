import { Fragment, useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { research, researchExperience, type AreaId } from "@/content/research";
import { observationExamples } from "@/content/home";
import { HomeObservations } from "../../components/HomeObservations";
import { ModalityCarousel } from "../../components/ModalityCarousel";
import { ResearchStory } from "../../components/ResearchStory";
import { ResearchSystems } from "../../components/ResearchSystems";
import "../../components/research-physiology.css";
import "./review-research.css";

const reviewCopy = {
  read: "Read about this research",
  example: "About these examples",
  illustration: "Show the conceptual illustration",
  physiologyProvenance: "AI-generated conceptual wireframe artwork.",
} as const;

function areaFromHash(hash: string) {
  return research.areas.find(area => `#${area.id}` === hash)?.id;
}

function closeDetailsOnEscape(event: KeyboardEvent<HTMLDetailsElement>) {
  if (event.key !== "Escape" || !event.currentTarget.open) return;
  event.preventDefault();
  event.stopPropagation();
  event.currentTarget.open = false;
  event.currentTarget.querySelector("summary")?.focus({ preventScroll: true });
}

function DisclosureMark() {
  return <svg className="rvr-disclosure-mark" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.5" />
  </svg>;
}

function ResearchProse({ paragraphs }: { paragraphs: readonly string[] }) {
  const enhance = researchExperience.physiology.enhance;
  return <div className="rvr-prose">{paragraphs.map(paragraph => <p key={paragraph}>
    {paragraph.split(enhance.label).map((part, index) => <Fragment key={index}>
      {index > 0 && <a href={enhance.href} target="_blank" rel="noopener noreferrer">{enhance.label}</a>}{part}
    </Fragment>)}
  </p>)}</div>;
}

function SupportingProse({ id }: { id: AreaId }) {
  const area = research.areas.find(item => item.id === id)!;
  return <details className="rvr-details" onKeyDown={closeDetailsOnEscape}>
    <summary>{reviewCopy.read}<DisclosureMark /></summary>
    <ResearchProse paragraphs={id === "systems" ? area.intro.slice(2) : area.intro} />
  </details>;
}

function SystemsView() {
  const [illustrationOpen, setIllustrationOpen] = useState(false);
  const area = research.areas.find(item => item.id === "systems")!;
  const copy = researchExperience.systems;
  return <div className="rvr-systems">
    <div className="rvr-systems-overview">
      <ul className="rvr-system-connections" aria-label={copy.visual}>
        <li>{copy.question}</li>
        <li>{copy.data}</li>
        <li>{copy.tools}</li>
      </ul>
      <ResearchProse paragraphs={area.intro.slice(0, 2)} />
    </div>
    <details className="rvr-details rvr-optional-illustration" onToggle={event => setIllustrationOpen(event.currentTarget.open)} onKeyDown={closeDetailsOnEscape}>
      <summary>{reviewCopy.illustration}<DisclosureMark /></summary>
      {illustrationOpen && <ResearchSystems />}
    </details>
  </div>;
}

/** The existing film, with an explicit, still invitation and no ambient effects. */
function ReviewFilm() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const region = useRef<HTMLDivElement>(null);
  const close = useCallback(() => {
    setOpen(false);
    trigger.current?.focus({ preventScroll: true });
  }, []);
  useEffect(() => { if (open) region.current?.focus({ preventScroll: true }); }, [open]);

  return <div className="rvr-film" onKeyDown={event => {
    if (event.key === "Escape" && open) { event.preventDefault(); event.stopPropagation(); close(); }
  }}>
    <button ref={trigger} type="button" className="rvr-film-trigger" aria-expanded={open} aria-controls="rvr-film-content" onClick={() => open ? close() : setOpen(true)}>
      <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
        {open ? <path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="1.5" /> : <path d="m9 5 11 7-11 7Z" fill="none" stroke="currentColor" strokeWidth="1.5" />}
      </svg>
      {open ? researchExperience.film.close : researchExperience.film.label}
    </button>
    <div ref={region} id="rvr-film-content" className="rvr-film-content" role="region" aria-label={researchExperience.film.label} tabIndex={-1} hidden={!open}>
      {open && <ResearchStory presentation="research" onClose={close} />}
    </div>
  </div>;
}

/** Isolated review variant. The parent supplies section#research. */
export function ReviewResearch() {
  const { hash, key } = useLocation();
  const navigate = useNavigate();
  const navigationKey = `${key}:${hash}`;
  const [selection, setSelection] = useState<{ key: string; id: AreaId }>(() => ({ key: navigationKey, id: areaFromHash(hash) ?? "computable" }));
  const [narrow, setNarrow] = useState(() => typeof window !== "undefined" && window.matchMedia("(max-width: 480px)").matches);
  const selected = selection.key === navigationKey ? selection.id : areaFromHash(hash) ?? selection.id;
  const tabs = useRef<Partial<Record<AreaId, HTMLButtonElement>>>({});
  const mobileSelector = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 480px)");
    const update = () => setNarrow(media.matches);
    media.addEventListener("change", update);
    update();
    return () => media.removeEventListener("change", update);
  }, []);

  const select = (id: AreaId, focus = false) => {
    setSelection({ key: navigationKey, id });
    navigate({ hash: `#${id}` }, { replace: true, preventScrollReset: true, state: { reviewKeepFocus: true } });
    if (focus) tabs.current[id]?.focus({ preventScroll: true });
  };
  const moveBetweenPillars = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const forward = narrow ? "ArrowDown" : "ArrowRight";
    const backward = narrow ? "ArrowUp" : "ArrowLeft";
    const next = event.key === "Home" ? 0 : event.key === "End" ? research.areas.length - 1 : event.key === forward ? (index + 1) % research.areas.length : event.key === backward ? (index + research.areas.length - 1) % research.areas.length : null;
    if (next === null) return;
    event.preventDefault();
    select(research.areas[next].id, true);
  };

  return <div className="rvr-research research-page shell">
    <header className="rvr-opening">
      <h2 id="research-title" className="rvr-title"><span className="tape">{research.title}</span></h2>
      <p className="rvr-intro research-opening-lead">{research.intro[0]}</p>
    </header>

    <div className="rvr-navigation">
      {research.areas.map(area => <span key={area.id} id={area.id} className="rvr-anchor" tabIndex={-1} role="group" aria-label={area.title} />)}
      <div className="rvr-mobile-selector">
        <label className="sr-only" htmlFor="rvr-pillar-select">{research.indexLabel}</label>
        <span className="rvr-mobile-selection" aria-hidden="true">{research.areas.find(area => area.id === selected)!.title}</span>
        <select ref={mobileSelector} id="rvr-pillar-select" value={selected} onChange={event => select(event.target.value as AreaId)}>
          {research.areas.map(area => <option key={area.id} value={area.id}>{area.title}</option>)}
        </select>
        <DisclosureMark />
      </div>
      <div className="rvr-pillars" role="tablist" aria-label={research.indexLabel}>
        {research.areas.map((area, index) => <button key={area.id} id={`rvr-tab-${area.id}`} ref={element => { tabs.current[area.id] = element; }} type="button" role="tab"
          className="rvr-pillar" aria-selected={selected === area.id} aria-controls={`rvr-panel-${area.id}`} tabIndex={selected === area.id ? 0 : -1}
          onClick={() => select(area.id)} onKeyDown={event => moveBetweenPillars(event, index)}>
          <span>{area.title}</span><span className="rvr-pillar-indicator" aria-hidden="true">↘</span>
        </button>)}
      </div>
    </div>

    {research.areas.map(area => <section key={area.id} id={`rvr-panel-${area.id}`} className="rvr-panel" role={narrow ? "region" : "tabpanel"} aria-labelledby={`rvr-tab-${area.id}`} tabIndex={0} hidden={selected !== area.id}
      onKeyDown={event => { if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); (narrow ? mobileSelector.current : tabs.current[area.id])?.focus({ preventScroll: true }); } }}>
      {selected === area.id && <>
        {area.id === "computable" && <div className="rvr-computability">
          <HomeObservations presentation="pillar" />
          <details className="rvr-example-provenance" onKeyDown={closeDetailsOnEscape}>
            <summary>{reviewCopy.example}<DisclosureMark /></summary>
            <p>{observationExamples.calculationNote}</p>
          </details>
        </div>}
        {area.id === "physiology" && <div className="rvr-physiology">
          <ModalityCarousel />
          <p className="rvr-art-provenance">{reviewCopy.physiologyProvenance}</p>
        </div>}
        {area.id === "systems" && <SystemsView />}
        <SupportingProse id={area.id} />
      </>}
    </section>)}

    <ReviewFilm />
  </div>;
}
