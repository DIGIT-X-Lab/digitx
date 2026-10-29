import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion, useInView, useIsPresent, useReducedMotion } from "framer-motion";
import { MetalFx } from "metal-fx";
import { BorderBeam } from "border-beam";
import { research, researchExperience as copy, type AreaId } from "@/content/research";
import { ResearchComputability } from "../components/ResearchComputability";
import { ResearchStory } from "../components/ResearchStory";
import { ResearchPhysiology } from "../components/ResearchPhysiology";
import { ResearchSystems } from "../components/ResearchSystems";
import { FlowingMenuHighlight } from "../components/FlowingMenuHighlight";
import { useHoverHighlight } from "../components/useHoverHighlight";
import { PillarDisclosure } from "../components/PillarDisclosure";
import "./research.css";

function ResearchFilm() {
  const [watching, setWatching] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [sizes, setSizes] = useState({ preview: 106, player: 720 });
  const [effectsVisible, setEffectsVisible] = useState(false);
  const [reduced, setReduced] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const previewSurface = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLButtonElement>(null);
  const player = useRef<HTMLDivElement>(null);
  const animateEffects = effectsVisible && !watching && !reduced;
  useEffect(() => {
    let inView = false;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => { setEffectsVisible(inView && !document.hidden); setReduced(preference.matches); };
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; update(); });
    if (previewSurface.current) observer.observe(previewSurface.current);
    document.addEventListener("visibilitychange", update);
    preference.addEventListener("change", update);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", update); preference.removeEventListener("change", update); };
  }, []);
  const close = useCallback(() => {
    setWatching(false);
    const button = preview.current;
    if (!button) return;
    const header = document.querySelector(".header-inner")?.getBoundingClientRect().height ?? 89;
    if (button.getBoundingClientRect().top < header) button.scrollIntoView({ block: "start", behavior: "instant" });
  }, []);
  useLayoutEffect(() => {
    const measure = () => setSizes(previous => ({
      preview: previewSurface.current?.getBoundingClientRect().height ?? previous.preview,
      player: player.current?.getBoundingClientRect().height ?? previous.player,
    }));
    const observer = new ResizeObserver(measure);
    if (previewSurface.current) observer.observe(previewSurface.current);
    if (player.current) observer.observe(player.current);
    measure();
    return () => observer.disconnect();
  }, [mounted]);
  useLayoutEffect(() => {
    if (player.current) player.current.inert = !watching;
    if (watching) player.current?.focus({ preventScroll: true });
    else if (mounted) preview.current?.focus({ preventScroll: true });
  }, [watching]);
  return <section id="research-approach" className="research-approach shell" aria-label={copy.film.label}
    onKeyDown={event => { if (event.key === "Escape" && watching) { event.preventDefault(); close(); } }}>
    <motion.div className="research-video-surface" initial={false}
      animate={{ height: watching ? sizes.player : sizes.preview }}
      transition={{ duration: reduced ? 0 : watching ? .55 : .4, ease: [.22, 1, .36, 1] }}
      onAnimationComplete={() => { if (!watching) setMounted(false); }}>
      <motion.div ref={previewSurface} className="research-film-preview" aria-hidden={watching}
        data-effects-active={animateEffects} initial={false} animate={{ opacity: watching ? 0 : 1 }} transition={{ duration: reduced ? 0 : .2 }}>
        <BorderBeam className="research-film-beam" size="md" colorVariant="mono" theme="dark" borderRadius={10}
          strength={.9} brightness={1.3} duration={6}>
          <div className="research-film-invitation">
            <MetalFx className="research-film-metal" variant="circle" preset="silver" theme="dark" strength={.9}
              glowGain={.45} innerShadow paused={!animateEffects} aria-hidden="true">
              <span className="research-film-play"><svg viewBox="0 0 24 24" width="24" height="24"><path d="M8 4L20 12L8 20Z" fill="currentColor" /></svg></span>
            </MetalFx>
            <button ref={preview} type="button" className="research-film-poster" disabled={watching}
              aria-expanded={watching} aria-controls="research-film-content" onClick={() => { setMounted(true); setWatching(true); }}>
              {copy.film.label}
            </button>
          </div>
        </BorderBeam>
      </motion.div>
      <motion.div ref={player} id="research-film-content" className="research-film-content" role="region" tabIndex={-1} aria-label={copy.film.label} aria-hidden={!watching}
        initial={false} animate={{ opacity: watching ? 1 : 0 }} transition={{ duration: reduced ? 0 : .2, delay: watching && !reduced ? .1 : 0 }}>
        {mounted && <><div className="research-film-toolbar"><button type="button" onClick={close} className="research-film-close" aria-label={copy.film.close}><svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg></button></div>
          <ResearchStory presentation="research" active={watching} onClose={close} />
        </>}
      </motion.div>
    </motion.div>
  </section>;
}

type Area = typeof research.areas[number];

function PillarDrawer({ area, index, immediate }: { area: Area; index: number; immediate: boolean }) {
  const present = useIsPresent();
  const reduced = useReducedMotion();
  const panel = useRef<HTMLElement>(null);
  useLayoutEffect(() => { if (panel.current) panel.current.inert = !present; }, [present]);
  return <motion.section ref={panel} id={`${area.id}-drawer`} className="research-pillar-drawer" role="region" aria-labelledby={area.id}
    aria-hidden={!present} style={{ "--drawer-row": index * 2 + 2 } as CSSProperties}
    initial={{ height: 0 }} animate={{ height: "auto", transition: { duration: immediate || reduced ? 0 : .32, ease: [.16, 1, .3, 1] } }}
    variants={{ closed: (instant: boolean) => ({ height: 0, transition: { duration: instant || reduced ? 0 : .2, ease: [.4, 0, 1, 1] } }) }} exit="closed">
    <div className="research-pillar-drawer-content">
      {area.id === "physiology" ? <ResearchPhysiology /> : area.id === "computable" ? <ResearchComputability /> : <ResearchSystems />}
    </div>
  </motion.section>;
}

function areaFromHash(hash: string) {
  return research.areas.find(area => `#${area.id}` === hash)?.id ?? null;
}

export default function Research({ embedded = false }: { embedded?: boolean }) {
  const Heading = embedded ? "h2" : "h1";
  const IndexHeading = embedded ? "h3" : "h2";
  const PillarHeading = embedded ? "h4" : "h3";
  const { hash, key } = useLocation();
  const navigationKey = `${key}:${hash}`;
  const [selection, setSelection] = useState<{ key: string; area: AreaId | null; immediate: boolean }>(() => ({ key: navigationKey, area: areaFromHash(hash), immediate: true }));
  const open = selection.key === navigationKey ? selection.area : areaFromHash(hash);
  const immediate = selection.key !== navigationKey || selection.immediate;
  const triggers = useRef<Partial<Record<AreaId, HTMLButtonElement>>>({});
  const pillarGrid = useRef<HTMLDivElement>(null);
  const pillarsVisible = useInView(pillarGrid, { once: true, amount: .15 });
  const [pillarCueComplete, setPillarCueComplete] = useState(false);
  const { target: highlight, exitEdge } = useHoverHighlight(pillarGrid, undefined, navigationKey);
  // Derive navigation state during render so the destination is measured only
  // after the old drawer is removed. Local selections retain the drawer motion.
  const closeDrawer = () => {
    if (!open) return;
    const button = triggers.current[open];
    button?.focus({ preventScroll: true });
    const header = document.querySelector(".header-inner")?.getBoundingClientRect().height ?? 88;
    if (button && button.getBoundingClientRect().top < header) button.scrollIntoView({ block: "start", behavior: "instant" });
    setSelection({ key: navigationKey, area: null, immediate: false });
  };
  const select = (id: AreaId) => {
    if (id === open) closeDrawer();
    else setSelection({ key: navigationKey, area: id, immediate: false });
  };
  const selected = research.areas.find(area => area.id === open);
  const keepSelectedRowVisible = () => {
    if (!open) return;
    const button = triggers.current[open];
    const header = document.querySelector(".header-inner")?.getBoundingClientRect().height ?? 88;
    // Removing a long earlier drawer can move the newly selected row above
    // the viewport. Keep its heading visible as its own details open.
    if (button && button.getBoundingClientRect().top < header) button.scrollIntoView({ block: "start", behavior: "instant" });
  };

  return <div className="research-page">
    <section className="research-opening shell" aria-labelledby="research-title">
      <Heading id="research-title"><span className="tape">{research.title}</span></Heading>
      <p className="research-opening-lead">{research.intro[0]}</p>
    </section>

    <ResearchFilm />

    <div id="research-pillars" className="research-pillars shell" aria-labelledby="research-pillars-title" onKeyDown={event => { if (event.key === "Escape" && open) { event.preventDefault(); closeDrawer(); } }}>
      <div className="research-pillar-header">
        <IndexHeading id="research-pillars-title" className="research-pillar-heading">{research.indexLabel}</IndexHeading>
      </div>
      <div className="research-pillar-grid pillar-disclosure-grid flowing-menu-host" ref={pillarGrid} data-cue={pillarsVisible && !pillarCueComplete}
        onAnimationEnd={event => { if (event.animationName === "pillar-disclosure-cue") setPillarCueComplete(true); }}>
        <FlowingMenuHighlight target={highlight} exitEdge={exitEdge} inset={12} />
        {research.areas.map((area, index) => <PillarHeading key={area.id} className="research-pillar-toggle pillar-disclosure-toggle" style={{ "--pillar-row": index * 2 + 1 } as CSSProperties}>
          <PillarDisclosure id={area.id} data-hover-item={area.id} ref={element => { if (element) triggers.current[area.id] = element; }} aria-expanded={open === area.id} aria-controls={`${area.id}-drawer`} onClick={() => select(area.id)} title={area.title} meta={String(index + 1).padStart(2, "0")} decorativeMeta />
        </PillarHeading>)}
        <AnimatePresence key={navigationKey} initial={false} mode="wait" custom={immediate} onExitComplete={keepSelectedRowVisible}>
          {selected && <PillarDrawer key={selected.id} area={selected} index={research.areas.indexOf(selected)} immediate={immediate} />}
        </AnimatePresence>
      </div>
    </div>

  </div>;
}
