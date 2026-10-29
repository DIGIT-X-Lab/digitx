import { useEffect, useRef, useState } from "react";
import { useMotionPreference } from "./useMotionPreference";

/** One finite clock for every preview. It stops offscreen, in background tabs and
 * at the result; step selection pauses it. There is no simulated live inference. */
export function usePreview(duration: number, paintInterval = 40) {
  const reduced = useMotionPreference();
  const element = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState(() => reduced ? duration : 0);
  const [paused, setPaused] = useState(false);
  const [replay, setReplay] = useState(0);
  const elapsed = useRef(time);
  const previousReduced = useRef(reduced);
  useEffect(() => {
    if (reduced && !previousReduced.current) { elapsed.current = duration; setTime(duration); }
    previousReduced.current = reduced;
  }, [reduced, duration]);
  useEffect(() => {
    let visible = false, frame = 0, last = 0, painted = 0;
    const tick = (now: number) => {
      if (last) elapsed.current = Math.min(duration, elapsed.current + Math.min(now - last, 80));
      last = now;
      if (now - painted >= paintInterval || elapsed.current === duration) { setTime(elapsed.current); painted = now; }
      if (elapsed.current < duration) frame = requestAnimationFrame(tick);
    };
    const update = () => {
      cancelAnimationFrame(frame); last = 0;
      if (visible && !document.hidden && !paused && !reduced && elapsed.current < duration) frame = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); }, { threshold: .2 });
    if (element.current) observer.observe(element.current);
    document.addEventListener("visibilitychange", update);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); document.removeEventListener("visibilitychange", update); };
  }, [paused, reduced, duration, replay, paintInterval]);
  const seek = (value: number) => { elapsed.current = value; setTime(value); setPaused(true); };
  const start = (value: number) => { elapsed.current = reduced ? duration : value; setTime(elapsed.current); setPaused(false); setReplay(current => current + 1); };
  const toggle = () => {
    if (time >= duration) { elapsed.current = 0; setTime(0); setPaused(false); setReplay(value => value + 1); }
    else setPaused(value => !value);
  };
  return { element, time, paused, reduced, seek, start, toggle, ended: time >= duration };
}
