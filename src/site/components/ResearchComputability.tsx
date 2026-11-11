import { research } from "@/content/research";
import { HomeObservations } from "./HomeObservations";
import { useRegister } from "../redesign/useRegister";
import "./research-pillar-layout.css";

/** Redesign registers: Home's film performs this pillar's story, so the
 * drawer keeps the interactive example (watch above, touch here, matching
 * its sibling pillars' visuals) but only the two claims the film does not
 * make. Sentences are sliced verbatim from the approved editorial; the
 * baseline register renders the original in full. */
export function ResearchComputability() {
  const register = useRegister();
  const area = research.areas.find(item => item.id === "computable")!;
  const belief = `${area.intro[0].split(". ")[0]}.`;
  const trace = area.intro[2].split(". ").slice(-1)[0];
  const paragraphs = register === "current" ? area.intro : [belief, trace];
  return <div className="research-computability research-pillar-layout">
    <div className="computability-summary research-pillar-summary">
      {paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
    </div>
    <HomeObservations presentation="pillar" />
  </div>;
}
