import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { toolStudyCopy as copy } from "@/content/tool-guides";
import { Arrow } from "./primitives";
import { FalconStudyVisual } from "./FalconStudyVisual";
import { LionStudyVisual } from "./LionStudyVisual";
import { NiftiStudyVisual } from "./NiftiStudyVisual";
import { MosaicStudyVisual } from "./MosaicStudyVisual";
import "./tool-study.css";

// The same sparse wireframe as Home. Only the explanation layers change.
const human = "/illustrations/anatomy/front-clean.webp";

/** One interruptible concept sequence. CSS owns the motion; React only changes
 * activity when visibility, user intent or accessibility preferences change. */
function Study({ slug, caption, children, active, once = false, loop = false }: { slug: string; caption: string; children: ReactNode; active: boolean; once?: boolean; loop?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [started, setStarted] = useState(false);
  const [hidden, setHidden] = useState(document.hidden);
  const [reduced, setReduced] = useState(() => matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [paused, setPaused] = useState(false);
  const [inspecting, setInspecting] = useState(false);
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReduced(preference.matches);
    const updateVisibility = () => setHidden(document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
      if (entry.isIntersecting) setStarted(true);
    }, { threshold: .15 });
    if (ref.current) observer.observe(ref.current);
    preference.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => { observer.disconnect(); preference.removeEventListener("change", updateMotion); document.removeEventListener("visibilitychange", updateVisibility); };
  }, []);
  const inspectingNow = !loop && inspecting;
  const running = active && visible && !hidden && !reduced && ((once && !loop) || (!paused && !inspectingNow));
  return <figure ref={ref} className={`tool-study tool-study--${slug}`} aria-label={caption} data-started={started} data-running={running} data-reduced={reduced} data-inspecting={inspectingNow} data-loop={loop}>
    <div className="tool-study-stage" onPointerEnter={event => { if (!loop && event.pointerType === "mouse") setInspecting(true); }} onPointerLeave={() => setInspecting(false)}>{children}</div>
    {active && !reduced && (!once || loop) && <button type="button" className="tool-study-motion" aria-label={`${paused ? "Play" : "Pause"} ${slug === "nifti2dicom" ? slug : slug.toUpperCase()} illustration`} aria-pressed={paused} onClick={() => setPaused(value => !value)}>
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">{paused ? <path d="m7 4 9 6-9 6Z" fill="currentColor" /> : <path d="M7 4v12M13 4v12" stroke="currentColor" strokeWidth="1.5" />}</svg>
    </button>}
  </figure>;
}

function PumaStudy({ active, loop }: { active: boolean; loop: boolean }) {
  const id = useId().replace(/:/g, "");
  const combinations = [...new Set([...copy.puma.channels, ...copy.puma.lesions.map(lesion => lesion.channels.join("-"))])];
  const regions = [...new Set(copy.puma.lesions.map(lesion => lesion.source))];
  const lesions = (channel?: string) => copy.puma.lesions.filter(lesion => !channel || lesion.channels.includes(channel)).map(lesion =>
    <svg key={lesion.id} data-lesion={lesion.id} data-channels={channel ?? lesion.channels.join(" ")}
      x={lesion.x} y={lesion.y} width={lesion.size} height={lesion.size} viewBox={lesion.source} overflow="hidden" aria-hidden="true">
      <image href="/illustrations/anatomy/puma-rgb-tumours-v1.png" width="1024" height="1536"
        filter={`url(#${id}-lesion-${channel ?? lesion.channels.join("-")}-${regions.indexOf(lesion.source)})`} />
    </svg>);
  return <Study slug="puma" active={active} loop={loop} caption={copy.puma.description}>
    <div className="tool-study-multiplex">
      <svg className="tool-study-puma-definitions" aria-hidden="true" width="0" height="0"><defs>
        {copy.puma.channels.map((channel, index) => {
          const matrix = Array.from({ length: 4 }, (_, row) => Array.from({ length: 5 }, (_, column) => row === column && (row === index || row === 3) ? 1 : 0).join(" ")).join(" ");
          return <filter key={channel} id={`${id}-body-${channel}`} colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values={matrix} /></filter>;
        })}
        {combinations.flatMap(combination => regions.map((source, index) => {
          const [x, y, width, height] = source.split(" ").map(Number);
          return <filter key={`${combination}-${source}`} id={`${id}-lesion-${combination}-${index}`} colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse" x={x} y={y} width={width} height={height}>
            <feFlood floodColor={`rgb(${copy.puma.channels.map(channel => combination.split("-").includes(channel) ? 255 : 0).join(",")})`} />
            <feComposite in2="SourceAlpha" operator="in" />
          </filter>;
        }))}
      </defs></svg>
      {copy.puma.channels.map((channel, index) => <svg key={channel} className={`tool-study-puma-view tool-study-puma-source tool-study-puma-source--${channel}`}
        viewBox="200 8 630 1480" role="img" aria-label={`${copy.puma.studies[index]}, ${channel} tumour signal`}>
        <image href={human} width="1024" height="1536" filter={`url(#${id}-body-${channel})`} />
        {lesions(channel)}
      </svg>)}
      <svg className="tool-study-puma-view tool-study-puma-fused" viewBox="200 8 630 1480" role="img" aria-label={copy.puma.description}>
        <image className="tool-study-puma-patient" href={human} width="1024" height="1536" />
        {lesions()}
      </svg>
    </div>
    <div className="tool-study-flow"><span>{copy.puma.input}</span><Arrow /><span>{copy.puma.output}</span></div>
  </Study>;
}

export function ToolStudy({ slug, active = true, loop = false }: { slug: string; active?: boolean; loop?: boolean }) {
  if (slug === "moose") return <Study slug={slug} active={active} loop={loop} once caption={copy.segmentation}>
    <svg className="tool-study-segmentation" viewBox="200 8 630 1480" role="img" aria-label="The Home wireframe reveals coloured organ and tissue segmentation contours">
      <image href={human} width="1024" height="1536" />
      <image className="tool-study-segmented" href="/illustrations/anatomy/moose-contours-v5.png" width="1024" height="1536" transform="translate(180 80) scale(.65)" />
    </svg>
  </Study>;
  if (slug === "lion") return <Study slug={slug} active={active} loop={loop} once caption={copy.lion.description}>
    <LionStudyVisual />
  </Study>;
  if (slug === "mosaicx") return <Study slug={slug} active={active} loop={loop} caption={copy.mosaicx.description}>
    <MosaicStudyVisual />
  </Study>;
  if (slug === "annotatex") return <Study slug={slug} active={active} loop={loop} caption={copy.annotatex.description}>
    <MosaicStudyVisual annotating />
  </Study>;
  if (slug === "falcon") return <Study slug={slug} active={active} loop={loop} caption={copy.falcon.description}>
    <FalconStudyVisual />
  </Study>;
  if (slug === "puma") return <PumaStudy active={active} loop={loop} />;
  if (slug === "nifti2dicom") return <Study slug={slug} active={active} loop={loop} caption={copy.nifti2dicom.title}>
    <NiftiStudyVisual />
  </Study>;
  return null;
}
