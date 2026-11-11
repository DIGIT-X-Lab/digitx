import { HomeHero } from "./Home";
import Research from "./Research";
import Tools from "./Tools";
import Projects from "./Projects";
import Publications from "./Publications";
import People from "./People";
import { ContactPrototype, OpportunitiesPrototype } from "./EndingPrototype";
import { AtlasMoment } from "../redesign/AtlasMoment";
import { PixelTrail } from "../redesign/PixelTrail";
import { HeroDepthMask } from "../redesign/HeroDepthMask";
import { NewsIsland } from "../redesign/NewsIsland";
import "./landing.css";
import "../redesign/redesign-preview.css";

/** The home page: the continuous document in its Motion register, chosen
 * and shipped November 2026. The approach film plays in the page, the
 * chapter rail rides beside it, news lives in the header island, and the
 * finale carries the collaboration map. */
export default function RedesignPreview({ register }: { register: "editorial" | "motion" }) {
  return <div className="continuous-page redesign-preview" data-register={register}>
    <HomeHero />
    <AtlasMoment register={register} />
    <section id="research" data-site-section="research" className="site-chapter" aria-labelledby="research-title" tabIndex={-1}><Research embedded /></section>
    <section id="tools" data-site-section="tools" className="site-chapter" aria-labelledby="tools-title" tabIndex={-1}><Tools embedded /></section>
    <section id="projects" data-site-section="projects" className="site-chapter" aria-labelledby="projects-title" tabIndex={-1}><Projects embedded /></section>
    <section id="publications" data-site-section="publications" className="site-chapter" aria-labelledby="publications-title" tabIndex={-1}><Publications embedded /></section>
    <section id="people" data-site-section="people" className="site-chapter" aria-labelledby="people-title" tabIndex={-1}><People embedded opportunities={false} /><OpportunitiesPrototype /></section>
    <section id="contact" data-site-section="contact" className="site-chapter" aria-labelledby="contact-title" tabIndex={-1}><ContactPrototype /></section>
    <PixelTrail />
    <HeroDepthMask />
    <NewsIsland />
  </div>;
}
