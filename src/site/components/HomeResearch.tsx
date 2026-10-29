import { useRef, useState, type KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import { research } from "@/content/research";
import { homeExperience as copy } from "@/content/home";
import { tools, toolsPage } from "@/content/tools";
import { Arrow, ArrowLink } from "./primitives";

export function HomeResearch() {
  const [selected, setSelected] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const change = (event: KeyboardEvent, index: number) => {
    const count = research.areas.length;
    const next = event.key === "ArrowDown" ? (index + 1) % count : event.key === "ArrowUp" ? (index + count - 1) % count : event.key === "Home" ? 0 : event.key === "End" ? count - 1 : null;
    if (next === null) return;
    event.preventDefault(); setSelected(next); buttons.current[next]?.focus();
  };
  return <div className="home-research-browser">
    <div className="home-research-tabs" role="tablist" aria-label={copy.researchLabel} aria-orientation="vertical">
      {research.areas.map((area, i) => <button key={area.id} ref={el => { buttons.current[i] = el; }} type="button" role="tab" id={`home-tab-${area.id}`} aria-controls={`home-panel-${area.id}`} aria-selected={selected === i} tabIndex={selected === i ? 0 : -1} onClick={() => setSelected(i)} onKeyDown={e => change(e, i)}><span>{area.title}</span><Arrow /></button>)}
    </div>
    {research.areas.map((area, i) => {
      const related = tools.filter(tool => tool.areas.includes(area.id)).slice(0, 4);
      return <div key={area.id} id={`home-panel-${area.id}`} role="tabpanel" aria-labelledby={`home-tab-${area.id}`} hidden={selected !== i} tabIndex={0} className="home-research-panel">
      <p>{area.intro[0]}</p>
      <ArrowLink to={`/research#${area.id}`}>{copy.explore}</ArrowLink>
      {related.length > 0 && <div className="home-research-related"><p>{research.related.tools}</p>{related.map(tool => <Link key={tool.slug} to={`/tools/${tool.slug}`}>{tool.name}{tool.status !== "released" && <span className="home-tool-stage">{toolsPage.statusLabel[tool.status]}</span>}<Arrow direction="diagonal" /></Link>)}</div>}
    </div>; })}
  </div>;
}
