import { Fragment, useEffect, useId, useRef, useState, type MouseEvent, type PointerEvent } from "react";
import { toolStudyCopy } from "@/content/tool-guides";
import "./mosaic-study-visual.css";

const copy = toolStudyCopy.mosaicx;
const annotation = toolStudyCopy.annotatex;
const annotationFields = [...copy.fields].reverse();
const sourceParts = copy.sourceText.split(new RegExp(`(${copy.fields.map(field => field.excerpt).join("|")})`, "i"));

export function MosaicStudyVisual({ annotating = false }: { annotating?: boolean }) {
  const id = useId().replace(/:/g, "");
  const root = useRef<HTMLDivElement>(null);
  const [paths, setPaths] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const active = hovered ?? focused ?? selected;

  useEffect(() => {
    const element = root.current;
    if (!element || annotating) return;
    let frame = 0;
    let disposed = false;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (disposed) return;
        const bounds = element.getBoundingClientRect();
        const source = element.querySelector(".mosaic-source")!.getBoundingClientRect();
        const stacked = bounds.width <= 480;
        // Start below the entire excerpt: wrapped sentences must never have
        // connector lines running through their text.
        const startY = source.bottom - bounds.top + 12;
        const next = copy.fields.map((field, index) => {
          const target = element.querySelector(`[data-result="${field.id}"]`)!.getBoundingClientRect();
          const startX = bounds.width * (index === 0 ? .32 : .68);
          if (stacked) {
            const rail = 5 + index * 9;
            const endY = target.top - bounds.top + 25;
            const endX = target.left - bounds.left - 7;
            const turnY = startY + 12 + index * 7;
            return `M${startX} ${startY} C${startX} ${turnY} ${rail} ${startY} ${rail} ${turnY + 10} V${endY - 9} Q${rail} ${endY} ${rail + 9} ${endY} H${endX}`;
          }
          const endX = target.left - bounds.left + target.width / 2;
          const endY = target.top - bounds.top - 8;
          const middle = (startY + endY) / 2;
          return `M${startX} ${startY} C${startX} ${middle} ${endX} ${middle} ${endX} ${endY}`;
        });
        setPaths(previous => previous.join() === next.join() ? previous : next);
      });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    observer.observe(element.querySelector(".mosaic-source")!);
    measure();
    void document.fonts.ready.then(() => { if (!disposed) measure(); });
    return () => { disposed = true; cancelAnimationFrame(frame); observer.disconnect(); };
  }, [annotating]);

  const interaction = (field: string) => ({
    onPointerEnter: (event: PointerEvent) => { if (event.pointerType === "mouse") setHovered(field); },
    onPointerLeave: () => setHovered(null),
    onFocus: () => setFocused(field),
    onBlur: () => setFocused(null),
    onClick: (event: MouseEvent<HTMLButtonElement>) => {
      event.currentTarget.focus({ preventScroll: true });
      setSelected(value => value === field ? null : field);
    },
  });

  return <div ref={root} className="mosaic-visual" data-kind={annotating ? "annotatex" : "mosaicx"} data-active={active ?? undefined}
    onKeyDown={event => {
      if (event.key === "Escape" && active) {
        event.stopPropagation();
        setSelected(null); setHovered(null); setFocused(null);
      }
    }}>
    <div className="mosaic-source">
      {annotating ? <p className="mosaic-label annotate-steps">{annotation.steps.map((step, index) => <span key={step} data-step={index}>{step}</span>)}</p> : <p className="mosaic-label">{copy.source}</p>}
      <p className="mosaic-excerpt">{sourceParts.map((part, index) => {
        const field = copy.fields.find(item => item.excerpt.toLowerCase() === part.toLowerCase());
        return field ? <button type="button" key={field.id} className={`mosaic-phrase mosaic-tone--${field.id}`}
          data-match={active === field.id} aria-pressed={selected === field.id}
          aria-label={`${part}. ${annotating ? "Highlight" : "Trace"} ${field.label.toLowerCase()} ${annotating ? "annotation" : "field"}.`}
          aria-describedby={`${id}-hint`} {...interaction(field.id)}>
          {part}<sup aria-hidden="true">{field.reference}</sup>
        </button> : <span key={index}>{part}</span>;
      })}</p>
    </div>
    {!annotating && <svg className="mosaic-connections" aria-hidden="true">
      {copy.fields.map((field, index) => <path key={field.id} className={`mosaic-connection mosaic-tone--${field.id}`}
        data-match={active === field.id} d={paths[index] ?? ""} pathLength="1" />)}
    </svg>}
    <div className={`mosaic-results${annotating ? " annotate-results" : ""}`} role="group" aria-label={annotating ? annotation.structure : copy.output}>
      {(annotating ? annotationFields : copy.fields).map((field, index) => <Fragment key={field.id}>
        {annotating && index > 0 && <div className="annotate-relation"><span>{annotation.relationship}</span><svg viewBox="0 0 64 20" fill="none" aria-hidden="true"><path d="M2 10h58m-7-7 7 7-7 7" stroke="currentColor" strokeWidth="1.2" /></svg></div>}
        <button type="button" className={`mosaic-result mosaic-tone--${field.id}`}
        data-result={field.id} data-match={active === field.id}
        aria-pressed={selected === field.id} aria-label={`${field.label}: ${field.value}. Show source excerpt.`}
        aria-describedby={`${id}-hint`} {...interaction(field.id)}>
        <span className="mosaic-result-label"><span>{field.label}</span><span className="mosaic-reference" aria-hidden="true">{field.reference} ↗</span></span>
        <span className="mosaic-result-value">{field.value}</span>
      </button></Fragment>)}
    </div>
    <p className="mosaic-hint" id={`${id}-hint`}>{annotating ? annotation.hint : copy.hint}</p>
  </div>;
}
