import { useLayoutEffect, useRef } from "react";
import type { HomeHeroVisualHandle } from "./HomeHeroVisual";

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const ease = (from: number, to: number, value: number) => {
  const t = clamp((value - from) / (to - from));
  return t * t * (3 - 2 * t);
};
const mix = (from: number, to: number, amount: number) => from + (to - from) * amount;

// Survives client-side navigation, but deliberately resets on a document refresh.
let heroHasRevealed = false;

/** One registered figure, a native sticky interval, then an ordinary document. */
export function useHeroSequence({ navigationAware = false }: { navigationAware?: boolean } = {}) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const visual = useRef<HomeHeroVisualHandle>(null);
  const actions = useRef<{ reveal: () => void; disable: () => void } | null>(null);
  const unavailable = useRef(false);

  useLayoutEffect(() => {
    const container = root.current!;
    const scene = stage.current!;
    const figure = scene.querySelector<HTMLElement>(".home-hero-visual")!;
    const copy = scene.querySelector<HTMLElement>(".home-hero-copy")!;
    const cue = scene.querySelector<HTMLButtonElement>(".home-hero-scroll-cue")!;
    const intro = scene.querySelector<HTMLElement>(".home-hero-intro")!;
    const introQuestion = intro.querySelector<HTMLElement>(".home-intro-question")!;
    const introSubject = intro.querySelector<HTMLElement>(".home-intro-subject")!;
    const heading = scene.querySelector<HTMLHeadingElement>("h1")!;
    const header = document.querySelector<HTMLElement>(navigationAware ? ".header-inner" : ".site-header");
    const parts = [
      [".home-affiliation", .24, .48],
      [".home-question-line:nth-child(1)", .33, .65],
      [".home-question-line:nth-child(2)", .40, .72],
      [".home-question-condition", .48, .78],
      [".home-actions", .74, 1],
    ].map(([selector, from, to]) => ({ element: scene.querySelector<HTMLElement>(String(selector))!, from: Number(from), to: Number(to) }));
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let enabled = false, visible = true, disposed = false, focusWhenSettled = false;
    let completed = heroHasRevealed, hasScrolled = false;
    let frame = 0, previous = 0, progress = 0, target = 0, paintedProgress = -1;
    let collapseTimer = 0;
    let top = 89, viewport = 1, travel = 1, baseX = 0, baseY = 0, width = 1, height = 1, centre = 0, openingScale = 1, openingY = 0;
    const pulseStart = performance.now();
    let pulseStoppedAt = -Infinity;
    const stopPulse = () => { if (!hasScrolled) { hasScrolled = true; pulseStoppedAt = performance.now(); } };

    const stop = () => { cancelAnimationFrame(frame); frame = 0; previous = 0; };
    const restore = () => {
      enabled = false;
      stop();
      window.clearTimeout(collapseTimer);
      delete container.dataset.enhanced;
      container.style.removeProperty("--hero-sequence-height");
      figure.style.transform = "";
      figure.style.willChange = "";
      figure.inert = false;
      copy.inert = false;
      intro.style.opacity = "";
      intro.style.transform = "";
      introQuestion.style.opacity = "";
      introSubject.style.opacity = "";
      cue.style.opacity = "";
      cue.style.visibility = "";
      cue.inert = true;
      for (const { element } of parts) {
        element.style.opacity = "";
        element.style.transform = "";
        element.style.filter = "";
      }
      visual.current?.setPulse(0, 0);
    };
    const collapse = () => {
      if (!enabled || disposed) return;
      const scroll = window.scrollY;
      const before = container.offsetHeight;
      const sceneBefore = scene.getBoundingClientRect();
      const sceneVisible = sceneBefore.bottom > top && sceneBefore.top < window.innerHeight;
      restore();
      const removed = before - container.offsetHeight;
      // Anchor the visible hero itself when its final layout becomes shorter.
      // Farther down the page, compensate the full removed document height instead.
      const destination = sceneVisible
        ? window.scrollY + scene.getBoundingClientRect().top - sceneBefore.top
        : scroll - removed;
      if (removed > 0) window.scrollTo({ top: Math.max(0, destination), behavior: "instant" });
    };
    const scheduleCollapse = () => {
      window.clearTimeout(collapseTimer);
      // Wait for native anchor/cue scrolling to finish before changing document length.
      collapseTimer = window.setTimeout(collapse, 180);
    };
    const finish = () => {
      completed = heroHasRevealed = true;
      hasScrolled = true;
      figure.inert = false;
      container.dataset.revealed = "true";
      container.dataset.progress = "1";
      stop();
      visual.current?.setPulse(0, 0);
      if (focusWhenSettled) {
        focusWhenSettled = false;
        heading.focus({ preventScroll: true });
        const bounds = heading.getBoundingClientRect();
        if (bounds.bottom > window.innerHeight - 24) {
          window.scrollBy({ top: bounds.top - top - 24, behavior: "smooth" });
        }
      }
      if (enabled) scheduleCollapse();
    };
    const paint = (now: number) => {
      if (!enabled || completed) return;
      const pulse = ((now - pulseStart) % 3600) / 3600;
      const pulseOpacity = visible && !document.hidden ? Math.sin(pulse * Math.PI) ** 2 * (hasScrolled ? 1 - ease(0, 180, now - pulseStoppedAt) : 1) : 0;
      // The pulse crosses the portrait; scrolling never forces a fully binary body.
      visual.current?.setPulse(-420 + 1900 * pulse, pulseOpacity);
      if (paintedProgress === progress) return;
      paintedProgress = progress;
      const move = ease(0, .62, progress);
      const scale = mix(openingScale, 1, move);
      const x = mix(centre, baseX + width / 2, move) - width * scale / 2 - baseX;
      const y = mix(openingY, baseY, move) - baseY;
      introQuestion.style.opacity = String(1 - ease(.14, .34, progress));
      introSubject.style.opacity = String(1 - ease(0, .14, progress));
      intro.style.transform = `translate3d(0, ${-32 * ease(0, .28, progress)}px, 0)`;
      figure.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      for (const { element, from, to } of parts) {
        const amount = ease(from, to, progress);
        element.style.opacity = String(amount);
        element.style.transform = amount === 1 ? "" : `translate3d(0, ${16 * (1 - amount)}px, 0)`;
      }
      copy.inert = progress < .995;
      const cueOpacity = 1 - ease(.015, .16, progress);
      cue.style.opacity = String(cueOpacity);
      cue.style.visibility = cueOpacity < .001 ? "hidden" : "visible";
      cue.inert = cueOpacity < .01;
      container.dataset.progress = progress.toFixed(4);
      if (progress === 1) finish();
    };
    const tick = (now: number) => {
      frame = 0;
      if (!enabled || completed || !visible || document.hidden) return;
      const delta = previous ? Math.min(now - previous, 48) : 16;
      previous = now;
      progress += (target - progress) * (1 - Math.exp(-delta / 28));
      if (Math.abs(target - progress) < .0002) progress = target;
      paint(now);
      if (!completed && (progress !== target || !hasScrolled || now < pulseStoppedAt + 180)) frame = requestAnimationFrame(tick);
      else { previous = 0; figure.style.willChange = "auto"; }
    };
    const start = () => {
      if (enabled && !completed && visible && !document.hidden && !frame) {
        figure.style.willChange = "transform";
        frame = requestAnimationFrame(tick);
      }
    };
    const readScroll = () => {
      if (!enabled) return;
      if (completed) { scheduleCollapse(); return; }
      const next = clamp((top - container.getBoundingClientRect().top) / travel);
      if (next > .002) stopPulse();
      if (next === target && progress === target) return;
      target = next;
      if (!visible || document.hidden) {
        progress = target;
        if (target === 1) finish();
      } else start();
    };
    const measure = () => {
      if (disposed) return;
      top = header?.getBoundingClientRect().height ?? 89;
      viewport = window.innerHeight - top;
      scene.style.setProperty("--hero-sticky-top", `${top}px`);
      scene.style.setProperty("--hero-viewport", `${viewport}px`);
      // Keep the final viewport fit current without restarting the introduction.
      if (!enabled || completed) return;
      figure.style.transform = "none";
      travel = Math.round(viewport * .72);
      const sceneBounds = scene.getBoundingClientRect();
      const bounds = figure.getBoundingClientRect();
      baseX = bounds.left - sceneBounds.left;
      baseY = bounds.top - sceneBounds.top;
      width = bounds.width;
      height = bounds.height;
      centre = window.innerWidth / 2 - sceneBounds.left;
      const compact = window.innerWidth < 1200;
      const openingHeight = compact ? viewport * .43 : viewport - 112;
      openingScale = Math.min(1.1, openingHeight / height);
      openingY = compact ? viewport * .20 : (viewport - height * openingScale) / 2;
      scene.style.setProperty("--hero-portrait-width", `${width * openingScale}px`);
      delete intro.dataset.compactCondition;
      const condition = intro.querySelector<HTMLElement>(".home-intro-condition")!;
      // This decorative repeat can yield space; the semantic final question never does.
      if (condition.getBoundingClientRect().bottom > cue.getBoundingClientRect().top - 20) {
        intro.dataset.compactCondition = "true";
      }
      container.style.setProperty("--hero-sequence-height", `${scene.offsetHeight + travel}px`);
      container.dataset.travel = String(travel);
      target = clamp((top - container.getBoundingClientRect().top) / travel);
      if (target > .002) stopPulse();
      progress = target;
      paintedProgress = -1;
      paint(performance.now());
      start();
    };
    const disable = () => {
      finish();
      if (enabled) collapse();
      else restore();
    };
    const setPreference = () => {
      if (completed || preference.matches || unavailable.current) { disable(); return; }
      enabled = true;
      figure.inert = true;
      container.dataset.enhanced = "true";
      measure();
    };
    actions.current = {
      disable,
      reveal() {
        if (!enabled || completed) return;
        stopPulse();
        focusWhenSettled = true;
        window.scrollTo({ top: window.scrollY + container.getBoundingClientRect().top - top + travel, behavior: "smooth" });
      },
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!enabled || completed) return;
      if (!visible) { stop(); visual.current?.setPulse(0, 0); }
      else { readScroll(); progress = target; paint(performance.now()); start(); }
    });
    observer.observe(scene);
    const resizing = new ResizeObserver(measure);
    resizing.observe(scene);
    if (header) resizing.observe(header);
    const visibility = () => {
      if (!enabled || completed) return;
      if (document.hidden) { stop(); visual.current?.setPulse(0, 0); }
      else if (visible) { readScroll(); progress = target; paint(performance.now()); start(); }
    };
    window.addEventListener("scroll", readScroll, { passive: true });
    window.addEventListener("resize", measure);
    window.addEventListener("pageshow", measure);
    document.addEventListener("visibilitychange", visibility);
    preference.addEventListener("change", setPreference);
    if (navigationAware) window.addEventListener("digitx:preview-navigate", disable);
    setPreference();
    document.fonts.ready.then(() => { if (!disposed) measure(); });
    return () => {
      disposed = true;
      restore();
      observer.disconnect();
      resizing.disconnect();
      window.removeEventListener("scroll", readScroll);
      window.removeEventListener("resize", measure);
      window.removeEventListener("pageshow", measure);
      document.removeEventListener("visibilitychange", visibility);
      preference.removeEventListener("change", setPreference);
      if (navigationAware) window.removeEventListener("digitx:preview-navigate", disable);
      actions.current = null;
    };
  }, [navigationAware]);

  return {
    root, stage, visual,
    revealQuestion: () => actions.current?.reveal(),
    artworkUnavailable: () => { unavailable.current = true; actions.current?.disable(); },
  };
}
