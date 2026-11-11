import { useEffect, useRef } from "react";
import { useMotionPreference } from "../hooks/useMotionPreference";

/** A quiet pixel trail behind the pointer: the cursor leaves a brief wake of
 * data cells, extending the hero's binary-under-the-pointer motif site-wide.
 * Fine pointers only; nothing renders for touch or reduced motion. Cells are
 * grid-quantised like the hero's reveal field and decay in under half a
 * second, so the page is still the moment the pointer is. */
const CELL = 16;
const LIFE = 640; // ms
const INK = [241, 238, 234] as const; // --ink; the wake should be seen

export function PixelTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useMotionPreference();

  useEffect(() => {
    if (reduced || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    let frame = 0;
    let dpr = 1;
    const cells = new Map<string, { x: number; y: number; born: number }>();

    const size = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(innerWidth * dpr);
      canvas.height = Math.round(innerHeight * dpr);
    };
    const paint = (now: number) => {
      frame = 0;
      context.clearRect(0, 0, canvas.width, canvas.height);
      for (const [key, cell] of cells) {
        const age = (now - cell.born) / LIFE;
        if (age >= 1) { cells.delete(key); continue; }
        const fade = (1 - age) * (1 - age);
        context.fillStyle = `rgb(${INK[0]} ${INK[1]} ${INK[2]} / ${(0.5 * fade).toFixed(3)})`;
        context.fillRect(cell.x * CELL * dpr, cell.y * CELL * dpr, CELL * dpr - 2, CELL * dpr - 2);
      }
      if (cells.size) frame = requestAnimationFrame(paint);
    };
    const start = () => { if (!frame && !document.hidden) frame = requestAnimationFrame(paint); };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const x = Math.floor(event.clientX / CELL);
      const y = Math.floor(event.clientY / CELL);
      cells.set(`${x}:${y}`, { x, y, born: performance.now() });
      if (cells.size > 72) cells.delete(cells.keys().next().value!);
      start();
    };
    const visibility = () => { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; cells.clear(); context.clearRect(0, 0, canvas.width, canvas.height); } };
    size();
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("resize", size);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("resize", size);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [reduced]);

  if (reduced) return null;
  return <canvas ref={canvasRef} className="pixel-trail" aria-hidden="true" />;
}
