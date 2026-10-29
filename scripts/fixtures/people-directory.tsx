/** Synthetic browser-test roster. Never imported into the application. */
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { PeopleDirectory } from "../../src/site/components/PeopleDirectory";
import type { Researcher } from "../../src/content/researchers";

export function renderDirectoryFixture(count = 20) {
  document.getElementById("root")!.style.display = "none";
  const container = document.createElement("div");
  document.body.append(container);
  const people: Researcher[] = Array.from({ length: count }, (_, index) => ({
    id: `test-person-${index + 1}`,
    name: `Test Researcher ${String(index + 1).padStart(2, "0")}`,
    role: "Doctoral researcher",
    membership: index < 12 ? "core" : "associated",
    affiliation: "Synthetic test affiliation",
    profiles: [],
    portrait: { src: "/portraits/hagen-lamprecht-web.jpg", alt: "Repeated test portrait", status: "approved" },
    responses: [{ id: "test", question: "Test question", answer: `Synthetic answer ${index + 1}`, status: "approved" }],
  }));
  createRoot(container).render(<MemoryRouter><PeopleDirectory people={people} /></MemoryRouter>);
}
