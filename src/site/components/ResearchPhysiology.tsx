import { Fragment } from "react";
import { research, researchExperience } from "@/content/research";
import { ModalityCarousel } from "./ModalityCarousel";
import "./research-pillar-layout.css";
import "./research-physiology.css";

export function ResearchPhysiology() {
  const enhance = researchExperience.physiology.enhance;
  return <div className="research-physiology research-pillar-layout">
    <div className="physiology-summary research-pillar-summary">{research.areas[0].intro.map(paragraph => <p key={paragraph}>
      {paragraph.split(enhance.label).map((part, index) => <Fragment key={index}>
        {index > 0 && <a href={enhance.href} target="_blank" rel="noopener noreferrer">{enhance.label}</a>}{part}
      </Fragment>)}
    </p>)}</div>
    <ModalityCarousel />
  </div>;
}
