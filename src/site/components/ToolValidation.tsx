import { useId, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useInView, useIsPresent } from "framer-motion";
import { type Tool, toolsPage } from "@/content/tools";
import { toolValidation as copy, toolTeasers, validationContactHref } from "@/content/tool-validation";
import { Arrow } from "./primitives";
import { useMotionPreference } from "../hooks/useMotionPreference";
import { MakingHeading } from "./MakingHeading";
import { ToolTeaserVisual } from "./ToolTeaserVisual";
import { PillarDisclosure } from "./PillarDisclosure";
import { FlowingMenuHighlight } from "./FlowingMenuHighlight";
import { useHoverHighlight } from "./useHoverHighlight";
import "./tool-validation.css";

/* THESIS: reveal the research opportunity through a small, tangible visual study.
 * OWN-WORLD: CHILI anatomy, ivory documents, blue and coral, shared typography.
 * STORY: choose a tool, explore its idea, recognise a shared question, get in touch.
 * FIRST VIEWPORT: three equal selectors above one coherent text/art composition.
 * FORM: an interactive research exhibit within the existing Tools surface.
 * No project timeline, numerical progress, private results or placeholder partners. */
export function ValidationInvite({ name }: { name: string }) {
  return <a className="tool-validation-invite" href={validationContactHref(name)} aria-label={`${copy.action} Email DIGITX about ${name}.`}>
    <span>{copy.action}</span><Arrow />
  </a>;
}

function ToolDrawer({ tool, index, id }: { tool: Tool; index: number; id: string }) {
  const present = useIsPresent();
  const reduced = useMotionPreference();
  const panel = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => { if (panel.current) panel.current.inert = !present; }, [present]);
  return <motion.div ref={panel} id={`${id}-${tool.slug}-panel`} role="region" aria-labelledby={`${id}-${tool.slug}-trigger`} aria-hidden={!present}
    className="tool-validation-panel" style={{ "--tool-drawer-row": index * 2 + 2 } as CSSProperties}
    initial={{ height: reduced ? "auto" : 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
    transition={{ duration: reduced ? 0 : present ? .42 : .24, ease: [.16, 1, .3, 1] }}>
    <div className="tool-validation-exhibit">
      <div className="tool-validation-story">
        <h4>{toolTeasers[tool.slug].headline}</h4>
        <p className="tool-validation-summary">{toolTeasers[tool.slug].summary}</p>
        <div className="tool-validation-conversation"><p>{toolTeasers[tool.slug].invitation}</p><ValidationInvite name={tool.name} /></div>
      </div>
      <ToolTeaserVisual slug={tool.slug} />
    </div>
  </motion.div>;
}

export function ToolValidation({ tools }: { tools: Tool[] }) {
  const id = useId();
  const [selected, setSelected] = useState<string | null>(null);
  const grid = useRef<HTMLDivElement>(null);
  const triggers = useRef<Record<string, HTMLButtonElement | null>>({});
  const visible = useInView(grid, { once: true, amount: .15 });
  const [cueComplete, setCueComplete] = useState(false);
  const { target: highlight, exitEdge } = useHoverHighlight(grid, undefined, tools.map(tool => tool.slug).join(","));
  const active = tools.find(tool => tool.slug === selected);
  if (!tools.length) return null;

  const close = () => {
    if (!active) return;
    const button = triggers.current[active.slug];
    button?.focus({ preventScroll: true });
    const header = document.querySelector(".header-inner")?.getBoundingClientRect().height ?? 88;
    if (button && button.getBoundingClientRect().top < header) button.scrollIntoView({ block: "start", behavior: "instant" });
    setSelected(null);
  };

  const navigate = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const next = event.key === "ArrowRight" || event.key === "ArrowDown" ? (index + 1) % tools.length
      : event.key === "ArrowLeft" || event.key === "ArrowUp" ? (index + tools.length - 1) % tools.length
      : event.key === "Home" ? 0 : event.key === "End" ? tools.length - 1 : undefined;
    if (next === undefined) return;
    event.preventDefault();
    triggers.current[tools[next].slug]?.focus();
  };

  return <section id="tools-collaborate" className="tool-validation" aria-labelledby={`${id}-title`}
    onKeyDown={event => { if (event.key === "Escape" && active) { event.preventDefault(); close(); } }}>
    <header className="tool-validation-intro">
      <MakingHeading id={`${id}-title`} /><p>{copy.intro}</p>
    </header>
    <div className="tool-validation-selector pillar-disclosure-grid flowing-menu-host" ref={grid} role="group" aria-label={copy.selectorLabel} data-cue={visible && !cueComplete}
      onAnimationEnd={event => { if (event.animationName === "pillar-disclosure-cue") setCueComplete(true); }}>
      <FlowingMenuHighlight target={highlight} exitEdge={exitEdge} inset={12} />
      {tools.map((tool, index) => <h4 key={tool.slug} className="tool-validation-toggle pillar-disclosure-toggle" style={{ "--tool-column": index + 1, "--tool-row": index * 2 + 1 } as CSSProperties}>
        <PillarDisclosure id={`${id}-${tool.slug}-trigger`} data-hover-item={tool.slug} title={tool.name} identity={tool.slug}
          meta={<><span className="tool-validation-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{tool.data.map(kind => toolsPage.dataLabels[kind]).join(" / ")}</>}
          ref={element => { triggers.current[tool.slug] = element; }} aria-expanded={active?.slug === tool.slug} aria-controls={`${id}-${tool.slug}-panel`}
          onClick={() => active?.slug === tool.slug ? close() : setSelected(tool.slug)} onKeyDown={event => navigate(event, index)} />
      </h4>)}
      <AnimatePresence initial={false} mode="wait">
        {active && <ToolDrawer key={active.slug} tool={active} index={tools.indexOf(active)} id={id} />}
      </AnimatePresence>
    </div>
  </section>;
}
