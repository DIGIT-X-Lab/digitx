import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { projects, projectsExperience as copy, type Project } from "@/content/projects";
import { tools } from "@/content/tools";
import { showSlots } from "../env";
import { Arrow, Verify } from "./primitives";
import { ProjectIdentity } from "./ProjectIdentity";

function ProjectCard({ project, index, embedded, animate }: { project: Project; index: number; embedded: boolean; animate: boolean }) {
  const item = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: item, offset: ["start 95%", "start 45%"] });
  const frameClip = useTransform(scrollYProgress, [0, 1], ["inset(2% 2.5% 2% 2.5%)", "inset(0% 0% 0% 0%)"]);
  const mediaClip = useTransform(scrollYProgress, [0, 1], ["inset(8% 10% 8% 10%)", "inset(0% 0% 0% 0%)"]);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1.055, 1]);
  const Heading = embedded ? "h3" : "h2";
  const start = project.fields.find(field => field.label === "Starts")?.value;
  const software = project.fields.find(field => field.toolSlug);
  const tool = tools.find(tool => tool.slug === software?.toolSlug);
  const facts = project.fields.filter(field => !["Status", "Starts", "Software"].includes(field.label) && (field.value || showSlots));
  return <article ref={item} id={project.id} aria-labelledby={`${project.id}-title`} className="project-stack-item"
    style={{ "--project-order": index } as CSSProperties}>
    <div className="project-card-surface">
      <motion.div className="project-card-content" style={{ clipPath: animate ? frameClip : "none" }}>
      <header className="project-card-top">
        <Heading id={`${project.id}-title`}>{project.name}</Heading>
        <p className="project-phase">{start ? `${copy.starts} ${start}` : copy.current}</p>
      </header>
      <div className="project-card-body">
        <div className="project-card-story">
          <p className="project-purpose">{project.descriptor}</p>
          <p className="project-summary">{project.body}</p>
          <dl className="project-partners">{facts.map(field => <div key={field.label}>
            <dt>{field.label}</dt><dd>{field.value ?? (field.verify ? <Verify note={field.verify} /> : null)}</dd>
          </div>)}</dl>
          {tool && <Link to={`/tools/${tool.slug}`} className="project-tool-link" aria-label={`${project.name}: ${copy.explore} ${tool.name}`}>
            <span className="project-tool-origin">{project.name}</span><Arrow /><span>{tool.name}</span>
          </Link>}
        </div>
        <motion.figure className={`project-visual project-visual--${project.id}`} style={{ clipPath: animate ? mediaClip : "none" }}>
          <motion.div className="project-visual-content" style={{ scale: animate ? mediaScale : 1 }}>
            <ProjectIdentity project={project.id} />
          </motion.div>
        </motion.figure>
      </div>
      </motion.div>
    </div>
  </article>;
}

/** Native sticky stacking only when every complete project fits in the viewport. */
export function ProjectStack({ embedded }: { embedded: boolean }) {
  const stack = useRef<HTMLDivElement>(null);
  const [stacking, setStacking] = useState(false);
  useEffect(() => {
    const root = stack.current;
    if (!root) return;
    const preference = matchMedia("(min-width: 1101px) and (prefers-reduced-motion: no-preference)");
    const measure = () => {
      const items = Array.from(root.querySelectorAll<HTMLElement>(".project-stack-item"));
      const header = document.querySelector(".header-inner")?.getBoundingClientRect().height ?? 89;
      const top = header + 16;
      root.style.setProperty("--project-pin-top", `${top}px`);
      let titleOffset = 0;
      const layouts = items.map(item => {
        const heading = item.querySelector<HTMLElement>(".project-card-top")!;
        const body = item.querySelector<HTMLElement>(".project-card-body")!;
        const story = item.querySelector<HTMLElement>(".project-card-story")!;
        const padding = getComputedStyle(body);
        const bodyHeight = innerHeight - top - titleOffset - heading.offsetHeight - 18;
        const mediaHeight = bodyHeight - parseFloat(padding.paddingTop) - parseFloat(padding.paddingBottom);
        item.style.setProperty("--project-sticky-offset", `${titleOffset}px`);
        item.style.setProperty("--project-body-height", `${Math.max(0, bodyHeight)}px`);
        item.style.setProperty("--project-media-height", `${Math.max(0, mediaHeight)}px`);
        const offset = titleOffset;
        // Keep the entire title row and its lower breathing space exposed.
        titleOffset += heading.offsetHeight + 25;
        return { item, offset, height: item.querySelector<HTMLElement>(".project-card-surface")!.getBoundingClientRect().height,
          fits: Math.max(story.offsetHeight, 300) <= mediaHeight };
      });
      // Equalise the sticky boxes' bottom edge so every card releases together.
      // Compensate at the next card's top margin to preserve the visible spacing.
      const stackBottom = Math.max(...layouts.map(layout => layout.offset + layout.height));
      layouts.forEach(({ item, offset, height }, index) => {
        const tail = stackBottom - offset - height;
        item.style.setProperty("--project-exit-tail", `${tail}px`);
        items[index + 1]?.style.setProperty("--project-previous-tail", `${tail}px`);
      });
      const fits = layouts.every(layout => layout.fits);
      setStacking(preference.matches && fits);
    };
    let measureFrame = 0;
    const schedule = () => {
      cancelAnimationFrame(measureFrame);
      measureFrame = requestAnimationFrame(measure);
    };
    const dimensions = new ResizeObserver(schedule);
    root.querySelectorAll(".project-card-surface").forEach(item => dimensions.observe(item));
    window.addEventListener("resize", schedule);
    preference.addEventListener("change", schedule);
    measure();
    return () => { dimensions.disconnect(); cancelAnimationFrame(measureFrame); window.removeEventListener("resize", schedule); preference.removeEventListener("change", schedule); };
  }, []);
  return <div className="shell projects-collection"><div ref={stack} className="project-stack" data-stacking={stacking}
    onFocusCapture={event => {
      const target = event.target;
      if (!target.matches(":focus-visible")) return;
      // Focus releases the sticky layout; reveal the link after that reflow.
      requestAnimationFrame(() => {
        if (target.isConnected && document.activeElement === target) target.scrollIntoView({ block: "nearest", behavior: "instant" });
      });
    }}>
    {projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} embedded={embedded} animate={stacking} />)}
  </div></div>;
}
