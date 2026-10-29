import { useLayoutEffect, useState, type RefObject } from "react";
import type { Publication } from "@/data/publications";
import type { PublicationLayout } from "./publication-archive";

type Geometry = { layout: PublicationLayout; resultsHeight: number };

/** Measure the same rows at the same width, independently of the current page. */
export function usePublicationLayout(rootRef: RefObject<HTMLDivElement>, measureRef: RefObject<HTMLDivElement>, papers: Publication[]) {
  const [geometry, setGeometry] = useState<Geometry>();
  useLayoutEffect(() => {
    const root = rootRef.current;
    const measure = measureRef.current;
    if (!root || !measure) return;
    const opening = root.querySelector<HTMLElement>(".publications-opening")!;
    const controls = root.querySelector<HTMLElement>(".publication-controls")!;
    const index = root.querySelector<HTMLElement>(".publication-index")!;
    const viewport = root.querySelector<HTMLElement>(".publication-viewport-size")!;
    const header = document.querySelector<HTMLElement>(".site-header .header-inner");
    let frame = 0;
    let disposed = false;
    measure.setAttribute("inert", "");
    const height = (element: Element | null) => element?.getBoundingClientRect().height ?? 0;
    const update = () => {
      if (disposed) return;
      const controlStyle = getComputedStyle(controls);
      const columnsHeight = height(measure.querySelector(".publication-column-headings"));
      const rowHeights = Object.fromEntries(Array.from(measure.querySelectorAll<HTMLElement>(".publication-row")).map(row => [row.dataset.paperId!, height(row)]));
      const yearHeadingHeight = height(measure.querySelector(".publication-year-heading"));
      const yearGap = parseFloat(getComputedStyle(index).getPropertyValue("--publication-year-gap")) || 0;
      const headerHeight = height(header) + (header?.parentElement ? parseFloat(getComputedStyle(header.parentElement).borderBottomWidth) || 0 : 0);
      // Small viewport units stay stable as mobile browser chrome opens/closes.
      // Never derive page capacity from scroll position or an on-screen keyboard.
      const availableHeight = Math.max(0, Math.floor(height(viewport) - headerHeight
        - height(opening) - height(controls) - parseFloat(controlStyle.marginBottom)
        - columnsHeight - height(measure.querySelector(".publication-pagination"))
        - parseFloat(getComputedStyle(index).paddingBottom) - 2));
      const next = { layout: { availableHeight, yearHeadingHeight, yearGap, rowHeights }, resultsHeight: availableHeight + columnsHeight };
      setGeometry(previous => JSON.stringify(previous) === JSON.stringify(next) ? previous : next);
    };
    const schedule = () => { if (!disposed) { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); } };
    const observer = new ResizeObserver(schedule);
    [measure, viewport, opening, controls, ...measure.querySelectorAll(".publication-row"), ...(header ? [header] : [])].forEach(element => observer.observe(element));
    document.fonts.ready.then(schedule);
    document.fonts.addEventListener("loadingdone", schedule);
    update();
    return () => { disposed = true; cancelAnimationFrame(frame); observer.disconnect(); document.fonts.removeEventListener("loadingdone", schedule); };
  }, [rootRef, measureRef, papers]);
  return geometry;
}
