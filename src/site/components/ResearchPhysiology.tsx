import { Fragment } from "react";
import { research, researchExperience } from "@/content/research";
import { ModalityCarousel } from "./ModalityCarousel";
import { useRegister } from "../redesign/useRegister";
import "./research-pillar-layout.css";
import "./research-physiology.css";

/** Redesign registers: the drawer's prose compresses to six sentences,
 * sliced verbatim from the approved editorial (what we do, the ENHANCE.PET
 * provenance, the challenge-study programme). The baseline register renders
 * the original three full paragraphs. */
function selectedParagraphs() {
  const [first, second, third] = research.areas[0].intro;
  const a = first.split(". ");
  const b = second.split(". ");
  return [
    `${a[0]}.`,
    `${a[2]} ${b[0]}.`,
    `${b[2]} ${third.split(". ")[0]}.`,
  ];
}

export function ResearchPhysiology() {
  const register = useRegister();
  const enhance = researchExperience.physiology.enhance;
  const paragraphs = register === "current" ? research.areas[0].intro : selectedParagraphs();
  return <div className="research-physiology research-pillar-layout">
    <div className="physiology-summary research-pillar-summary">{paragraphs.map(paragraph => <p key={paragraph}>
      {paragraph.split(enhance.label).map((part, index) => <Fragment key={index}>
        {index > 0 && <a href={enhance.href} target="_blank" rel="noopener noreferrer">{enhance.label}</a>}{part}
      </Fragment>)}
    </p>)}</div>
    <ModalityCarousel />
  </div>;
}
