import { homePeoplePreview } from "./home-people-preview";
import { peoplePage } from "./people";
import { researchers, type Researcher } from "./researchers";

/** Existing review material, kept separate from researcher-authored records. */
export const previewResearchers: Researcher[] = researchers.map(person => {
  const sample = homePeoplePreview[person.id];
  if (!sample) return person;
  return {
    ...person,
    story: undefined,
    portrait: person.portrait ?? {
      src: sample.portrait,
      alt: `Fictional portrait placeholder for the ${person.name} profile; not their likeness`,
      status: "draft",
      placeholder: true,
    },
    responses: person.responses.length ? person.responses : [{
      id: "understand-preview",
      question: peoplePage.prompts[0],
      answer: sample.response,
      status: "draft",
    }],
  };
});
