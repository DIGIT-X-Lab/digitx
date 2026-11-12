/* THESIS: "What computable means" is answered by the approach film itself,
 *   playing in the page. Nothing re-authored: the PI-approved scenes, spacing
 *   and fictional teaching records render exactly as filmed.
 * OWN-WORLD: the shipped DIGITX language, retained by user decision (canon,
 *   seed f3fef8b0). The film already lives inside that language; the scene
 *   sits borderless on the page ground, cropped with the film's own in-page
 *   viewBox, no frame chrome.
 * STORY: the section enters, the film plays its five chapters once; the rail
 *   beneath tracks the chapter live and jumps on click; leaving the viewport
 *   pauses it. The visitor watches observations become computable, connected
 *   and investigated.
 * FORM: a normal-flow section (no pinning, per user: scrubbing felt
 *   unsatisfying); autoplay on visibility mirrors the film's own in-page
 *   behaviour. Reduced motion shows the final overview still, rail seeking
 *   directly between approved chapter stills. */
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useMotionPreference } from "../hooks/useMotionPreference";
import { Tape } from "../components/primitives";
import "./atlas-moment.css";

type Mode = "editorial" | "motion";

/** The film's chapters: names, titles, descriptions and times verbatim from
 * public/previews/digitx-story-data.mjs. */
const CHAPTERS = [
  { numeral: "I", name: "Observe", start: 0, inspect: 4.4, title: "We start with many observations of one person.", description: "Images and different kinds of reports accumulate over time." },
  { numeral: "II", name: "Make computable", start: 5.5, inspect: 19.4, title: "We make observations computable.", description: "First measure anatomy in images. Then interpret narrative reports as computable observations, preserving units, time and negation." },
  { numeral: "III", name: "Bring together", start: 25, inspect: 30.8, title: "We bring each person's information together.", description: "The person and their record change together. Measurements, clinical context and time stay connected." },
  { numeral: "IV", name: "Connect", start: 32, inspect: 36.9, title: "We connect information across people.", description: "Connect images, body composition, laboratory findings, pathology, treatment and time around the person." },
  { numeral: "V", name: "Investigate", start: 37.5, inspect: 48, title: "We develop and test autonomous AI for discovery.", description: "We build and test autonomous AI research systems to look for patterns, test explanations and ask new questions about human biology." },
] as const;

/** Only the scene travels into this moment; the film page's own chrome stays
 * on the standalone study. Injected from the parent; the film files are not
 * modified. The viewBox crop is the film's own in-page framing. */
const SCENE_ONLY = `
.masthead, .playback, .chapters, .mission, .footnote, .mobile-caption, .load-status { display: none !important; }
main, .film, #scene { padding: 0 !important; margin: 0 !important; max-width: none !important; }
body { overflow: hidden !important; background: transparent !important; }
#scene svg { max-width: none !important; width: 100% !important; height: auto !important; }
`;
/* The region of the film's canvas (its own user units) that this placement
 * shows: the content area across all five chapters, without the standalone
 * page's blank margins. Framed from the parent via the SVG's real transform,
 * so the film itself stays untouched and the maths cannot drift. */
/* Pixel-measured union of the five chapter stills on the film's 1480x800
 * canvas: the scenes use almost the whole canvas; only the outer margins go. */
const FRAMING = { x: 32, y: 40, w: 1408, h: 756 };

type StoryHandle = {
  seek: (time: number) => void;
  play: () => void;
  pause: () => void;
  state: () => { time: number; playing: boolean; ready: boolean; stage: number };
};

export function AtlasMoment({ register }: { register: Mode }) {
  const reduced = useMotionPreference();
  const root = useRef<HTMLElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const story = useRef<StoryHandle | null>(null);
  const rail = useRef<HTMLOListElement>(null);
  const [stage, setStage] = useState(reduced ? CHAPTERS.length - 1 : 0);
  /* The marker's resting place: the active chapter's extent, measured so
     the spring can glide the line down the track as the film advances. */
  const [marker, setMarker] = useState<{ top: number; height: number } | null>(null);
  useEffect(() => {
    const measure = () => {
      const list = rail.current;
      const item = list?.querySelectorAll<HTMLElement>(".atlas-rail-item")[stage];
      if (!list || !item) return;
      const listBox = list.getBoundingClientRect();
      const itemBox = item.getBoundingClientRect();
      setMarker({ top: itemBox.top - listBox.top + 6, height: itemBox.height - 12 });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [stage]);
  /* On the phone strip the rail scrolls itself, never the page, so the
     active chapter stays in view as the film advances. */
  useEffect(() => {
    const list = rail.current;
    const item = list?.querySelectorAll<HTMLElement>(".atlas-rail-item")[stage];
    if (!list || !item || list.scrollWidth <= list.clientWidth + 4) return;
    const target = Math.max(0, Math.min(item.offsetLeft - 16, list.scrollWidth - list.clientWidth));
    list.scrollTo({ left: target, behavior: reduced ? "instant" : "smooth" });
  }, [stage, reduced]);

  const getStory = () => {
    if (!story.current) story.current = (frame.current?.contentWindow as (Window & { digitxStory?: StoryHandle }) | null)?.digitxStory ?? null;
    return story.current;
  };

  /** Size and place the oversized iframe so the FRAMING region of the scene
   * exactly fills the clipping wrapper, using the SVG's real screen transform
   * rather than assumptions about its internal layout. */
  const applyFraming = () => {
    const iframeEl = frame.current;
    const wrap = iframeEl?.parentElement;
    const svg = iframeEl?.contentDocument?.querySelector<SVGSVGElement>("#scene svg");
    if (!iframeEl || !wrap || !svg) return;
    iframeEl.style.width = `${wrap.clientWidth}px`;
    iframeEl.style.height = `${Math.max(wrap.clientHeight, 200)}px`;
    iframeEl.style.transform = "none";
    const measure = () => {
      const ctm = svg.getScreenCTM();
      if (!ctm) return null;
      const origin = new DOMPoint(FRAMING.x, FRAMING.y).matrixTransform(ctm);
      const corner = new DOMPoint(FRAMING.x + FRAMING.w, FRAMING.y + FRAMING.h).matrixTransform(ctm);
      return { left: origin.x, top: origin.y, width: corner.x - origin.x, height: corner.y - origin.y };
    };
    const before = measure();
    if (!before || before.width <= 0) return;
    const scale = wrap.clientWidth / before.width;
    iframeEl.style.width = `${wrap.clientWidth * scale}px`;
    iframeEl.style.height = `${(before.top + before.height) * scale + 80}px`;
    requestAnimationFrame(() => {
      const after = measure();
      if (!after) return;
      iframeEl.style.transform = `translate(${-after.left}px, ${-after.top}px)`;
    });
  };

  const handleLoad = () => {
    const doc = frame.current?.contentDocument;
    if (!doc) return;
    const style = doc.createElement("style");
    style.textContent = SCENE_ONLY;
    doc.head.appendChild(style);
    applyFraming();
  };

  useEffect(() => {
    const wrap = frame.current?.parentElement;
    if (!wrap) return;
    let raf = 0;
    const observer = new ResizeObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(applyFraming); });
    observer.observe(wrap);
    return () => { observer.disconnect(); cancelAnimationFrame(raf); };
  }, []);

  /** Autoplay mirrors the film's own in-page rule: play when the scene is
   * properly on screen, pause when it leaves; the story plays once and its
   * closing effects carry on, exactly as authored. */
  useEffect(() => {
    if (reduced) return;
    const section = root.current;
    if (!section) return;
    let wanted = false;
    let waiting = 0;
    let begun = false;
    const tryPlay = () => {
      const handle = getStory();
      if (!wanted) return;
      if (handle?.state().ready) {
        // The iframe opens on the chapter I still (?stage=1 suppresses the
        // standalone page's autoplay); the first play rewinds to 0 so the
        // Observe chapter's acquisition-over-time animation actually runs.
        if (!begun) { begun = true; handle.seek(0); }
        handle.play();
      } else waiting = window.setTimeout(tryPlay, 300);
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.intersectionRatio >= 0.35) { wanted = true; tryPlay(); }
      else if (entry.intersectionRatio < 0.1) { wanted = false; window.clearTimeout(waiting); getStory()?.pause(); }
    }, { threshold: [0, 0.1, 0.35] });
    observer.observe(section);
    let loopHold = 0;
    const tracker = window.setInterval(() => {
      const handle = getStory();
      if (!handle) return;
      const state = handle.state();
      if (!state.ready) return;
      setStage(Math.max(0, Math.min(CHAPTERS.length - 1, state.stage - 1)));
      /* The film loops while on screen: hold the closing frame for a
         breath, then begin again from Observe. */
      const total = (handle as { duration?: number }).duration ?? 48;
      if (wanted && state.time >= total && !loopHold) {
        loopHold = window.setTimeout(() => {
          loopHold = 0;
          const current = getStory();
          if (wanted && current) { current.seek(0); current.play(); }
        }, 1400);
      }
    }, 350);
    return () => {
      observer.disconnect();
      window.clearTimeout(waiting);
      window.clearInterval(tracker);
      window.clearTimeout(loopHold);
      getStory()?.pause();
    };
  }, [reduced]);

  const jump = (index: number) => {
    const handle = getStory();
    if (!handle) return;
    // Playing context: land at the chapter's start so its build-up plays;
    // reduced motion gets the approved settled still instead.
    handle.seek(reduced ? CHAPTERS[index].inspect : CHAPTERS[index].start);
    setStage(index);
    if (!reduced) handle.play();
  };

  const active = CHAPTERS[Math.max(0, stage)];
  return <section ref={root} className="atlas-moment" data-reduced={reduced} aria-labelledby="atlas-title" data-register={register}>
    <div className="atlas-inner shell">
      <div className="atlas-head">
        {/* The chapter opens like its siblings: ivory tape title, named for
            the film's subject. The film's rotating titles carry the rest. */}
        <Tape as="h2" size="display" id="atlas-title">Let&rsquo;s find out.</Tape>
        <div className="atlas-status" aria-live="polite">
          <p className="atlas-status-title">{active.title}</p>
          <p className="atlas-status-line">{active.description}</p>
        </div>
      </div>
      {/* Wide screens seat the chapter rail vertically beside the frame,
          in the column the height-capped scene leaves free; narrow screens
          keep it as a row beneath. */}
      <div className="atlas-stage">
        <div className="atlas-rail-row">
          <ol className="atlas-rail" ref={rail}>
            {CHAPTERS.map((chapter, index) => <li key={chapter.name}>
              <button type="button" className="atlas-rail-item" aria-current={stage === index ? "true" : undefined} onClick={() => jump(index)}>
                <span className="atlas-numeral">{chapter.numeral}</span>
                <span className="atlas-rail-name">{chapter.name}</span>
              </button>
            </li>)}
            {marker && <motion.span className="atlas-rail-marker" aria-hidden="true" initial={false}
              animate={{ top: marker.top, height: marker.height }} transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 30 }} />}
          </ol>
          <p className="sr-only">Illustrative anatomy and fictional patient records.</p>
        </div>
        <div className="atlas-scene">
          <iframe ref={frame} src={`/previews/digitx-story.html?stage=${reduced ? 5 : 1}`} title="Our approach film"
            tabIndex={-1} aria-hidden="true" loading="lazy" onLoad={handleLoad} />
        </div>
      </div>
    </div>
  </section>;
}
