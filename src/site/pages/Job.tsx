import { Link, useParams } from "react-router-dom";
import { getJobById } from "@/data/jobs";
import { contactEmail } from "@/content/site";
import { Arrow, Tape } from "../components/primitives";
import NotFound from "./NotFound";
import "./inner-pages.css";

export default function Job() {
  const { id } = useParams();
  const job = id ? getJobById(id) : undefined;
  if (!job) return <NotFound />;
  return (
    <article className="shell job-page">
      <Link to="/#opportunities" className="inner-back-link"><span aria-hidden="true">←</span> Opportunities</Link>
      <header className="job-heading"><p className="meta">{job.type}</p><Tape as="h1" size="display">{job.title}</Tape>{job.subtitle && <p className="lead">{job.subtitle}</p>}</header>
      <div className="job-body">
        <div className="job-description prose-site">{job.fullDescription.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        <div className="job-details">
          <div className="job-requirements">
            <section aria-labelledby="job-requirements-title"><h2 id="job-requirements-title" className="title">Requirements</h2><ul>{job.requirements.map((requirement) => <li key={requirement}>{requirement}</li>)}</ul></section>
            {job.niceToHave?.length ? <section aria-labelledby="job-additional-title"><h2 id="job-additional-title" className="title">Nice to have</h2><ul>{job.niceToHave.map((requirement) => <li key={requirement}>{requirement}</li>)}</ul></section> : null}
          </div>
        </div>
      </div>
      <section className="job-application" aria-label="Application">
        {job.applicationInstructions && <p className="prose-site">{job.applicationInstructions}</p>}
        <a href={`mailto:${contactEmail}?subject=${encodeURIComponent(job.title)}`} className="link-arrow job-apply"><span>{job.cta}</span><Arrow direction="diagonal" /></a>
      </section>
    </article>
  );
}
