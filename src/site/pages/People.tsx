import { PeopleDirectory } from "../components/PeopleDirectory";
import { Opportunities } from "../components/Opportunities";
import "./inner-pages.css";

export default function People({ embedded = false, opportunities = true }: { embedded?: boolean; opportunities?: boolean }) {
  return <div className="people-page">
    <PeopleDirectory embedded={embedded} />
    {opportunities && <Opportunities embedded={embedded} />}
  </div>;
}
