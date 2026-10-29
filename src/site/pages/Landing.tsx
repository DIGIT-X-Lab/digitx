import { HomeHero } from "./Home";
import Research from "./Research";
import Tools from "./Tools";
import Projects from "./Projects";
import Publications from "./Publications";
import People from "./People";
import Contact from "./Contact";
import { useSearchParams } from "react-router-dom";
import { showEndingPreview } from "../env";
import { ContactPrototype, EndingPreviewControls, OpportunitiesPrototype } from "./EndingPrototype";
import "./landing.css";

/** A single document: native scrolling, stable anchors and one copy of each example. */
export default function Landing() {
  const [params] = useSearchParams();
  const choice = params.get("ending-preview");
  const preview = showEndingPreview && (choice === "current" || choice === "proposed") ? choice : null;
  const legacyEnding = preview === "current";
  return <div className={`continuous-page${preview ? " ending-preview-page" : ""}`}>
    <HomeHero />
    <section id="research" data-site-section="research" className="site-chapter" aria-labelledby="research-title" tabIndex={-1}><Research embedded /></section>
    <section id="tools" data-site-section="tools" className="site-chapter" aria-labelledby="tools-title" tabIndex={-1}><Tools embedded /></section>
    <section id="projects" data-site-section="projects" className="site-chapter" aria-labelledby="projects-title" tabIndex={-1}><Projects embedded /></section>
    <section id="publications" data-site-section="publications" className="site-chapter" aria-labelledby="publications-title" tabIndex={-1}><Publications embedded /></section>
    <section id="people" data-site-section="people" className="site-chapter" aria-labelledby="people-title" tabIndex={-1}><People embedded opportunities={legacyEnding} />{!legacyEnding && <OpportunitiesPrototype />}</section>
    <section id="contact" data-site-section="contact" className="site-chapter" aria-labelledby="contact-title" tabIndex={-1}>{preview === "current" ? <Contact embedded /> : <ContactPrototype />}</section>
    {preview && <EndingPreviewControls variant={preview} />}
  </div>;
}
