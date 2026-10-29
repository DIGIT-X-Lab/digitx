import { useEffect } from "react";
import { peoplePage as copy } from "@/content/people";
import { researchers } from "@/content/researchers";
import { previewResearchers } from "@/content/people-preview";
import { Tape } from "../components/primitives";
import { PeopleExplorer } from "../components/PeopleExplorer";
import { Opportunities } from "../components/Opportunities";
import { showPeoplePreview } from "../env";
import "./inner-pages.css";

export default function PeopleOriginalPreview({ embedded = false, preview = showPeoplePreview, opportunities = true }: { embedded?: boolean; preview?: boolean; opportunities?: boolean }) {
  useEffect(() => {
    if (!preview) return;
    const existing = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const robots = existing ?? document.createElement("meta");
    const previous = robots.content;
    robots.name = "robots";
    robots.content = "noindex, nofollow";
    if (!existing) document.head.append(robots);
    return () => { if (existing) robots.content = previous; else robots.remove(); };
  }, [preview]);
  return <div className="people-page">
    <header className="shell people-opening">
      <Tape as={embedded ? "h2" : "h1"} size="display" id="people-title">{copy.title}</Tape>
      <p className="page-lead">{copy.intro}</p>
    </header>
    <PeopleExplorer people={preview ? previewResearchers : researchers} preview={preview} embedded={embedded} />
    {opportunities && <Opportunities embedded={embedded} />}
  </div>;
}
