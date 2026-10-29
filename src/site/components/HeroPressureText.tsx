import { useEffect, useRef } from "react";

/** React Bits Text Pressure, adapted to Inter's weight axis and stable glyph slots.
 * https://reactbits.dev/text-animations/text-pressure
 * Real and automatic pointers share the same rendering; idle/offscreen work stops.
 */
export function HeroPressureText({ text, outline = false, autoShine = false }: { text: string; outline?: boolean; autoShine?: boolean }) {
  const root = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const element = root.current!;
    const glyphs = Array.from(element.querySelectorAll<HTMLElement>(".hero-pressure-ink"));
    const sequence = element.closest<HTMLElement>(".home-hero-sequence");
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    let frame = 0, timer = 0, visible = false;
    let point: { x: number; y: number } | null = null;
    const automaticAllowed = () => autoShine && outline && visible && !document.hidden
      && !motion.matches && fine.matches && (!sequence || sequence.dataset.revealed === "true");
    const markShining = (value: boolean) => {
      if (autoShine && element.dataset.shining !== String(value)) element.dataset.shining = String(value);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      frame = timer = 0;
      markShining(false);
    };
    const clearGlyphs = () => {
      for (const glyph of glyphs) {
        glyph.style.fontVariationSettings = "";
        glyph.style.webkitTextFillColor = "";
      }
    };
    const paint = (cursor: { x: number; y: number }) => {
      // Both input paths use the original hover calculation and stable glyph slots.
      // Read every position before writing so pressure cannot trigger layout reflow.
      const boxes = glyphs.map(glyph => glyph.getBoundingClientRect());
      const radius = Math.max(72, parseFloat(getComputedStyle(element).fontSize) * 1.5);
      boxes.forEach((box, index) => {
        const distance = Math.hypot(cursor.x - box.left - box.width / 2, cursor.y - box.top - box.height / 2);
        const t = Math.max(0, 1 - distance / radius);
        const pressure = t * t * (3 - 2 * t);
        const weight = `"wght" ${Math.round((outline ? 400 : 520) + pressure * (outline ? 220 : 120))}`;
        const fill = `rgb(241 238 234 / ${Math.min(1, pressure * 1.6)})`;
        if (glyphs[index].style.fontVariationSettings !== weight) glyphs[index].style.fontVariationSettings = weight;
        if (outline) glyphs[index].style.webkitTextFillColor = fill;
      });
    };
    const schedule = (delay = 700) => {
      if (!automaticAllowed() || point || frame || timer) return;
      timer = window.setTimeout(() => {
        timer = 0;
        if (!automaticAllowed() || point) return;
        const started = performance.now();
        markShining(true);
        const sweep = (now: number) => {
          frame = 0;
          if (!automaticAllowed() || point) return;
          const progress = Math.min(1, (now - started) / 2600);
          const bounds = element.getBoundingClientRect();
          const radius = Math.max(72, parseFloat(getComputedStyle(element).fontSize) * 1.5);
          paint({ x: bounds.left - radius + (bounds.width + radius * 2) * progress, y: bounds.top + bounds.height / 2 });
          if (progress < 1) frame = requestAnimationFrame(sweep);
          else {
            markShining(false);
            clearGlyphs();
            schedule(3800);
          }
        };
        frame = requestAnimationFrame(sweep);
      }, delay);
    };
    const reset = () => {
      stop();
      point = null;
      clearGlyphs();
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch" || motion.matches || !fine.matches) return;
      stop();
      point = { x: event.clientX, y: event.clientY };
      frame = requestAnimationFrame(() => { frame = 0; if (point) paint(point); });
    };
    const leave = () => { reset(); schedule(1400); };
    const sync = () => {
      if (document.hidden || motion.matches || !fine.matches || (autoShine && !visible)) reset();
      else schedule();
    };
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= .25;
      sync();
    }, { threshold: .25 });
    const reveal = new MutationObserver(sync);
    if (autoShine) {
      intersection.observe(element);
      if (sequence) reveal.observe(sequence, { attributes: true, attributeFilter: ["data-revealed"] });
    }
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerleave", leave);
    element.addEventListener("pointercancel", leave);
    document.addEventListener("visibilitychange", sync);
    motion.addEventListener("change", sync);
    fine.addEventListener("change", sync);
    markShining(false);
    return () => {
      reset();
      intersection.disconnect();
      reveal.disconnect();
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerleave", leave);
      element.removeEventListener("pointercancel", leave);
      document.removeEventListener("visibilitychange", sync);
      motion.removeEventListener("change", sync);
      fine.removeEventListener("change", sync);
      delete element.dataset.shining;
    };
  }, [text, outline, autoShine]);
  return <span ref={root} className={`hero-pressure-text${outline ? " hero-pressure-text--outline" : ""}`}>
    <span className="sr-only">{text}</span>
    <span aria-hidden="true">{text.split(" ").map((word, wordIndex) => <span key={wordIndex}>{wordIndex > 0 && " "}<span className="hero-pressure-word">{Array.from(word).map((letter, index) => <span className="hero-pressure-slot" key={index}><span className="hero-pressure-reserve">{letter}</span><span className="hero-pressure-ink">{letter}</span></span>)}</span></span>)}</span>
  </span>;
}
