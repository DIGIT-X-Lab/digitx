import { HomeHero } from "../Home";
import People from "../People";
import { ContactPrototype, OpportunitiesPrototype } from "../EndingPrototype";
import { ReviewResearch } from "./ReviewResearch";
import { ReviewTools } from "./ReviewTools";
import { ReviewPublications } from "./ReviewPublications";
import { ReviewProjects } from "./ReviewProjects";
import "../landing.css";
import "./review-prototype.css";

/* THROWAWAY REVIEW MOCKUP: one proposal beside the unchanged main page.
 * THESIS: encounter the science sooner, then choose how deeply to read.
 * OWN-WORLD: DIGITX wireframes, warm black/ivory, Inter roles and flowing names.
 * STORY: question → example → usable tools → evidence → people → invitation.
 * FIRST VIEWPORT: preserve the approved body-and-question opening.
 * FORM: an explicitly requested revision of the existing continuous site;
 * compact publication records, optional demos and one selected funded project.
 */
export default function ReviewPrototype() {
  return <div className="continuous-page review-page">
    <HomeHero reviewPreview />
    <section id="research" data-site-section="research" className="site-chapter" aria-labelledby="research-title" tabIndex={-1}><ReviewResearch /></section>
    <section id="tools" data-site-section="tools" className="site-chapter" aria-labelledby="tools-title" tabIndex={-1}><ReviewTools /></section>
    <section id="projects" data-site-section="projects" className="site-chapter" aria-labelledby="projects-title" tabIndex={-1}><ReviewProjects /></section>
    <section id="publications" data-site-section="publications" className="site-chapter" aria-labelledby="publications-title" tabIndex={-1}><ReviewPublications /></section>
    <section id="people" data-site-section="people" className="site-chapter" aria-labelledby="people-title" tabIndex={-1}><People embedded opportunities={false} /></section>
    <OpportunitiesPrototype />
    <section id="contact" data-site-section="contact" className="site-chapter" aria-labelledby="contact-title" tabIndex={-1}><ContactPrototype /></section>
  </div>;
}
