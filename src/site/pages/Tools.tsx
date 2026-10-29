import { toolsPage } from "@/content/tools";
import { Tape } from "../components/primitives";
import { ToolCatalogue } from "../components/ToolCatalogue";

export default function Tools({ embedded = false }: { embedded?: boolean }) {
  return (
    <div className="tools-page">
    <section className="shell tools-opening">
      <Tape as={embedded ? "h2" : "h1"} size="display" id="tools-title">
        {toolsPage.title}
      </Tape>
      <p className="page-lead">{toolsPage.intro}</p>
    </section>
      <div className="shell tools-catalogue">
        <ToolCatalogue />
      </div>
    </div>
  );
}
