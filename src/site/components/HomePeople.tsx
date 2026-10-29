import { Link } from "react-router-dom";
import { researchers } from "@/content/researchers";
import { homePeoplePreview } from "@/content/home-people-preview";
import { homeExperience as copy } from "@/content/home";
import { Arrow } from "./primitives";

export function HomePeople() {
  return <><div className="home-people-grid">{researchers.map(person => {
    const preview = homePeoplePreview[person.id];
    return <article className="home-person" key={person.id}>
      <Link to={`/people#${person.id}`} className="home-person-identity">
        <figure><img src={preview.portrait} alt={`Fictional portrait placeholder for the ${person.name} profile; not their likeness`} width="1024" height="1280" loading="lazy" /><figcaption>{copy.portraitLabel}</figcaption></figure>
        <h3>{person.name}<Arrow direction="diagonal" /></h3>
      </Link>
      <p className="home-person-role">{person.role}</p>
      <div className="home-person-response"><p>{copy.previewQuestion}</p><blockquote>{preview.response}</blockquote><span>{copy.responseLabel}</span></div>
    </article>;
  })}</div><p className="home-people-disclosure">{copy.peoplePreview}</p></>;
}
