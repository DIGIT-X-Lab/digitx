import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { FileText, Pause, Play, RotateCcw, ArrowUp, Check, ArrowRight } from "lucide-react";
import { usePreview } from "../hooks/usePreviewClock";
import { exportGalahPreviewPdf } from "./toolPreviewExports";
import { LumosWorkflow } from "./LumosWorkflow";
import { toolTeasers, toolPreview as copy } from "@/content/tool-validation";
import examples from "@/content/tool-preview-data.json";
import "./tool-teaser-visual.css";

type Preview = ReturnType<typeof usePreview>;

function Workspace({ name, preview, steps, cues, children, provenance }: {
  name: string; preview: Preview; steps: string[]; cues: number[]; children: ReactNode; provenance: string;
}) {
  const active = cues.reduce((current, start, index) => preview.time >= start ? index : current, 0);
  return <div className="tool-workflow" ref={preview.element} data-step={active} data-playing={!preview.paused && !preview.ended && !preview.reduced}>
    <div className="tool-workflow-chrome"><span className="tool-workflow-name">{name}</span><span>{copy.preview}</span></div>
    <div className="tool-workflow-stage">{children}</div>
    <div className="tool-workflow-controls">
      <div className="tool-workflow-chapters" role="group" aria-label={`${name} preview steps`}>
        {steps.map((step, i) => <button key={step} type="button" aria-pressed={active === i} onClick={() => preview.seek(cues[i])}>
          <span className="tool-workflow-step-dot" aria-hidden="true" />{step}
        </button>)}
      </div>
      {!preview.reduced && <button className="tool-workflow-play" type="button" onClick={preview.toggle}
        aria-label={preview.ended ? copy.replay : preview.paused ? copy.resume : copy.pause}>
        {preview.ended ? <RotateCcw /> : preview.paused ? <Play /> : <Pause />}
      </button>}
    </div>
    <span className="sr-only">{provenance}</span>
  </div>;
}

const colour = (value: number, map: boolean) => {
  const v = Math.max(0, Math.min(1, value)) ** .72;
  const low = map ? [29, 40, 48] : [32, 30, 28], high = map ? [157, 185, 201] : [222, 215, 207];
  return `rgb(${low.map((a, i) => Math.round(a + (high[i] - a) * v)).join(",")})`;
};
function PetVolume({ frame, map }: { frame?: number; map?: number }) {
  const id = useId().replace(/:/g, "");
  return <svg className="teaser-pet-volume" viewBox="300 220 430 555" aria-hidden="true">
    <defs><linearGradient id={`${id}-fade`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="white" stopOpacity="0" /><stop offset=".1" stopColor="white" /><stop offset=".86" stopColor="white" /><stop offset="1" stopColor="white" stopOpacity="0" /></linearGradient>
      <mask id={`${id}-mask`}><rect x="300" y="220" width="430" height="555" fill={`url(#${id}-fade)`} /></mask>
    </defs>
    <image href="/illustrations/tools/taipan-source-anatomy.png" width="1024" height="1536" className="teaser-pet-anatomy" mask={`url(#${id}-mask)`} />
    <g className="teaser-pet-cells">{examples.taipan.cells.map((cell, i) => <rect key={i} x={cell.x - 7.5} y={cell.y - 7.5} width="15" height="15"
      fill={colour(map === undefined ? cell.frames[frame ?? 0] : cell.maps[map], map !== undefined)} />)}</g>
  </svg>;
}

/** Opening CHILI slide: exact three-quarter artwork, circulation routes,
 * packet trails and heartbeat. The clock is shared with the workflow controls. */
function TracerPassage({ time }: { time: number }) {
  const root = useRef<SVGSVGElement>(null);
  const id = useId().replace(/:/g, "");
  useEffect(() => {
    const svg = root.current;
    if (!svg) return;
    const clamp = (v: number) => Math.max(0, Math.min(1, v));
    const beat = (time % 1200) / 1200;
    const systole = ((1 + Math.cos(2 * Math.PI * (beat - .17))) / 2) ** 11;
    const recovery = ((1 + Math.cos(2 * Math.PI * (beat - .45))) / 2) ** 9;
    const heart = svg.querySelector<SVGGElement>(".teaser-cover-heart");
    heart?.setAttribute("transform", `translate(556 394) scale(${1.015 - .085 * systole + .014 * recovery}) translate(-556 -394)`);
    heart?.setAttribute("opacity", String(.56 + .42 * systole));
    svg.querySelector(".teaser-cover-aura")?.setAttribute("opacity", String(.16 + .75 * systole));
    examples.taipan.routes.forEach((route, index) => {
      const path = svg.querySelector<SVGPathElement>(`[data-route="${index}"]`);
      if (!path) return;
      const length = path.getTotalLength();
      const age = (time - route.start + 12000) % 1200;
      svg.querySelectorAll<SVGGElement>(`[data-packet="${index}"]`).forEach((packet, j) => {
        const u = (age + j * 1200) / route.travel;
        const point = path.getPointAtLength(clamp(u) * length);
        const tail = Math.max(0, u - Math.min(.14, 160 / route.travel));
        const line = Array.from({ length: 8 }, (_, k) => {
          const p = path.getPointAtLength(clamp(tail + (Math.min(1, u) - tail) * k / 7) * length);
          return `${k ? "L" : "M"}${p.x} ${p.y}`;
        }).join(" ");
        packet.setAttribute("opacity", String(Math.max(0, Math.min(1, u * 14, (1 - u) * 14))));
        packet.querySelectorAll("path").forEach(trail => trail.setAttribute("d", line));
        packet.querySelector("circle")?.setAttribute("cx", String(point.x));
        packet.querySelector("circle")?.setAttribute("cy", String(point.y));
      });
    });
  }, [time]);
  return <svg ref={root} className="teaser-tracer-body" viewBox="157.172 0 642.977 1536" aria-hidden="true">
    <defs>
      <radialGradient id={`${id}-mask`}><stop offset=".38" stopColor="white" /><stop offset="1" stopColor="black" /></radialGradient>
      <mask id={`${id}-heart`}><ellipse cx="556" cy="394" rx="59" ry="66" fill={`url(#${id}-mask)`} /></mask>
      <radialGradient id={`${id}-glow`}><stop stopColor="#e98175" stopOpacity=".55" /><stop offset=".36" stopColor="#e36b63" stopOpacity=".16" /><stop offset="1" stopColor="#e36b63" stopOpacity="0" /></radialGradient>
    </defs>
    <image href="/illustrations/tools/taipan-cover-anatomy.png" width="1024" height="1536" />
    {examples.taipan.routes.map((route, index) => <g key={index} className={`teaser-cover-vessel teaser-cover-vessel--${route.kind}`}>
      <path className="teaser-cover-route" data-route={index} d={route.d} />
      {Array.from({ length: Math.ceil(route.travel / 1200) }, (_, j) => <g key={j} data-packet={index} opacity="0"><path className="teaser-cover-halo" /><path className="teaser-cover-trail" /><circle r="3.6" className="teaser-cover-particle" /></g>)}
    </g>)}
    <ellipse className="teaser-cover-aura" cx="556" cy="394" rx="87" ry="94" fill={`url(#${id}-glow)`} />
    <g className="teaser-cover-heart"><image href="/illustrations/tools/taipan-cover-anatomy.png" width="1024" height="1536" mask={`url(#${id}-heart)`} /><path d="M548 350C527 347 513 363 518 390C523 420 545 440 568 439C592 440 598 417 588 388C583 366 566 348 548 350Z" /></g>
  </svg>;
}
function TemporalStudy() {
  const preview = usePreview(9000);
  const mapped = preview.time >= 5400;
  const c = copy.taipan;
  return <Workspace name="TAIPAN" preview={preview} steps={c.steps} cues={[0, 3600, 6200]} provenance={c.provenance}>
    <div className="teaser-pet-workspace">
      <div className="teaser-pet-input">
        <h5>{c.input}</h5><TracerPassage time={preview.time} />
        <label className="teaser-tracer-control"><span>{c.passage}</span><input type="range" min="0" max="9000" step="50" value={preview.time} aria-label={c.scrub} aria-valuetext={`${Math.round(preview.time / 90)}% through the circulation illustration`} onChange={event => preview.seek(Number(event.target.value))} /></label>
      </div>
      <ArrowRight className="teaser-pet-arrow" aria-hidden="true" />
      <div className="teaser-pet-output" data-ready={mapped}>
        <h5>{c.output}</h5><div className="teaser-pet-maps"><PetVolume map={0} /><PetVolume map={1} /></div>
        <p>{mapped ? c.done : c.working}</p>
      </div>
    </div>
  </Workspace>;
}

function ReportAnatomy() {
  const id = useId().replace(/:/g, "");
  return <svg className="teaser-report-anatomy" viewBox="200 8 630 1480" aria-hidden="true">
    <defs><filter id={`${id}-lesion`} colorInterpolationFilters="sRGB"><feFlood floodColor="#e36b63" /><feComposite in2="SourceAlpha" operator="in" /></filter></defs>
    <image href="/illustrations/anatomy/patient-003.webp" width="1024" height="1536" />
    {[{ x: 395, y: 340, size: 86 }, { x: 488, y: 395, size: 48 }, { x: 484, y: 535, size: 42 }].map((lesion, i) => <svg key={i} x={lesion.x} y={lesion.y} width={lesion.size} height={lesion.size} viewBox="330 480 230 205"><image href="/illustrations/anatomy/puma-rgb-tumours-v1.png" width="1024" height="1536" filter={`url(#${id}-lesion)`} /></svg>)}
  </svg>;
}
/** Text Type-style character fades driven by the preview clock. Reserving an
 * arriving word's width prevents it from jumping lines halfway through typing. */
function StreamingParagraph({ text, progress }: { text: string; progress: number }) {
  let position = 0;
  return <p aria-hidden="true">{text.split(/(\s+)/).map((word, i) => {
    const start = position;
    position += word.length;
    if (progress <= start) return null;
    if (/^\s+$/.test(word)) return word;
    return <span className="teaser-report-word" key={i}>{Array.from(word).map((character, j) => <span key={j} style={{ opacity: Math.max(0, Math.min(1, (progress - start - j) / 4)) }}>{character}</span>)}</span>;
  })}</p>;
}

function ReadingStudy() {
  const preview = usePreview(11000, 0);
  const c = copy.galah;
  const transcript = useRef<HTMLDivElement>(null);
  const lastScrollFrame = useRef(0);
  const userReading = useRef(false);
  const sent = preview.time >= 1800;
  const writing = preview.time >= 2800;
  const fraction = Math.max(0, Math.min(1, (preview.time - 2800) / 5000));
  const typed = c.prompt.slice(0, Math.floor(Math.min(1, preview.time / 1500) * c.prompt.length));
  const characters = c.findings.reduce((total, finding) => total + finding.length, 0);
  let offset = 0;
  useEffect(() => {
    const element = transcript.current;
    if (!element) return;
    if (!sent) { element.scrollTop = 0; lastScrollFrame.current = 0; userReading.current = false; return; }
    if (userReading.current) return;
    const target = Math.max(0, element.scrollHeight - element.clientHeight);
    if (preview.reduced || preview.paused) { element.scrollTop = target; lastScrollFrame.current = 0; return; }
    const now = performance.now();
    const delta = lastScrollFrame.current ? Math.min(50, now - lastScrollFrame.current) : 16;
    lastScrollFrame.current = now;
    const gap = target - element.scrollTop;
    element.scrollTop = Math.abs(gap) < .5 ? target : element.scrollTop + gap * (1 - Math.exp(-delta / 65));
  }, [preview.time, sent, preview.reduced, preview.paused]);
  const holdForReading = () => { userReading.current = true; preview.seek(preview.time); };
  const controls = {
    ...preview,
    seek: (time: number) => { userReading.current = false; preview.seek(time); },
    toggle: () => { userReading.current = false; preview.toggle(); },
  };
  return <Workspace name="GALAH" preview={controls} steps={c.steps} cues={[0, 2200, 9000]} provenance={c.provenance}>
    <div className="teaser-galah-workspace">
      <div className="teaser-galah-layout">
        <div className="teaser-galah-scan"><h5>{c.input}</h5><ReportAnatomy /><p><Check aria-hidden="true" />{c.loaded}</p></div>
        <div className="teaser-galah-conversation" ref={transcript} onWheel={holdForReading} onTouchStart={holdForReading}>
          <div className="teaser-galah-greeting-message">
            <div className="teaser-galah-assistant"><span className="teaser-galah-avatar" aria-hidden="true">G</span><span>{c.assistant}</span></div>
            <p className="teaser-galah-greeting">{c.greeting}</p>
          </div>
          {sent && <div className="teaser-galah-message" data-visible="true"><span>{c.user}</span><p>{c.prompt}</p></div>}
          {writing && <div className="teaser-report-sheet" data-writing="true">
            <div className="teaser-galah-assistant"><span className="teaser-galah-avatar" aria-hidden="true">G</span><span>{c.assistant}</span></div>
            <div className="teaser-report-title"><FileText aria-hidden="true" /><span>{c.report}</span></div>
            <p className="teaser-report-status">{fraction >= 1 ? c.status : c.working}</p>
            <h5>{c.section}</h5>
            <div className="teaser-report-text" role="img" aria-label={c.findings.join(" ")}>
              {c.findings.map(finding => {
                const progress = fraction * (characters + 4) - offset;
                offset += finding.length;
                return progress > 0 && <StreamingParagraph key={finding} text={finding} progress={progress} />;
              })}
            </div>
            {fraction >= 1 && <div className="teaser-report-exports" data-visible="true">
              <button type="button" onClick={exportGalahPreviewPdf}>{c.exportPdf}</button>
              <a href="/downloads/galah-preview-report.dcm" download>{c.exportDicom}</a>
            </div>}
          </div>}
        </div>
      </div>
      <div className="teaser-galah-composer"><span className={sent ? "is-placeholder" : ""}>{sent ? c.followup : typed || c.prompt}</span><button type="button" onClick={() => { userReading.current = false; preview.start(2200); }} aria-label={c.send}><ArrowUp aria-hidden="true" /></button></div>
    </div>
  </Workspace>;
}

export function ToolTeaserVisual({ slug }: { slug: string }) {
  return <figure className={`tool-teaser-art tool-teaser-art--${slug}`} aria-label={toolTeasers[slug].artLabel}>
    {slug === "taipan" ? <TemporalStudy /> : slug === "lumos" ? <LumosWorkflow /> : <ReadingStudy />}
  </figure>;
}
