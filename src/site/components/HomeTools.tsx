import { Link } from "react-router-dom";
import { tools, toolsPage } from "@/content/tools";
import { Arrow } from "./primitives";
import { ToolIllustration } from "./ToolIllustration";
import "./tool-bento.css";

export function HomeTools() {
  return <div className="home-tools">
    <div className="home-tool-features">{tools.filter(t => ["moose", "mosaicx"].includes(t.slug)).map(tool => <article key={tool.slug} className={`home-tool-feature home-tool-feature--${tool.slug}`}>
      <div className="home-tool-heading"><p>{tool.data.join(" + ")}</p><span>{toolsPage.statusLabel[tool.status]}</span></div>
      <h3><Link to={`/tools/${tool.slug}`}>{tool.name}<Arrow direction="diagonal" /></Link></h3>
      <p className="home-tool-description">{tool.function}</p>
      <ToolIllustration slug={tool.slug} />
      <div className="home-tool-access"><span>{tool.licence}</span><a href={tool.repo} target="_blank" rel="noopener noreferrer">{toolsPage.fields.code}<Arrow direction="diagonal" /></a></div>
    </article>)}</div>
    <div className="home-tool-more">{tools.filter(t => ["lion", "falcon"].includes(t.slug)).map(tool => <Link key={tool.slug} to={`/tools/${tool.slug}`}><span>{tool.name}</span><p>{tool.function}</p><Arrow direction="diagonal" /></Link>)}</div>
  </div>;
}
