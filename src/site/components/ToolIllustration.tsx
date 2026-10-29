import { illustrations as copy } from "@/content/illustrations";
import { Arrow } from "./primitives";

export function ToolIllustration({ slug }: { slug: string }) {
  if (slug === "moose" || slug === "lion") return <figure className={`tool-anatomy tool-anatomy--${slug}`}>
    <div className="tool-anatomy-images">
      <img src={`/illustrations/anatomy/${slug === "moose" ? "anatomy" : "front-clean"}.webp`} width="1024" height="1536" alt="" loading="lazy" />
      {slug === "lion" && <img className="tool-anatomy-overlay" src="/illustrations/anatomy/tumour-overlay.webp" width="1024" height="1536" alt="" loading="lazy" />}
    </div>
    <figcaption>{copy.anatomy}</figcaption>
  </figure>;
  if (slug === "mosaicx") return <figure className="tool-document">
    <div className="tool-document-flow"><div className="tool-document-source"><p>{copy.report}</p><blockquote>{copy.narrative}</blockquote></div><Arrow />
      <dl>{copy.fields.map(field => <div key={field.label}><dt>{field.label}</dt><dd>{field.value}</dd></div>)}</dl>
    </div><figcaption>{copy.document}</figcaption>
  </figure>;
  return null;
}
