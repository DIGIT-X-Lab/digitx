import { useLayoutEffect, useRef, useState } from "react";
import { useMotionPreference } from "../hooks/useMotionPreference";
import { type HoverHighlightTarget } from "./useHoverHighlight";
import "./flowing-menu.css";

// Directional reveal inspired by React Bits Flowing Menu by David Haz.
// Upstream notice: docs/visuals/react-bits-license.txt (MIT + Commons Clause).
type Edge = "top" | "bottom";
type Props = { target: HoverHighlightTarget | null; exitEdge: Edge; inset?: number };
type Reveal = { target: HoverHighlightTarget; active: boolean; entryEdge: Edge; exitEdge: Edge };
const enterDuration = 140;
const exitDuration = 110;

function RevealRow({ reveal, inset, animated, onExit }: { reveal: Reveal; inset: number; animated: boolean; onExit: (id: string) => void }) {
  const start = useRef(reveal.entryEdge === "bottom" ? 100 : -100);
  const band = useRef<HTMLDivElement>(null);
  const onExitRef = useRef(onExit);
  onExitRef.current = onExit;
  const { active, exitEdge, target } = reveal;

  useLayoutEffect(() => {
    const element = band.current;
    if (!element) return;
    const from = getComputedStyle(element).transform;
    const goal = active ? 0 : exitEdge === "bottom" ? 100 : -100;
    const to = `translate3d(0, ${goal}%, 0)`;
    const currentY = new DOMMatrixReadOnly(from).m42;
    const distance = Math.min(1, Math.abs(goal / 100 - currentY / target.height));
    if (!animated || distance < .001) {
      element.style.transform = to;
      if (!active) onExitRef.current(target.id);
      return;
    }
    // Native transform animation remains independent of demo-mount work.
    // On interruption, capture the displayed position before cancelling it.
    const animation = element.animate([{ transform: from }, { transform: to }], {
      duration: (active ? enterDuration : exitDuration) * distance,
      easing: "cubic-bezier(.16, 1, .3, 1)",
      fill: "both",
    });
    let cancelled = false;
    animation.finished.then(() => {
      if (cancelled) return;
      element.style.transform = to;
      animation.cancel();
      if (!active) onExitRef.current(target.id);
    }).catch(() => { /* A new pointer direction cancels the previous animation. */ });
    return () => {
      cancelled = true;
      element.style.transform = getComputedStyle(element).transform;
      animation.cancel();
    };
  }, [active, animated, exitEdge, target.height, target.id]);

  return <div className="flowing-menu-reveal-row" data-reveal-id={target.id} data-active={active}
    style={{ top: target.top + inset, left: target.left, width: target.width + inset * 2, height: target.height }}>
    <div ref={band} className="flowing-menu-band" style={{ transform: `translate3d(0, ${start.current}%, 0)` }} />
  </div>;
}

/** Stationary native content with a composited, directional white surface.
 * Reversals continue at the displayed position, without a JavaScript frame loop. */
export function FlowingMenuHighlight({ target, exitEdge, inset = 0 }: Props) {
  const reduced = useMotionPreference();
  const [reveals, setReveals] = useState<Reveal[]>([]);
  useLayoutEffect(() => {
    setReveals(previous => {
      if (!target && previous.length === 0) return previous;
      const next = previous.map(reveal => reveal.target.id === target?.id
        ? { ...reveal, target, active: true }
        : reveal.active ? { ...reveal, active: false, exitEdge } : reveal);
      if (target && !next.some(reveal => reveal.target.id === target.id)) next.push({ target, active: true, entryEdge: target.edge, exitEdge });
      return next;
    });
  }, [target, exitEdge]);
  return <div className="flowing-menu-clip" aria-hidden="true" style={{ inset: -inset }}>
    {reveals.map(reveal => <RevealRow key={reveal.target.id} reveal={reveal} inset={inset}
      animated={!reduced && (target?.input ?? reveal.target.input) === "pointer"}
      onExit={id => setReveals(current => current.filter(item => item.target.id !== id || item.active))} />)}
  </div>;
}
