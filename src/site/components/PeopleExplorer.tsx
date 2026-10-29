import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { useLocation } from "react-router-dom";
import { peoplePage } from "@/content/people";
import { peopleReview, type Researcher } from "@/content/researchers";
import { institution } from "@/data/affiliations";
import { Arrow } from "./primitives";
import { FlowingMenuHighlight } from "./FlowingMenuHighlight";
import { useHoverHighlight } from "./useHoverHighlight";
import "./people-explorer.css";

function PersonPortrait({ person, preview }: { person: Researcher; preview: boolean }) {
  const portrait = person.portrait && (preview || person.portrait.status === "approved") ? person.portrait : undefined;
  return portrait ? <figure className="people-portrait"><img className={portrait.mirrored ? "people-portrait--mirrored" : undefined} src={portrait.src} alt={portrait.alt} width="720" height="900" loading="lazy" />{portrait.placeholder && <figcaption>{peopleReview.placeholder}</figcaption>}</figure> : null;
}

function PersonIdentity({ person, embedded }: { person: Researcher; embedded: boolean }) {
  const Heading = embedded ? "h3" : "h2";
  return <div className="people-person">
    <Heading id={`${person.id}-name`}>{person.name}</Heading>
    <p className="people-person-role">{person.role}</p>
  </div>;
}

function PersonExpertise({ person }: { person: Researcher }) {
  if (!person.background && !person.affiliation && person.membership !== "associated") return null;
  return <div className="people-person-details">
    {person.background && <dl className="people-person-background">
      <dt>{peoplePage.fields.background}</dt>
      <dd><span>{person.background.discipline}</span></dd>
    </dl>}
    {person.membership === "associated" && <p className="people-person-affiliation">{peoplePage.roster.associatedMember}</p>}
    {person.affiliation && <p className="people-person-affiliation">{person.affiliation.replace(`, ${institution}`, `\n${institution}`)}</p>}
  </div>;
}

function PersonLinks({ person }: { person: Researcher }) {
  return person.profiles.length ? <ul className="people-person-links" aria-label={`${person.name} profiles`}>
    {person.profiles.map(profile => <li key={profile.platform} data-platform={profile.platform}><a href={profile.href} target={profile.platform === "email" ? undefined : "_blank"} rel={profile.platform === "email" ? undefined : "noopener noreferrer"}>{profile.label}<Arrow direction="diagonal" /></a></li>)}
  </ul> : null;
}

function PersonQuestions({ person, preview, embedded, openQuestion, onOpenQuestion }: { person: Researcher; preview: boolean; embedded: boolean; openQuestion?: string | null; onOpenQuestion: (question: string | null) => void }) {
  const responses = person.responses.filter(response => preview || response.status === "approved");
  const questions = preview
    ? [...peoplePage.prompts, ...responses.map(response => response.question).filter(question => !peoplePage.prompts.includes(question))]
    : responses.map(response => response.question);
  const open = openQuestion === undefined ? questions[0] ?? null : openQuestion;
  const story = person.story && (preview || person.story.status === "approved") ? person.story : undefined;
  const Heading = embedded ? "h4" : "h3";
  return <div className="people-conversation">
    {questions.map((question, index) => {
      const answer = responses.find(response => response.question === question)?.answer;
      const expanded = open === question;
      const id = `${person.id}-question-${index}`;
      return <section className="people-question" data-open={expanded} key={question}>
        <Heading><button id={id} type="button" aria-expanded={expanded} aria-controls={`${id}-answer`} onClick={() => onOpenQuestion(expanded ? null : question)}>
          <span>{question}</span><span className="people-question-mark" aria-hidden="true" />
        </button></Heading>
        <div className="people-answer" id={`${id}-answer`} role="region" aria-labelledby={id} hidden={!expanded}>
          <p className={answer ? "people-answer-text" : "people-answer-pending"}>{answer ?? peopleReview.response}</p>
        </div>
      </section>;
    })}
    {story && <p className="people-authored-story">{story.text}</p>}
    {person.interests?.length ? <section className="people-extra"><Heading>{peoplePage.fields.interests}</Heading><p>{person.interests.join(" · ")}</p></section> : null}
    {person.selectedWork?.length ? <section className="people-extra"><Heading>{peoplePage.fields.work}</Heading><ul>{person.selectedWork.map(work => <li key={work.href}><a href={work.href} target="_blank" rel="noopener noreferrer">{work.title}<Arrow direction="diagonal" /></a></li>)}</ul></section> : null}
  </div>;
}

const ROSTER_PAGE_SIZE = 6;

export function PeopleExplorer({ people, preview = false, embedded = false }: { people: Researcher[]; preview?: boolean; embedded?: boolean }) {
  const { hash } = useLocation();
  const linkedPerson = people.find(person => `#${person.id}` === hash)?.id;
  const [selected, setSelected] = useState(linkedPerson ?? people[0]?.id);
  const [query, setQuery] = useState("");
  const [rosterPage, setRosterPage] = useState(0);
  const [openQuestions, setOpenQuestions] = useState<Record<string, string | null>>({});
  const search = useRef<HTMLInputElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout>>();
  const hoverProfile = useCallback((id: string | null) => {
    clearTimeout(hoverTimer.current);
    if (id) hoverTimer.current = setTimeout(() => setSelected(id), 120);
  }, []);
  const rosterSurface = useRef<HTMLDivElement>(null);
  const { target: highlight, exitEdge } = useHoverHighlight(rosterSurface, hoverProfile, `${query}:${rosterPage}:${people.map(person => person.id).join(",")}`);
  const profile = useRef<HTMLElement>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const selectionFrame = useRef(0);
  const focusRosterPage = useRef(false);
  useEffect(() => () => { cancelAnimationFrame(selectionFrame.current); clearTimeout(hoverTimer.current); }, []);
  // Resolve bookmarked people before the shared document anchor scroll runs.
  useLayoutEffect(() => {
    if (!linkedPerson) return;
    setSelected(linkedPerson);
    setQuery("");
    const grouped = [...people.filter(person => person.membership !== "associated"), ...people.filter(person => person.membership === "associated")];
    setRosterPage(Math.floor(grouped.findIndex(person => person.id === linkedPerson) / ROSTER_PAGE_SIZE));
  }, [linkedPerson, people]);
  useLayoutEffect(() => {
    if (!focusRosterPage.current) return;
    focusRosterPage.current = false;
    buttons.current[0]?.focus({ preventScroll: true });
    buttons.current[0]?.scrollIntoView({ block: "nearest" });
  }, [rosterPage]);
  if (!people.length) return null;
  const active = people.find(person => person.id === selected) ?? people[0];
  const term = query.trim().toLocaleLowerCase();
  const filtered = people.filter(person => `${person.name} ${person.role} ${person.roleLabel ?? ""} ${person.background?.discipline ?? ""}`.toLocaleLowerCase().includes(term));
  const allOrdered = [...filtered.filter(person => person.membership !== "associated"), ...filtered.filter(person => person.membership === "associated")];
  const pageCount = Math.max(1, Math.ceil(allOrdered.length / ROSTER_PAGE_SIZE));
  const page = Math.min(rosterPage, pageCount - 1);
  const ordered = allOrdered.slice(page * ROSTER_PAGE_SIZE, (page + 1) * ROSTER_PAGE_SIZE);
  const groups = [
    { id: "core", label: peoplePage.roster.core, people: ordered.filter(person => person.membership !== "associated") },
    { id: "associated", label: peoplePage.roster.associated, people: ordered.filter(person => person.membership === "associated") },
  ];
  const tabStop = ordered.some(person => person.id === active.id) ? active.id : ordered[0]?.id;
  const filter = (value: string) => { clearTimeout(hoverTimer.current); setQuery(value); setRosterPage(0); };
  const choose = (id: string) => {
    clearTimeout(hoverTimer.current);
    setSelected(id);
    if (!matchMedia("(max-width: 1200px)").matches) return;
    cancelAnimationFrame(selectionFrame.current);
    selectionFrame.current = requestAnimationFrame(() => {
      profile.current?.focus({ preventScroll: true });
      profile.current?.scrollIntoView({ block: "start", behavior: "instant" });
    });
  };
  const move = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const directions: Record<string, number> = { ArrowDown: 1, ArrowUp: -1 };
    const next = event.key === "Home" ? 0 : event.key === "End" ? ordered.length - 1 : event.key in directions ? (index + directions[event.key] + ordered.length) % ordered.length : undefined;
    if (next === undefined) return;
    event.preventDefault();
    clearTimeout(hoverTimer.current);
    setSelected(ordered[next].id);
    buttons.current[next]?.focus({ preventScroll: true });
    buttons.current[next]?.scrollIntoView({ block: "nearest", inline: "nearest" });
  };
  const hasWriting = preview || active.responses.some(response => response.status === "approved") || active.story?.status === "approved" || active.interests?.length || active.selectedWork?.length;
  return <div className="shell people-explorer">
    <aside className="people-roster" aria-label={peoplePage.roster.title}>
      <label className="people-search"><span className="sr-only">{peoplePage.roster.search}</span><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="6.5" /><path d="m15 15 6 6" /></svg><input ref={search} type="search" placeholder={peoplePage.roster.placeholder} value={query} onChange={event => filter(event.target.value)} onKeyDown={event => {
        if (event.key === "ArrowDown" && ordered.length) { event.preventDefault(); setSelected(ordered[0].id); buttons.current[0]?.focus(); }
        if (event.key === "Enter" && ordered.length) { event.preventDefault(); choose(ordered[0].id); }
        if (event.key === "Escape") { event.preventDefault(); filter(""); }
      }} /></label>
      {pageCount > 1 && <nav className="people-roster-pagination" aria-label={peoplePage.roster.pages}>
        <button type="button" aria-label={peoplePage.roster.previous} disabled={page === 0} onClick={() => { focusRosterPage.current = true; setRosterPage(page - 1); }}><Arrow /></button>
        <span aria-live="polite">{page * ROSTER_PAGE_SIZE + 1}–{Math.min((page + 1) * ROSTER_PAGE_SIZE, filtered.length)} / {filtered.length}</span>
        <button type="button" aria-label={peoplePage.roster.next} disabled={page === pageCount - 1} onClick={() => { focusRosterPage.current = true; setRosterPage(page + 1); }}><Arrow /></button>
      </nav>}
      <div className="people-roster-surface flowing-menu-host" ref={rosterSurface}>
      <FlowingMenuHighlight target={highlight} exitEdge={exitEdge} inset={12} />
      <div className="people-roster-list">
        {groups.filter(group => group.people.length).map(group => <div className="people-roster-group" key={group.id}>
          <p className="people-roster-group-label">{group.label}</p>
          <ul>{group.people.map(person => <li key={person.id}><button ref={element => { buttons.current[ordered.indexOf(person)] = element; }} type="button" className="people-roster-person" data-hover-item={person.id} aria-label={person.name} aria-pressed={active.id === person.id} tabIndex={person.id === tabStop ? 0 : -1} onClick={() => choose(person.id)} onKeyDown={event => move(event, ordered.indexOf(person))}>
            <span><span className="people-roster-name">{person.name}</span><span className="people-roster-role">{person.roleLabel ?? person.role}</span></span><Arrow />
          </button></li>)}</ul>
        </div>)}
        {!filtered.length && <div className="people-roster-empty"><p role="status">{peoplePage.roster.empty}</p><button type="button" onClick={() => { filter(""); search.current?.focus(); }}>{peoplePage.roster.clear}<Arrow /></button></div>}
      </div>
      </div>
    </aside>
    <article ref={profile} className={`people-profile${hasWriting ? "" : " people-profile--identity-only"}`} id={active.id} key={active.id} aria-labelledby={`${active.id}-name`} tabIndex={-1}>
      <div className={`people-profile-layout${active.profiles.length ? " people-profile-layout--links" : ""}`}>
        <PersonPortrait person={active} preview={preview} />
        <PersonIdentity person={active} embedded={embedded} />
        <PersonExpertise person={active} />
        {hasWriting && <PersonQuestions person={active} preview={preview} embedded={embedded} openQuestion={openQuestions[active.id]} onOpenQuestion={question => setOpenQuestions(previous => ({ ...previous, [active.id]: question }))} />}
        <PersonLinks person={active} />
      </div>
    </article>
  </div>;
}
