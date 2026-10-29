import { Link } from "react-router-dom";
import { peoplePage } from "@/content/people";
import { homeExperience } from "@/content/home";
import { peopleReview, type Researcher } from "@/content/researchers";
import { showSlots } from "../env";
import { Arrow } from "./primitives";
import "./researcher-profile.css";

export function ResearcherPortrait({ person, compact = false, preview = false }: { person: Researcher; compact?: boolean; preview?: boolean }) {
  if (person.portrait && (person.portrait.status === "approved" || showSlots || preview)) {
    return <figure className={`researcher-portrait${compact ? " researcher-portrait--compact" : ""}`}>
      <img src={person.portrait.src} alt={person.portrait.alt} width="720" height="900" loading="lazy" />
      {person.portrait.status === "draft" && <figcaption>{person.portrait.placeholder ? homeExperience.portraitLabel : peopleReview.draft}</figcaption>}
    </figure>;
  }
  if (!showSlots) return null;
  return <div className={`researcher-portrait researcher-portrait--pending${compact ? " researcher-portrait--compact" : ""}`}>
    <div><p>{peopleReview.portrait}</p>{!compact && <p>{peopleReview.portraitNote}</p>}</div>
  </div>;
}

function ResearcherLinks({ person }: { person: Researcher }) {
  return <ul className="researcher-profile-links" aria-label={`${person.name} profiles`}>
    {person.profiles.map(profile => <li key={profile.href}><a href={profile.href} target={profile.platform === "email" ? undefined : "_blank"} rel={profile.platform === "email" ? undefined : "noopener noreferrer"}>{profile.label}<Arrow direction="diagonal" /></a></li>)}
  </ul>;
}

export function ResearcherProfile({ person, preview = false }: { person: Researcher; preview?: boolean }) {
  const reviewing = showSlots || preview;
  const responses = person.responses.filter(response => response.status === "approved" || reviewing);
  const pendingPrompts = peoplePage.prompts.filter(prompt => !responses.some(response => response.question === prompt));
  const story = person.story && (person.story.status === "approved" || showSlots) ? person.story : undefined;
  const hasPortrait = Boolean(reviewing || person.portrait?.status === "approved");
  const hasWriting = Boolean(reviewing || story || responses.length || person.interests?.length || person.selectedWork?.length);
  return <article id={person.id} aria-labelledby={`${person.id}-name`} className={`researcher-profile${hasPortrait ? " researcher-profile--with-portrait" : ""}${!hasPortrait && !hasWriting ? " researcher-profile--directory" : ""}`}>
    <div className="researcher-profile-identity">
      <ResearcherPortrait person={person} preview={preview} />
      <h2 id={`${person.id}-name`}>{person.name}</h2>
      <p className="researcher-profile-role">{person.role}</p>
      <p className="researcher-profile-affiliation">{person.affiliation}</p>
      <ResearcherLinks person={person} />
    </div>
    <div className="researcher-profile-writing">
      {story && <div className={`researcher-story${story.status === "draft" ? " researcher-story--draft" : ""}`}>
        {story.status === "draft" && <p className="researcher-review-label">{peopleReview.storyDraft}</p>}
        <p className="researcher-story-text">{story.text}</p>
      </div>}
      {responses.map(response => <section key={response.id} className="researcher-response" aria-labelledby={`${person.id}-${response.id}`}>
        <h3 id={`${person.id}-${response.id}`}>{response.question}</h3>
        <p>{response.answer}</p>
        {response.status === "draft" && <p className="researcher-review-label">{peopleReview.draft}</p>}
      </section>)}
      {reviewing && pendingPrompts.length > 0 && <div className="researcher-prompt-review">
        <p className="researcher-review-label">{peopleReview.prompts}</p>
        <ul>{pendingPrompts.map(prompt => <li key={prompt}><h3>{prompt}</h3></li>)}</ul>
      </div>}
      {person.interests?.length ? <div className="researcher-authored-interests"><h3>{peoplePage.fields.interests}</h3><p>{person.interests.join(" · ")}</p></div> : null}
      {person.selectedWork?.length ? <div className="researcher-selected-work"><h3>{peoplePage.fields.work}</h3><ul>{person.selectedWork.map(work => <li key={work.href}><a href={work.href} target="_blank" rel="noopener noreferrer">{work.title}<Arrow direction="diagonal" /></a></li>)}</ul></div> : null}
    </div>
  </article>;
}

export function ResearcherPreview({ person }: { person: Researcher }) {
  const responses = person.responses.filter(response => response.status === "approved" || showSlots);
  const selected = responses.find(response => response.id === person.homepageResponseId) ?? responses[0];
  return <article className="researcher-preview">
    <Link to={`/people#${person.id}`} className="researcher-preview-person"><ResearcherPortrait person={person} compact /><h3>{person.name}<Arrow direction="diagonal" /></h3></Link>
    <p className="researcher-preview-role">{person.id === "lalith-shiyam-sundar" ? peoplePage.pi.title : person.role}</p>
    {selected ? <div className="researcher-preview-answer"><p className="researcher-preview-question">{selected.question}</p><p>{selected.answer}</p>{selected.status === "draft" && <p className="researcher-review-label">{peopleReview.draft}</p>}</div>
      : showSlots ? <div className="researcher-preview-answer researcher-preview-answer--pending"><p className="researcher-preview-question">{peoplePage.prompts[0]}</p><p className="researcher-review-label">{peopleReview.response}</p></div> : null}
  </article>;
}
