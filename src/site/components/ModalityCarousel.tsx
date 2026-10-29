import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useMotionValueEvent, useTransform, type MotionValue } from "framer-motion";
import { researchExperience } from "@/content/research";

const copy = researchExperience.physiology.carousel;
const modalities = researchExperience.physiology.modalities;
const count = modalities.length;
const wrap = (value: number, range: number) => ((value % range) + range) % range;

function ModalityView({ index, position, spacing, imageHeight }: { index: number; position: MotionValue<number>; spacing: MotionValue<number>; imageHeight: MotionValue<number> }) {
  const item = modalities[index];
  // Recycle each view only at the fully transparent outer edge. Three stable
  // images can loop indefinitely without remounting or updating React per frame.
  const distance = useTransform(position, value => wrap(index - value + count / 2, count) - count / 2);
  const x = useTransform(() => distance.get() * spacing.get());
  const scale = useTransform(distance, value => 1 - Math.min(1, Math.abs(value)) * .26);
  const rotateY = useTransform(distance, value => Math.max(-1, Math.min(1, value)) * -22);
  const y = useTransform(distance, value => Math.min(1, Math.abs(value)) * 12);
  const opacity = useTransform(distance, [-1.5, -1.2, 1.2, 1.5], [0, 1, 1, 0]);
  const imageOpacity = useTransform(distance, [-1, 0, 1], [.42, 1, .42]);
  const labelOpacity = useTransform(() => opacity.get() * (1 - Math.min(1, Math.abs(distance.get())) * .3));
  const labelY = useTransform(() => imageHeight.get() + 12 + y.get() + (scale.get() - 1) * imageHeight.get() / 2);
  const pointerEvents = useTransform(opacity, value => value > .1 ? "auto" : "none");
  const zIndex = useTransform(distance, value => Math.round(100 - Math.abs(value) * 10));
  return <>
    <motion.span className="modality-view" data-modality={index} aria-hidden="true" style={{ x, opacity, zIndex, pointerEvents }}>
      <motion.span className="modality-art" style={{ y, scale, rotateY, opacity: imageOpacity }}>
        <img src={item.src} width="1024" height="1536" alt="" draggable={false} decoding="async" />
      </motion.span>
    </motion.span>
    <motion.span className="modality-caption" data-modality={index} data-caption-for={index} aria-hidden="true"
      style={{ x, y: labelY, opacity: labelOpacity, pointerEvents }}>{item.label}</motion.span>
  </>;
}

export function ModalityCarousel() {
  const position = useMotionValue(0);
  const spacing = useMotionValue(190);
  const imageHeight = useMotionValue(360);
  const [reduced, setReduced] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [held, setHeld] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [selected, setSelected] = useState(0);
  const [centred, setCentred] = useState(0);
  const centredIndex = useRef(0);
  const stage = useRef<HTMLButtonElement>(null);
  const focusMotion = useRef<ReturnType<typeof animate> | null>(null);
  const pointerType = useRef("mouse");
  const instructionsId = useId();
  const captionId = useId();
  const playing = visible && loaded && !reduced && !hovered && !focused && !held;

  useMotionValueEvent(position, "change", value => {
    const nearest = wrap(Math.round(value), count);
    if (nearest === centredIndex.current) return;
    centredIndex.current = nearest;
    setCentred(nearest);
  });

  const focusView = useCallback((index: number) => {
    const canonical = wrap(index, count);
    const current = position.get();
    const target = current + wrap(canonical - current + count / 2, count) - count / 2;
    focusMotion.current?.stop();
    setSelected(canonical);
    if (reduced) position.set(target);
    else focusMotion.current = animate(position, target, { duration: .42, ease: [.16, 1, .3, 1] });
  }, [position, reduced]);

  useLayoutEffect(() => {
    if (!stage.current) return;
    const update = () => {
      spacing.set((stage.current?.clientWidth ?? 620) * .33);
      imageHeight.set(stage.current?.querySelector<HTMLElement>(".modality-art")?.clientHeight ?? 360);
    };
    const observer = new ResizeObserver(update);
    observer.observe(stage.current);
    update();
    return () => observer.disconnect();
  }, [spacing, imageHeight]);

  useEffect(() => {
    let inView = false;
    const update = () => setVisible(inView && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; update(); }, { threshold: .2 });
    if (stage.current) observer.observe(stage.current);
    document.addEventListener("visibilitychange", update);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", update); };
  }, []);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(preference.matches);
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!visible || reduced) focusMotion.current?.stop();
  }, [visible, reduced]);
  useEffect(() => () => { focusMotion.current?.stop(); }, []);

  useEffect(() => {
    let mounted = true;
    const images = Array.from(stage.current?.querySelectorAll("img") ?? []);
    Promise.all(images.map(image => image.decode().catch(() => undefined))).then(() => {
      if (mounted) setLoaded(true);
    });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const elapsed = Math.min(now - last, 64);
      last = now;
      position.set(wrap(position.get() + elapsed / 6500, count));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, position]);

  return <figure className="modality-carousel" data-playing={playing} data-selected={selected}>
    <span id={instructionsId} className="sr-only">{copy.instructions}</span>
    <button ref={stage} type="button" className="modality-stage" aria-label={held ? copy.release : copy.hold}
      aria-pressed={held} aria-describedby={`${captionId} ${instructionsId}`}
      onPointerEnter={event => {
        if (event.pointerType === "touch") return;
        setHovered(true);
        setFocused(false);
      }}
      onPointerLeave={() => {
        focusMotion.current?.stop();
        setHovered(false);
      }}
      onPointerDown={event => { pointerType.current = event.pointerType; setFocused(false); }}
      onFocus={event => setFocused(event.currentTarget.matches(":focus-visible"))}
      onBlur={() => { focusMotion.current?.stop(); setFocused(false); }}
      onKeyDown={event => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          setFocused(true);
          focusView(Math.round(position.get()) + (event.key === "ArrowRight" ? 1 : -1));
        }
      }}
      onClick={event => {
        if (event.detail === 0) { setHeld(previous => !previous); return; }
        const view = (event.target as HTMLElement).closest<HTMLElement>("[data-modality]");
        const index = view ? Number(view.dataset.modality) : selected;
        if (pointerType.current === "touch") {
          if (held && selected === index) { setHeld(false); focusMotion.current?.stop(); }
          else { setHeld(true); focusView(index); }
        } else if (view) focusView(index);
      }}>
      {modalities.map((item, index) => <ModalityView key={item.id} index={index} position={position} spacing={spacing} imageHeight={imageHeight} />)}
    </button>
    <figcaption id={captionId} className="sr-only" aria-live="off">{modalities[centred].label}</figcaption>
  </figure>;
}
