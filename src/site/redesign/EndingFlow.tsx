import { useEffect, useRef } from "react";
import "./ending-flow.css";

/** Ending field study: a quiver of measurement ticks, sampled on a loose
 * grid, each following a slow shared current as two poles drift through
 * the field. Signals gradually falling into alignment. Continuously alive
 * while visible; a single still frame under reduced motion. Decorative. */

const W = 520;
const H = 480;
const GAP = 20;
const MARGIN = 16;

type Pole = { cx: number; cy: number; orbit: number; speed: number; strength: number };
const POLES: Pole[] = [
  { cx: 350, cy: 160, orbit: 64, speed: 1 / 7, strength: 95 },
  { cx: 180, cy: 330, orbit: 74, speed: -1 / 9.5, strength: -85 },
];

function sample(x: number, y: number, t: number): [number, number] {
  const drift = 0.4 * Math.sin((t * Math.PI * 2) / 9);
  let vx = -Math.cos(drift);
  let vy = -Math.sin(drift);
  for (const pole of POLES) {
    const px = pole.cx + Math.cos(t * Math.PI * 2 * pole.speed) * pole.orbit;
    const py = pole.cy + Math.sin(t * Math.PI * 2 * pole.speed) * pole.orbit;
    const dx = x - px;
    const dy = y - py;
    const r2 = dx * dx + dy * dy + 2200;
    vx += (-dy * pole.strength) / r2;
    vy += (dx * pole.strength) / r2;
  }
  return [vx, vy];
}

/* Deterministic per-cell jitter, so the lattice reads as sampled
   measurements rather than a decorative grid. */
const jitter = (seed: number) => (((seed * 9301 + 49297) % 233280) / 233280 - 0.5) * 9;

const fade = (v: number, limit: number) => Math.min(1, Math.min(v, limit - v) / 70);

export function EndingFlow() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const context = element.getContext("2d");
    if (!context) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    element.width = W * dpr;
    element.height = H * dpr;
    context.scale(dpr, dpr);
    const ink = getComputedStyle(element).color;
    const draw = (t: number) => {
      context.clearRect(0, 0, W, H);
      context.strokeStyle = ink;
      context.lineWidth = 1;
      let cell = 0;
      for (let gx = MARGIN; gx <= W - MARGIN; gx += GAP) {
        for (let gy = MARGIN; gy <= H - MARGIN; gy += GAP) {
          cell += 1;
          const x = gx + jitter(cell);
          const y = gy + jitter(cell * 7 + 3);
          const [vx, vy] = sample(x, y, t);
          const magnitude = Math.hypot(vx, vy);
          /* A shimmer travels across the field so the motion reads at a glance. */
          const breathe = 0.78 + 0.35 * Math.sin(t * 2.2 + (x + y) * 0.018);
          const length = (3.5 + Math.min(7, magnitude * 6)) * breathe;
          const ux = vx / (magnitude || 1);
          const uy = vy / (magnitude || 1);
          context.globalAlpha = 0.32 * fade(x, W) * fade(y, H);
          context.beginPath();
          context.moveTo(x - (ux * length) / 2, y - (uy * length) / 2);
          context.lineTo(x + (ux * length) / 2, y + (uy * length) / 2);
          context.stroke();
        }
      }
      context.globalAlpha = 1;
    };
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      draw(4);
      return;
    }
    let frame = 0;
    let running = false;
    const loop = () => {
      draw(performance.now() / 1000);
      frame = requestAnimationFrame(loop);
    };
    const observer = new IntersectionObserver(entries => {
      const visible = entries.some(entry => entry.isIntersecting);
      if (visible && !running) { running = true; loop(); }
      else if (!visible && running) { running = false; cancelAnimationFrame(frame); }
    }, { threshold: 0.05 });
    observer.observe(element);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, []);
  return <canvas ref={canvas} className="ep-flow" width={W} height={H} aria-hidden="true" />;
}
