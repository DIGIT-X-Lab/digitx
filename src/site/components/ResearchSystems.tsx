import { useEffect, useRef, useState } from "react";
import { MODE_FRAMES, paintFrame, resolvePreset } from "thinking-orbs/engine";
import { research, researchExperience } from "@/content/research";
import "./research-pillar-layout.css";
import "./research-systems.css";

const preset = resolvePreset("composing", 64);
const copy = researchExperience.systems;

/** Existing Thinking Orbs geometry, drawn at the displayed resolution. */
function ResearchSystemIllustration() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const elapsed = useRef(6);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [reduced, setReduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(preference.matches);
    preference.addEventListener("change", update);
    update();
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext("2d");
    if (!element || !context) return;
    let inView = false;
    let frame = 0;
    let last = 0;
    let painted = 0;
    const draw = () => {
      const scale = element.width / 64;
      context.setTransform(scale, 0, 0, scale, 0, 0);
      context.clearRect(0, 0, 64, 64);
      paintFrame(context, MODE_FRAMES[preset.mode](64, elapsed.current * preset.speed * .3, preset.opts), true, { r: 225, g: 218, b: 202 });
    };
    const tick = (time: number) => {
      if (last) elapsed.current += Math.min(time - last, 64) / 1000;
      last = time;
      if (time - painted >= 1000 / 30) { draw(); painted = time; }
      frame = requestAnimationFrame(tick);
    };
    const update = () => {
      cancelAnimationFrame(frame);
      last = 0;
      const running = inView && !document.hidden && !paused && !hovered && !reduced;
      element.dataset.motion = running ? "running" : "paused";
      draw();
      if (running) frame = requestAnimationFrame(tick);
    };
    const resize = () => {
      const size = Math.round(element.getBoundingClientRect().width * Math.min(devicePixelRatio || 1, 2));
      element.width = size;
      element.height = size;
      draw();
    };
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; update(); });
    const dimensions = new ResizeObserver(resize);
    dimensions.observe(element);
    observer.observe(element);
    document.addEventListener("visibilitychange", update);
    resize();
    update();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      dimensions.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, [paused, hovered, reduced]);

  return <figure className="systems-illustration" aria-label={copy.visual}>
    <div className="systems-constellation">
      <div className="systems-orbit">
        <svg className="systems-connections" viewBox="0 0 420 420" fill="none" aria-hidden="true">
          <circle className="systems-orbit-path" cx="210" cy="210" r="160" />
          <circle className="systems-orbit-node" cx="210" cy="50" r="4" />
          <circle className="systems-orbit-node" cx="50" cy="210" r="4" />
          <circle className="systems-orbit-node" cx="370" cy="210" r="4" />
        </svg>
        <button type="button" className="systems-orb-control" disabled={reduced} aria-label={paused ? copy.resume : copy.pause} aria-pressed={paused} onClick={() => setPaused(value => !value)} onPointerEnter={() => setHovered(true)} onPointerLeave={() => setHovered(false)}>
          <canvas ref={canvas} className="systems-orb" aria-hidden="true" />
        </button>
      </div>
      <span className="systems-label systems-label--question">{copy.question}</span>
      <span className="systems-label systems-label--data">{copy.data}</span>
      <span className="systems-label systems-label--tools">{copy.tools}</span>
    </div>
  </figure>;
}

export function ResearchSystems() {
  const area = research.areas.find(item => item.id === "systems")!;
  return <div className="research-systems research-pillar-layout">
    <div className="systems-summary research-pillar-summary">
      {area.intro.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
    </div>
    <ResearchSystemIllustration />
  </div>;
}
