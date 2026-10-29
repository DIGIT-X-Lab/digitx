import { useEffect, useState, type RefObject } from "react";

export type HoverHighlightTarget = { id: string; top: number; left: number; width: number; height: number; edge: "top" | "bottom"; input: "pointer" | "keyboard" };
type HighlightState = { target: HoverHighlightTarget | null; exitEdge: "top" | "bottom" };

/** The hover treatment is transient presentation, independent of the selected demo.
 * Hit-testing on scroll also handles rows passing under a stationary pointer. */
export function useHoverHighlight(ref: RefObject<HTMLDivElement>, onHover?: (id: string | null) => void, resetKey?: string) {
  const [highlight, setHighlight] = useState<HighlightState>({ target: null, exitEdge: "top" });
  useEffect(() => {
    const index = ref.current;
    if (!index) return;
    const finePointer = matchMedia("(any-hover: hover) and (any-pointer: fine)");
    let current: HTMLElement | null = null;
    let point: { x: number; y: number } | null = null;
    let scrollFrame = 0;
    let input: "pointer" | "keyboard" = "pointer";
    let exitEdge: "top" | "bottom" = "top";

    const rowAt = (target: EventTarget | null) => {
      const row = target instanceof Element && !target.closest("[data-hover-ignore]") ? target.closest<HTMLElement>("[data-hover-item]") : null;
      return row && index.contains(row) ? row : null;
    };
    const measure = (row: HTMLElement) => {
      const target = row.querySelector<HTMLElement>("[data-hover-target]");
      const summary = target ? null : row.querySelector<HTMLElement>("[data-hover-summary]");
      const rowBox = (target ?? row).getBoundingClientRect();
      const height = summary ? summary.getBoundingClientRect().bottom - rowBox.top + parseFloat(getComputedStyle(row).paddingBottom) : rowBox.height;
      return { rowBox, height };
    };
    const light = (row: HTMLElement | null) => {
      if (current && current !== row) {
        const { rowBox, height } = measure(current);
        exitEdge = point && point.y > rowBox.top + height / 2 ? "bottom" : "top";
      }
      current = row;
      if (!row) { setHighlight(previous => previous.target ? { target: null, exitEdge } : previous); return; }
      const { rowBox, height } = measure(row);
      const indexBox = index.getBoundingClientRect();
      const top = rowBox.top - indexBox.top;
      const left = rowBox.left - indexBox.left;
      const width = rowBox.width;
      const id = row.dataset.hoverItem!;
      const edge = point && point.y > rowBox.top + height / 2 ? "bottom" : "top";
      setHighlight(previous => previous.target?.id === id && previous.target.top === top && previous.target.left === left && previous.target.width === width && previous.target.height === height && previous.target.input === input ? previous : { target: { id, top, left, width, height, edge, input }, exitEdge });
    };
    const track = (row: HTMLElement | null, measure = false) => {
      const changed = row !== current;
      if (!changed && !measure) return;
      light(row);
      if (changed) onHover?.(row?.dataset.hoverItem ?? null);
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !finePointer.matches) return;
      const changedInput = input !== "pointer";
      input = "pointer";
      point = { x: event.clientX, y: event.clientY };
      track(rowAt(event.target), changedInput);
    };
    const scroll = () => {
      if (scrollFrame) return;
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = 0;
        if (point) track(rowAt(document.elementFromPoint(point.x, point.y)), true);
        else if (current) light(current);
      });
    };
    const focus = (event: FocusEvent) => {
      if (!(event.target instanceof Element) || !event.target.matches(":focus-visible")) return;
      point = null;
      input = "keyboard";
      onHover?.(null);
      light(rowAt(event.target));
    };
    const blur = (event: FocusEvent) => {
      if (!point && rowAt(event.target) !== rowAt(event.relatedTarget)) light(null);
    };
    const leave = (event: PointerEvent) => {
      if (event.relatedTarget !== null) return;
      point = null;
      track(null);
    };
    const clear = () => {
      point = null;
      current = null;
      cancelAnimationFrame(scrollFrame);
      scrollFrame = 0;
      setHighlight(previous => previous.target ? { target: null, exitEdge } : previous);
      onHover?.(null);
    };
    const preference = () => { if (!finePointer.matches) clear(); };
    const visibility = () => { if (document.hidden) clear(); };
    const resize = new ResizeObserver(scroll);
    resize.observe(index);

    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerout", leave);
    document.addEventListener("focusin", focus);
    document.addEventListener("focusout", blur);
    document.addEventListener("scroll", scroll, { passive: true, capture: true });
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("resize", scroll, { passive: true });
    window.addEventListener("blur", clear);
    finePointer.addEventListener("change", preference);
    // Profile return can restore focus before this effect attaches its listeners.
    const focused = document.activeElement;
    if (focused && index.contains(focused) && focused.matches(":focus-visible")) {
      input = "keyboard";
      light(rowAt(focused));
    }
    return () => {
      resize.disconnect();
      clear();
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerout", leave);
      document.removeEventListener("focusin", focus);
      document.removeEventListener("focusout", blur);
      document.removeEventListener("scroll", scroll, true);
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("resize", scroll);
      window.removeEventListener("blur", clear);
      finePointer.removeEventListener("change", preference);
    };
  }, [ref, onHover, resetKey]);
  return highlight;
}
