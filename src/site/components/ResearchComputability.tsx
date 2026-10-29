import { research } from "@/content/research";
import { HomeObservations } from "./HomeObservations";
import "./research-pillar-layout.css";

export function ResearchComputability() {
  const area = research.areas.find(item => item.id === "computable")!;
  return <div className="research-computability research-pillar-layout">
    <div className="computability-summary research-pillar-summary">
      {area.intro.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
    </div>
    <HomeObservations presentation="pillar" />
  </div>;
}
