import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { toolValidation as copy } from "@/content/tool-validation";
import { useMotionPreference } from "../hooks/useMotionPreference";
import "./making-heading.css";

const SPEED = 26; // CSS pixels per second, independent of viewport width.

/** React Bits Text Loop, adapted to the approved straight-line treatment:
 * https://reactbits.dev/text-animations/text-loop?shape=line
 * Two identical text groups make the seam exact without SVG or a frame ticker.
 * Shared type tokens still own the actual rendered letter size. */
export function MakingHeading({ id }: { id: string }) {
  const root = useRef<HTMLDivElement>(null);
  const unit = useRef<HTMLSpanElement>(null);
  const reduced = useMotionPreference();
  const [metrics, setMetrics] = useState({ width: 0, repeats: 1 });
  const [visible, setVisible] = useState(false);
  const [hidden, setHidden] = useState(document.hidden);
  const [paused, setPaused] = useState(false);

  useLayoutEffect(() => {
    if (reduced) return;
    const container = root.current;
    const phrase = unit.current;
    if (!container || !phrase) return;
    let alive = true;
    const measure = () => {
      if (!alive) return;
      const width = phrase.getBoundingClientRect().width;
      if (!width) return;
      const repeats = Math.max(1, Math.ceil(container.clientWidth / width));
      setMetrics(previous => previous.width === width && previous.repeats === repeats
        ? previous : { width, repeats });
    };
    const resize = new ResizeObserver(measure);
    resize.observe(container);
    resize.observe(phrase);
    document.fonts.ready.then(measure);
    measure();
    return () => { alive = false; resize.disconnect(); };
  }, [reduced]);

  useEffect(() => {
    const container = root.current;
    if (!container) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(container);
    const visibility = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  const running = metrics.width > 0 && visible && !hidden && !reduced && !paused;
  const style = { "--making-loop-duration": `${metrics.width * metrics.repeats / SPEED}s` } as CSSProperties;

  return <div ref={root} className="making-heading" data-running={running} data-reduced-motion={reduced}>
    <h3 id={id} aria-label={copy.title}>
      {reduced ? <span className="making-static-title">{copy.title}</span> :
        <button type="button" className="making-loop" style={style}
          aria-label={paused ? "Resume coming soon animation" : "Pause coming soon animation"}
          aria-pressed={paused} title={paused ? "Resume animation" : "Pause animation"}
          onClick={() => setPaused(previous => !previous)}>
          <span className="making-loop-track" aria-hidden="true">
            {[0, 1].map(group => <span className="making-loop-group" key={group}>
              {Array.from({ length: metrics.repeats }, (_, index) =>
                <span className="making-loop-unit" key={index} ref={group === 0 && index === 0 ? unit : undefined}>{copy.title}</span>)}
            </span>)}
          </span>
        </button>}
    </h3>
  </div>;
}
