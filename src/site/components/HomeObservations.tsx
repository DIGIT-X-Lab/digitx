import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { computability, observationExamples as copy } from "@/content/home";
import { TextToField } from "../visuals/TextToField";
import "./observation-examples.css";

/** One example at a time, reusing the film's fictional anatomy and measurements. */
export function HomeObservations({ presentation = "full" }: { presentation?: "full" | "pillar" }) {
  const compact = presentation === "pillar";
  const [tab, setTab] = useState(0);
  const [tissue, setTissue] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const active = copy.tissues[tissue];
  const onKeyDown = (event: KeyboardEvent) => {
    const next = event.key === "Home" ? 0 : event.key === "End" ? 1 : ["ArrowLeft", "ArrowRight"].includes(event.key) ? 1 - tab : null;
    if (next === null) return;
    event.preventDefault(); setTab(next); tabs.current[next]?.focus();
  };

  return <div className={`home-observations${compact ? " home-observations--pillar" : ""}`}>
    <div className="home-observation-tabs" role="tablist" aria-label={copy.label}>
      {copy.tabs.map((label, index) => <button key={label} ref={el => { tabs.current[index] = el; }} type="button" role="tab" id={`observation-tab-${index}`} aria-controls={`observation-panel-${index}`} aria-selected={tab === index} tabIndex={tab === index ? 0 : -1} onClick={() => setTab(index)} onKeyDown={onKeyDown}>{label}</button>)}
    </div>
    <div className="home-observation-panels">
    <div className="home-observation-panel" id="observation-panel-0" role="tabpanel" aria-labelledby="observation-tab-0" hidden={!compact && tab !== 0} aria-hidden={tab !== 0} tabIndex={tab === 0 ? 0 : -1}>
      <div className="home-image-example" style={{ "--measurement-colour": active.colour } as CSSProperties}>
        <figure className="home-measurement-anatomy" aria-label={`Illustrative human anatomy with ${active.label.toLowerCase()} highlighted`}>
          <img className={`home-anatomy-base${active.overlay !== "tumour" ? " is-hidden" : ""}`} src="/illustrations/anatomy/front-clean.webp" width="1024" height="1536" alt="" loading="lazy" />
          {copy.tissues.map((item, index) => <img key={item.overlay} className={`home-tissue-overlay${index === tissue ? " is-selected" : ""}`} src={`/illustrations/anatomy/${item.overlay === "tumour" ? "tumour-overlay" : item.overlay}.webp`} width="1024" height="1536" alt="" loading="lazy" />)}
        </figure>
        <div className="home-measurement-readout">
          {!compact && <p className="home-measurement-intro">{copy.measurementIntro}</p>}
          <div aria-live="polite" aria-atomic="true"><h3>{active.title}</h3><p className="home-measurement-value">{active.value} <span>{active.unit}</span></p><p className="home-measurement-explanation">{active.explanation}</p></div>
          <div className="home-tissue-options" role="group" aria-label={copy.tissueLabel}>{copy.tissues.map((item, index) => <button key={item.label} type="button" aria-pressed={tissue === index} onClick={() => setTissue(index)}>{item.label}</button>)}</div>
          {!compact && <details className="home-measurement-calculation"><summary>{copy.calculation}</summary><p>{active.formula}</p><p>{copy.calculationNote}</p></details>}
        </div>
      </div>
      <div className="home-observation-caption">{!compact && <p>{computability.image.caption}</p>}<span>{copy.imageProvenance}</span></div>
    </div>
    <div className="home-observation-panel" id="observation-panel-1" role="tabpanel" aria-labelledby="observation-tab-1" hidden={!compact && tab !== 1} aria-hidden={tab !== 1} tabIndex={tab === 1 ? 0 : -1}>
      <TextToField compact={compact} />
      <div className="home-observation-caption">{!compact && <p>{computability.text.caption}</p>}<span>{copy.textProvenance}</span></div>
    </div>
    </div>
  </div>;
}
