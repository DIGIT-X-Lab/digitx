import { useRef } from "react";
import { Link } from "react-router-dom";
import { jobs } from "@/data/jobs";
import { peoplePage } from "@/content/people";
import { Arrow, Tape } from "./primitives";
import { FlowingMenuHighlight } from "./FlowingMenuHighlight";
import { useHoverHighlight } from "./useHoverHighlight";
import "./opportunities.css";

export function Opportunities({ embedded = false }: { embedded?: boolean }) {
  const copy = peoplePage.opportunities;
  const surface = useRef<HTMLDivElement>(null);
  const { target, exitEdge } = useHoverHighlight(surface);
  const Heading = embedded ? "h4" : "h3";

  return <section id="opportunities" className="shell opportunities-section" aria-labelledby="opps-title">
    <Tape as={embedded ? "h3" : "h2"} size="display" id="opps-title">{copy.title}</Tape>
    <div className="opportunities-surface flowing-menu-host" ref={surface}>
      <FlowingMenuHighlight target={target} exitEdge={exitEdge} inset={12} />
      <ul className="opportunities-list">
        {copy.categories.flatMap(category => {
          const openings = jobs.filter(job => job.category === category.id);
          return openings.length ? openings.map(job => <li key={job.id}>
            <Link to={`/careers/${job.id}`} className="opportunity-row opportunity-row--open" data-hover-item={job.id}>
              <Heading className="opportunity-name">{job.title}</Heading>
              <p className="opportunity-description">{job.shortDescription}</p>
              <span className="opportunity-status">{copy.open}</span>
              <Arrow direction="diagonal" />
            </Link>
          </li>) : [<li key={category.id}>
            <div className="opportunity-row opportunity-row--closed">
              <Heading className="opportunity-name">{category.title}</Heading>
              <span className="opportunity-status">{copy.closed}</span>
            </div>
          </li>];
        })}
      </ul>
    </div>
  </section>;
}
