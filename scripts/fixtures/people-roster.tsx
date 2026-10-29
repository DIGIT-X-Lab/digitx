/** Browser-only stress fixture. Not imported by the application or production build. */
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { PeopleExplorer } from "../../src/site/components/PeopleExplorer";
import { peoplePage } from "../../src/content/people";
import type { Researcher } from "../../src/content/researchers";

let root: Root | undefined;
export function renderRosterFixture(count = 24) {
  document.getElementById("root")!.style.display = "none";
  if (!root) {
    const container = document.createElement("div");
    container.id = "people-roster-fixture";
    document.body.append(container);
    root = createRoot(container);
  }
  const people: Researcher[] = Array.from({ length: count }, (_, index) => {
    const number = String(index + 1).padStart(2, "0");
    return {
      id: `fixture-person-${number}`,
      name: `Test Researcher ${number}`,
      role: "Doctoral researcher",
      affiliation: "Browser test fixture",
      membership: index < 16 ? "core" : "associated",
      profiles: [],
      portrait: { src: "/portraits/hagen-lamprecht-web.jpg", alt: "Repeated test image", status: "approved" },
      responses: peoplePage.prompts.map((question, q) => ({ id: `answer-${q}`, question, answer: `Fixture answer for test researcher ${number}.`, status: "approved" })),
    };
  });
  root.render(<MemoryRouter><div className="site-layout site-layout--home"><PeopleExplorer people={people} embedded /></div></MemoryRouter>);
}
