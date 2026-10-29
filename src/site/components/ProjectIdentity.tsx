import { useEffect, useRef, useState, type PointerEvent } from "react";
import { motion, useInView, useMotionTemplate, useSpring, useTransform } from "framer-motion";
import { MODE_FRAMES, paintFrame, resolvePreset } from "thinking-orbs/engine";
import { projectsExperience } from "@/content/projects";
import { useMotionPreference } from "../hooks/useMotionPreference";
import { lumosMascotPaths } from "../illustrations/lumos-mascot-paths";
import "./project-identity.css";

const preset = resolvePreset("composing", 64);

function KeplerWave({ running }: { running: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const elapsed = useRef(0);
  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext("2d");
    if (!element || !context) return;
    let frame = 0;
    let resizeFrame = 0;
    let last = 0;
    let painted = 0;
    const draw = () => {
      const scale = element.width / 64;
      context.setTransform(scale, 0, 0, scale, 0, 0);
      context.clearRect(0, 0, 64, 64);
      paintFrame(context, MODE_FRAMES[preset.mode](64, (6 + elapsed.current * .24) * preset.speed, preset.opts), true, { r: 225, g: 218, b: 202 });
    };
    const tick = (now: number) => {
      if (last) elapsed.current += Math.min(now - last, 64) / 1000;
      last = now;
      if (now - painted >= 1000 / 30) { draw(); painted = now; }
      frame = requestAnimationFrame(tick);
    };
    const resize = () => {
      const size = Math.max(1, Math.round(element.clientWidth * Math.min(devicePixelRatio || 1, 2)));
      element.width = size;
      element.height = size;
      draw();
    };
    const dimensions = new ResizeObserver(() => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(resize);
    });
    dimensions.observe(element);
    resize();
    if (running) frame = requestAnimationFrame(tick);
    return () => { dimensions.disconnect(); cancelAnimationFrame(frame); cancelAnimationFrame(resizeFrame); };
  }, [running]);
  return <canvas ref={canvas} className="project-kepler-wave" aria-hidden="true" />;
}

/** Existing identities share one stage; each retains its own restrained gesture. */
export function ProjectIdentity({ project, initiallyPaused = false }: { project: string; initiallyPaused?: boolean }) {
  const control = useRef<HTMLButtonElement>(null);
  const inView = useInView(control, { amount: .35 });
  const reduced = useMotionPreference();
  const [visible, setVisible] = useState(!document.hidden);
  const [paused, setPaused] = useState(initiallyPaused);
  const [hovered, setHovered] = useState(false);
  const x = useSpring(0, { stiffness: 110, damping: 22, mass: .7 });
  const y = useSpring(0, { stiffness: 110, damping: 22, mass: .7 });
  const rotateY = useTransform(x, [-1, 1], [-7, 7]);
  const rotateX = useTransform(y, [-1, 1], [5, -5]);
  const tilt = useTransform(x, [-1, 1], [-3, 3]);
  const eyeX = useTransform(x, [-1, 1], [-15, 15]);
  const eyeY = useTransform(y, [-1, 1], [-9, 9]);
  const lightX = useTransform(x, [-1, 1], [0, 100]);
  const lightY = useTransform(y, [-1, 1], [0, 100]);
  const wireLight = useMotionTemplate`radial-gradient(circle at ${lightX}% ${lightY}%, #fff9ec 0%, transparent 36%)`;
  const copy = projectsExperience.identities[project];
  const running = inView && visible && !reduced && !paused;

  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  useEffect(() => {
    if (reduced || !inView || !visible) { x.jump(0); y.jump(0); }
  }, [reduced, inView, visible, x, y]);

  const follow = (event: PointerEvent<HTMLButtonElement>) => {
    if (!running || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    x.set(Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1)));
    y.set(Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1)));
  };

  return <button ref={control} type="button" className={`project-identity project-identity--${project}`}
    data-running={running && !hovered} data-motion={running ? "running" : "paused"}
    aria-label={reduced ? copy.label : `${copy.label}. ${paused ? projectsExperience.play : projectsExperience.pause}`}
    aria-pressed={paused} disabled={reduced}
    onClick={() => { setPaused(value => !value); x.stop(); y.stop(); }}
    onPointerEnter={() => setHovered(true)} onPointerMove={follow}
    onPointerLeave={() => { setHovered(false); if (!paused) { x.set(0); y.set(0); } }}>
    <motion.span className="project-identity-pose" style={project === "brezn" ? undefined : { rotateX, rotateY, rotate: tilt }}>
      {project === "kepler" ? <KeplerWave running={running && !hovered} /> : project === "arche" ?
        <svg className="project-lumos-mascot" viewBox="0 0 1024 1024" aria-hidden="true">
          <path d={lumosMascotPaths[0]} />
          <motion.g style={{ x: eyeX, y: eyeY }}><g className="project-lumos-eyes">
            <path d={lumosMascotPaths[1]} /><path d={lumosMascotPaths[2]} />
          </g></motion.g>
        </svg> : <span className="project-galah-gesture">
          <img className="project-galah-portrait" src="/illustrations/projects/galah-wireframe-alpha.png" alt="" width="1254" height="1254" loading="lazy" decoding="async" />
          <span className="project-galah-trace" aria-hidden="true" />
          <motion.span className="project-galah-light" style={{ backgroundImage: wireLight, opacity: running && hovered ? .7 : 0 }} aria-hidden="true" />
        </span>}
    </motion.span>
  </button>;
}
