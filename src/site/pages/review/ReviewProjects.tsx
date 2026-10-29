import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { projects, projectsPage } from "@/content/projects";
import { tools } from "@/content/tools";
import { Arrow, Tape } from "../../components/primitives";
import { ProjectIdentity } from "../../components/ProjectIdentity";
import { FlowingMenuHighlight } from "../../components/FlowingMenuHighlight";
import { useHoverHighlight } from "../../components/useHoverHighlight";

/** One chosen project, with its work foregrounded and identity as a signature. */
export function ReviewProjects() {
  const { hash } = useLocation();
  const [selected, setSelected] = useState(projects[0].id);
  const selectors = useRef<HTMLDivElement>(null);
  const highlight = useHoverHighlight(selectors);
  const reduced = useReducedMotion();
  useEffect(() => { const linked = projects.find(project => `#${project.id}` === hash); if (linked) setSelected(linked.id); }, [hash]);
  const project = projects.find(item => item.id === selected)!;
  const facts = project.fields.filter(field => field.value && field.label !== "Software");
  const software = project.fields.find(field => field.toolSlug);
  const tool = tools.find(item => item.slug === software?.toolSlug);
  return <div className="review-projects shell">
    <header className="review-projects-heading"><Tape as="h2" size="display" id="projects-title">{projectsPage.title}</Tape><details><summary>About the projects</summary><p>{projectsPage.intro}</p></details></header>
    <div className="review-projects-grid">
      <div ref={selectors} className="review-project-selectors flowing-menu-host" role="group" aria-label="Choose a funded project">
        <FlowingMenuHighlight target={highlight.target} exitEdge={highlight.exitEdge} inset={10} />
        {projects.map(item => <button key={item.id} id={item.id} data-hover-item={item.id} aria-pressed={selected === item.id} aria-controls="review-project-detail" onClick={() => setSelected(item.id)}><span>{item.name}</span><span className="review-project-selector-status">{item.fields.find(field => field.label === "Status")?.value}</span><Arrow /></button>)}
      </div>
      <div id="review-project-detail" aria-live="polite" aria-atomic="true">
        <AnimatePresence mode="wait" initial={false}><motion.article key={project.id} initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: reduced ? 1 : 0 }} transition={{ duration: reduced ? 0 : .16 }} aria-labelledby="review-project-title">
          <div className="review-project-heading"><div><p className="meta">{project.name}</p><h3 id="review-project-title">{project.descriptor}</h3></div><div className="review-project-signature"><ProjectIdentity project={project.id} initiallyPaused /></div></div>
          <p className="review-project-description">{project.body}</p>
          <dl className="review-project-facts">{facts.map(field => <div key={field.label}><dt>{field.label}</dt><dd>{field.value}</dd></div>)}</dl>
          {tool && <Link className="review-project-tool" to={`/review-prototype/tools/${tool.slug}`}><span>Explore {tool.name}</span><Arrow /></Link>}
        </motion.article></AnimatePresence>
      </div>
    </div>
  </div>;
}
