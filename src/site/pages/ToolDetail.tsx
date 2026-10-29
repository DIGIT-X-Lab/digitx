import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { tools, toolsPage } from "@/content/tools";
import { toolGuides } from "@/content/tool-guides";
import { research } from "@/content/research";
import { Arrow, ArrowLink, Tape } from "../components/primitives";
import { ToolStudy } from "../components/ToolStudy";
import { ValidationInvite } from "../components/ToolValidation";
import { toolValidation } from "@/content/tool-validation";
import NotFound from "./NotFound";
import "./tool-detail.css";

function InstallCommand({ command }: { command: string }) {
  const [message, setMessage] = useState("");
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(timeout.current), []);
  const copy = async () => {
    clearTimeout(timeout.current);
    try { await navigator.clipboard.writeText(command); setMessage("Copied"); }
    catch { setMessage("Select the command to copy it"); }
    timeout.current = setTimeout(() => setMessage(""), 3000);
  };
  return <div className="tool-install"><div><code>{command}</code><button type="button" onClick={copy} aria-label="Copy installation command">{message === "Copied" ? "Copied" : "Copy"}</button></div><p role="status">{message}</p></div>;
}

export default function ToolDetail() {
  const { slug } = useParams();
  const tool = tools.find(entry => entry.slug === slug);
  if (!tool) return <NotFound />;
  const guide = toolGuides[tool.slug];
  const development = tool.status === "development";
  return <article className="shell tool-record">
    <Link to="/#tools" className="tool-record-back"><Arrow />All tools</Link>
    <header className="tool-record-heading">
      <p className="tool-record-meta">{tool.data.join(" + ")}<span aria-hidden="true">·</span>{toolsPage.statusLabel[tool.status]}</p>
      <Tape as="h1" size="display">{tool.name}</Tape>
      <p className="page-lead">{tool.function}</p>
      <div className="tool-record-actions">{guide && <ArrowLink to={guide.docs}>{toolsPage.fields.docs}</ArrowLink>}{tool.repo && <ArrowLink to={tool.repo}>{toolsPage.fields.code}</ArrowLink>}</div>
    </header>
    {guide ? <>
      <section className="tool-record-overview" aria-labelledby="tool-overview-title">
        <div><h2 id="tool-overview-title">{toolsPage.fields.what}</h2><p>{guide.overview}</p>
          <dl className="tool-record-io"><div><dt>Input</dt><dd>{guide.input}</dd></div><div><dt>Output</dt><dd>{guide.output}</dd></div></dl>
        </div>
        <ToolStudy slug={tool.slug} />
      </section>
      <section className="tool-record-start" aria-labelledby="tool-start-title">
        <div><h2 id="tool-start-title">Getting started</h2><p>{guide.requirements}</p>{guide.install && <InstallCommand command={guide.install} />}<ArrowLink to={guide.docs}>Read the setup guide</ArrowLink></div>
        <aside className="tool-record-facts" aria-label="Software details"><dl><div><dt>Interface</dt><dd>{tool.interface}</dd></div>{tool.licence && <div><dt>Code licence</dt><dd>{tool.licence}</dd></div>}<div><dt>Availability</dt><dd>{toolsPage.statusLabel[tool.status]}</dd></div></dl>{guide.scope && <p>{guide.scope}</p>}</aside>
      </section>
      {guide.citation && <section className="tool-record-evidence" aria-labelledby="tool-evidence-title"><h2 id="tool-evidence-title">{guide.citation.kind === "Paper" ? "The work behind the tool" : "Cite the software"}</h2><a href={guide.citation.href} target="_blank" rel="noopener noreferrer"><span>{guide.citation.title}</span><Arrow direction="diagonal" /></a></section>}
      <section className="tool-record-research" aria-labelledby="tool-research-title"><h2 id="tool-research-title">Related research</h2><div>{research.areas.filter(area => tool.areas.includes(area.id)).map(area => <ArrowLink key={area.id} to={`/#${area.id}`}>{area.title}</ArrowLink>)}</div></section>
      <p className="tool-record-source">Based on the <a href={`${tool.repo}#readme`} target="_blank" rel="noopener noreferrer">project documentation</a>. Check the setup guide for current requirements.</p>
    </> : tool.status === "validation" ? <section className="tool-record-pending">
      <h2>Explore a collaboration</h2><p>{toolValidation.detailIntro}</p>
      <ValidationInvite name={tool.name} />
      <p className="tool-record-meta">{toolValidation.availability}{tool.plannedLicence && ` Planned licence on release: ${tool.plannedLicence}`}</p>
    </section> : development && <section className="tool-record-pending"><h2>{toolsPage.development}</h2><p>{toolsPage.developmentNote}</p>{tool.plannedLicence && <p className="tool-record-meta">Planned licence on release: {tool.plannedLicence}</p>}</section>}
    <footer className="tool-record-footer"><ArrowLink to="/#tools">Explore all tools</ArrowLink><p>{toolsPage.localNote}</p></footer>
  </article>;
}
