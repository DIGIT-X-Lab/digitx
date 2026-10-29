import { forwardRef, useEffect, useId, useImperativeHandle, useRef, useState, type PointerEvent } from "react";
import { homeExperience as copy } from "@/content/home";
import "./home-hero-visual.css";

const artwork = "/illustrations/anatomy/front-clean.webp";
const binaryArtwork = "/illustrations/anatomy/front-binary-v2.png";
const width = 630, height = 1480, cellSize = 35, radius = 170;
const columns = Math.ceil(width / cellSize), rows = Math.ceil(height / cellSize);
const cells = Array.from({ length: columns * rows }, (_, index) => ({
  x: (index % columns) * cellSize,
  y: Math.floor(index / columns) * cellSize,
}));

type RevealController = {
  point: (x: number, y: number) => void;
  leave: () => void;
  showFull: (value: boolean) => void;
};

export type HomeHeroVisualHandle = {
  setPulse: (pulseY: number, pulseOpacity: number) => void;
};

export const HomeHeroVisual = forwardRef<HomeHeroVisualHandle, { onUnavailable?: () => void }>(function HomeHeroVisual({ onUnavailable }, ref) {
  const [ready, setReady] = useState(false);
  const [pinned, setPinned] = useState(false);
  const root = useRef<HTMLElement>(null);
  const field = useRef<SVGGElement>(null);
  const fullReveal = useRef<SVGRectElement>(null);
  const narrativePulse = useRef<SVGRectElement>(null);
  const lastPulse = useRef({ y: -420, opacity: 0 });
  const controller = useRef<RevealController | null>(null);
  const id = useId().replace(/:/g, "");

  useImperativeHandle(ref, () => ({
    setPulse(pulseY, pulseOpacity) {
      const last = lastPulse.current;
      if (pulseOpacity > 0 && last.y !== pulseY) narrativePulse.current?.setAttribute("y", String(pulseY));
      if (last.opacity !== pulseOpacity) narrativePulse.current?.setAttribute("opacity", String(pulseOpacity));
      lastPulse.current = { y: pulseY, opacity: pulseOpacity };
    },
  }), []);

  useEffect(() => {
    if (!ready) return;
    const elements = Array.from(field.current!.children) as SVGRectElement[];
    const values = new Float32Array(cells.length);
    const targets = new Float32Array(cells.length);
    const releaseAt = new Float64Array(cells.length);
    const active = new Set<number>();
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = preference.matches, visible = false;
    let frame = 0, previous = 0, full = 0, fullTarget = 0;

    const stop = () => { cancelAnimationFrame(frame); frame = 0; previous = 0; };
    const clearPatches = () => {
      for (const index of active) elements[index].setAttribute("opacity", "0");
      active.clear();
      values.fill(0);
      targets.fill(0);
      releaseAt.fill(0);
    };
    const paintFull = () => fullReveal.current?.setAttribute("opacity", String(full));

    // Only changing cells are painted. A stationary pointer and an idle figure
    // have no running animation loop; the binary overlay uses this one field.
    const tick = (now: number) => {
      frame = 0;
      const delta = previous ? Math.min(now - previous, 48) : 16;
      previous = now;
      let changing = false;
      for (const index of active) {
        const holding = targets[index] === 0 && now < releaseAt[index];
        const target = holding ? values[index] : targets[index];
        const rate = target > values[index] ? 55 : 175;
        const next = values[index] + (target - values[index]) * (1 - Math.exp(-delta / rate));
        values[index] = Math.abs(next - target) < .003 ? target : next;
        elements[index].setAttribute("opacity", values[index].toFixed(3));
        if (holding || values[index] !== target) changing = true;
        if (values[index] === 0 && targets[index] === 0) active.delete(index);
      }
      full += (fullTarget - full) * (1 - Math.exp(-delta / 85));
      if (Math.abs(fullTarget - full) < .003) full = fullTarget;
      else changing = true;
      paintFull();
      if (changing) frame = requestAnimationFrame(tick);
      else previous = 0;
    };
    const start = () => {
      if (!frame && visible && !document.hidden && !reduced) frame = requestAnimationFrame(tick);
    };
    const leave = () => {
      const now = performance.now();
      for (const index of active) {
        if (targets[index] > 0) releaseAt[index] = now + 120;
        targets[index] = 0;
      }
      start();
    };

    controller.current = {
      point(x, y) {
        if (reduced || !visible || document.hidden || fullTarget === 1) return;
        leave();
        const firstColumn = Math.max(0, Math.floor((x - radius) / cellSize));
        const lastColumn = Math.min(columns - 1, Math.floor((x + radius) / cellSize));
        const firstRow = Math.max(0, Math.floor((y - radius) / cellSize));
        const lastRow = Math.min(rows - 1, Math.floor((y + radius) / cellSize));
        for (let row = firstRow; row <= lastRow; row++) {
          for (let column = firstColumn; column <= lastColumn; column++) {
            const index = row * columns + column;
            const cell = cells[index];
            const distance = Math.hypot(cell.x + cellSize / 2 - x, cell.y + cellSize / 2 - y);
            const falloff = Math.max(0, Math.min(1, (radius - distance) / (radius * .55)));
            const strength = falloff * falloff * (3 - 2 * falloff);
            if (strength < .01) continue;
            targets[index] = strength;
            active.add(index);
          }
        }
        start();
      },
      leave,
      showFull(value) {
        clearPatches();
        fullTarget = value ? 1 : 0;
        if (reduced || !visible || document.hidden) { full = fullTarget; paintFull(); }
        else start();
      },
    };

    const suspend = () => {
      stop();
      clearPatches();
      full = fullTarget;
      paintFull();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) suspend();
    });
    observer.observe(root.current!);
    const visibility = () => { if (document.hidden) suspend(); };
    const motionPreference = () => { reduced = preference.matches; if (reduced) suspend(); };
    document.addEventListener("visibilitychange", visibility);
    preference.addEventListener("change", motionPreference);
    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      preference.removeEventListener("change", motionPreference);
      controller.current = null;
    };
  }, [ready]);

  useEffect(() => { controller.current?.showFull(pinned); }, [pinned, ready]);

  const inspect = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === "touch" || root.current?.inert) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    controller.current?.point((event.clientX - bounds.left) * width / bounds.width, (event.clientY - bounds.top) * height / bounds.height);
  };

  return <figure ref={root} className="home-hero-visual" data-ready={ready}>
    <button type="button" className="hero-body-stage" disabled={!ready}
      aria-label={copy.heroVisual.revealLabel} aria-pressed={pinned} aria-describedby={`${id}-instructions`}
      onPointerEnter={inspect} onPointerMove={inspect}
      onPointerLeave={() => controller.current?.leave()} onPointerCancel={() => controller.current?.leave()}
      onClick={() => setPinned(value => !value)}>
      <svg className="hero-body-art" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={copy.heroVisual.description}>
        <defs>
          <linearGradient id={`${id}-pulse`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="white" stopOpacity="0" />
            <stop offset=".25" stopColor="white" stopOpacity=".45" />
            <stop offset=".5" stopColor="white" />
            <stop offset=".75" stopColor="white" stopOpacity=".45" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id={`${id}-binary`} maskUnits="userSpaceOnUse" x="0" y="0" width={width} height={height} style={{ maskType: "alpha" }}>
            <rect ref={narrativePulse} data-hero-pulse="" y="-420" width={width} height="420" fill={`url(#${id}-pulse)`} opacity="0" />
            <rect ref={fullReveal} data-hero-full="" width={width} height={height} fill="white" opacity="0" />
            <g ref={field} data-hero-patches="" fill="white">{cells.map((cell, index) => <rect key={index} x={cell.x} y={cell.y} width={cellSize} height={cellSize} opacity="0" />)}</g>
          </mask>
        </defs>
        <image href={artwork} x="-200" y="-8" width="1024" height="1536" onError={onUnavailable} />
        <image href={binaryArtwork} x="-200" y="-8" width="1024" height="1536" visibility={ready ? "visible" : "hidden"} mask={`url(#${id}-binary)`} onLoad={() => setReady(true)} onError={() => { setReady(false); onUnavailable?.(); }} />
      </svg>
    </button>
    <span id={`${id}-instructions`} className="sr-only">{copy.heroVisual.instructions}</span>
  </figure>;
});
