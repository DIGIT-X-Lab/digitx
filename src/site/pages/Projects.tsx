import { projectsPage } from "@/content/projects";
import { Tape } from "../components/primitives";
import { ProjectStack } from "../components/ProjectStack";
import "./projects.css";

export default function Projects({ embedded = false }: { embedded?: boolean }) {
  return <div className="projects-page">
    <header className="shell projects-opening">
      <Tape as={embedded ? "h2" : "h1"} size="display" id="projects-title">{projectsPage.title}</Tape>
      <p className="page-lead">{projectsPage.intro}</p>
    </header>
    <ProjectStack embedded={embedded} />
  </div>;
}
