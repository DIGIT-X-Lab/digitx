import { useEffect } from "react";

/** Hero tension: the big intro word ends at a precise, fixed gap from the
 * drawn body's edge at the word's own height, fitted per viewport. The
 * tension is a measured near-miss, not an overlap: this wireframe artwork
 * has no solid silhouette, so real occlusion would show type through the
 * mesh, and a half-dissolved letter reads as a defect, not a decision.
 * Body-edge data is a 24-band alpha profile of the artwork; a
 * MutationObserver follows the hero choreography's transforms, which
 * ResizeObserver cannot see. */
const LEFT_EDGE = [0.394, 0.378, 0.381, 0.344, 0.179, 0.167, 0.149, 0.14, 0.094, 0.081, 0.067, 0.044, 0.03, 0.038, 0.084, 0.303, 0.294, 0.278, 0.278, 0.3, 0.322, 0.303, 0.276, 1];
const GAP = 22; // px between the word's end and the body's edge

export function HeroDepthMask() {
  useEffect(() => {
    const focus = document.querySelector<HTMLElement>(".home-intro-question .home-intro-focus");
    const word = document.querySelector<HTMLElement>(".home-intro-question .hero-pressure-text");
    const figure = document.querySelector<HTMLElement>(".home-hero-visual");
    if (!focus || !word || !figure) return;
    let raf = 0;
    let baseline = 0;
    const apply = () => {
      raf = 0;
      const fig = figure.getBoundingClientRect();
      const box = word.getBoundingClientRect();
      if (!fig.width || !fig.height || !box.width) return;
      const midBand = Math.max(0, Math.min(LEFT_EDGE.length - 1,
        Math.round(((box.top + box.bottom) / 2 - fig.top) / fig.height * LEFT_EDGE.length - 0.5)));
      const bodyEdge = fig.left + fig.width * LEFT_EDGE[midBand];
      const current = parseFloat(getComputedStyle(focus).fontSize);
      if (!baseline) baseline = current;
      const target = Math.min(baseline, current * (bodyEdge - GAP - box.left) / box.width);
      if (target > 0 && Math.abs(target - current) > 2) {
        focus.style.setProperty("--hero-focus-fit", `${target.toFixed(2)}px`);
        schedule(); // settle once the new size lands
      }
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(apply); };
    const sizes = new ResizeObserver(schedule);
    sizes.observe(figure);
    sizes.observe(word);
    const moves = new MutationObserver(schedule);
    moves.observe(figure, { attributes: true, attributeFilter: ["style"] });
    window.addEventListener("resize", schedule);
    document.fonts?.ready.then(schedule);
    schedule();
    return () => {
      sizes.disconnect();
      moves.disconnect();
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}
