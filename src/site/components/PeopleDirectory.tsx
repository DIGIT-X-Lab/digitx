import { useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, MotionConfig, motion, useReducedMotion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { researchers, type Researcher } from "@/content/researchers";
import { peoplePage } from "@/content/people";
import { Arrow, Tape } from "./primitives";
import { FlowingMenuHighlight } from "./FlowingMenuHighlight";
import { useHoverHighlight } from "./useHoverHighlight";
import "./people-directory.css";

type Group = "all" | "core" | "associated";
const PAGE_SIZE = 6;

function Portrait({ person }: { person: Researcher }) {
  if (!person.portrait || person.portrait.status !== "approved") return null;
  const mirrored = person.portrait.mirrored;
  return <motion.span layoutId={`portrait-${person.id}`} className="pg-portrait">
    <img loading="lazy" width="720" height="900" src={person.portrait.src} alt={person.portrait?.alt ?? person.name} className={mirrored ? "pg-mirrored" : undefined} />
  </motion.span>;
}

function ProfileLinks({ person }: { person: Researcher }) {
  return <div className="pg-links">{person.profiles.map(link => <a key={link.platform} href={link.href} aria-label={`${person.name}: ${link.label}`} target={link.platform === "email" ? undefined : "_blank"} rel={link.platform === "email" ? undefined : "noopener noreferrer"}>{link.label}<Arrow direction="diagonal" /></a>)}</div>;
}

function CompactPerson({ person, onOpen, embedded }: { person: Researcher; onOpen: () => void; embedded: boolean }) {
  const Heading = embedded ? "h3" : "h2";
  return <article className="pg-person-card pg-compact-person">
    <Portrait person={person} />
    <div className="pg-card-identity">
      <Heading><button className="pg-profile-trigger pg-card-name" data-person={person.id} data-hover-item={person.id} onClick={onOpen} aria-label={`Read ${person.name}’s profile`}><span className="pg-name-text" data-hover-target>{person.name}</span><Arrow direction="diagonal" /></button></Heading>
      <p className="pg-card-role">{person.roleLabel ?? person.role}</p>
      {person.membership === "associated" && <p className="pg-card-membership">Associated member</p>}
      <ProfileLinks person={person} />
    </div>
  </article>;
}

function CompactPeopleCards({ people, embedded, onOpen }: { people: Researcher[]; embedded: boolean; onOpen: (id: string) => void }) {
  const cards = useRef<HTMLDivElement>(null);
  const highlight = useHoverHighlight(cards, undefined, people.map(person => person.id).join(","));
  return <div ref={cards} className="pg-cards flowing-menu-host">
    {people.map(person => <CompactPerson key={person.id} person={person} embedded={embedded} onOpen={() => onOpen(person.id)} />)}
    <FlowingMenuHighlight target={highlight.target} exitEdge={highlight.exitEdge} />
  </div>;
}

function Profile({ person, question, onQuestion, onClose, onPrevious, onNext, embedded, canNavigate }: {
  person: Researcher; embedded: boolean; canNavigate: boolean; question: number; onQuestion: (index: number) => void;
  onClose: () => void; onPrevious: () => void; onNext: () => void;
}) {
  const title = useRef<HTMLHeadingElement>(null);
  const Heading = embedded ? "h3" : "h1";
  const QuestionHeading = embedded ? "h4" : "h2";
  const approved = person.responses.filter(answer => answer.status === "approved");
  useLayoutEffect(() => { title.current?.focus({ preventScroll: true }); }, [person.id]);
  return <div className="pg-expanded" id={person.id} onKeyDown={event => { if (event.key === "Escape") onClose(); }}>
    <div className="pg-profile-controls">
      <button className="pg-back" onClick={onClose}><span className="pg-reverse"><Arrow /></span>All people</button>
      {canNavigate && <div className="pg-neighbours">
        <button aria-label="Previous person" onClick={onPrevious}><span className="pg-reverse"><Arrow /></span></button>
        <button aria-label="Next person" onClick={onNext}><Arrow /></button>
      </div>}
    </div>
    <motion.div className="pg-profile-heading" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <p className="pg-membership">{person.membership === "associated" ? "Associated member" : "Core team"}</p>
      <Heading className="pg-profile-name" tabIndex={-1} ref={title} aria-label={person.greeting ? person.name : undefined}>{person.greeting ?? person.name}</Heading>
      <p>{person.role}</p>
    </motion.div>
    <div className={`pg-detail-layout${approved.length ? "" : " pg-detail-layout--identity"}`}>
      <div className="pg-detail-identity">
        <Portrait person={person} />
        <dl><dt>Expertise</dt><dd>{person.background?.discipline}</dd></dl>
        <p className="pg-affiliation">{person.affiliation.replace(", LMU University Hospital", "\nLMU University Hospital")}</p>
        <ProfileLinks person={person} />
      </div>
      {approved.length > 0 && <div className="pg-questions">{approved.map((answer, index) => <section className="pg-question" key={answer.id}>
        <QuestionHeading><button aria-expanded={question === index} aria-controls={`pg-answer-${person.id}-${answer.id}`} onClick={() => onQuestion(question === index ? -1 : index)}><span>{answer.question}</span><span className="pg-question-symbol" aria-hidden="true">{question === index ? "−" : "+"}</span></button></QuestionHeading>
        <div id={`pg-answer-${person.id}-${answer.id}`} hidden={question !== index} className="pg-answer"><p>{answer.answer}</p></div>
      </section>)}</div>}
    </div>
  </div>;
}

/** Approved browse-first People section; the grid variant remains available for design comparison. */
export function PeopleDirectory({ people = researchers, variant = "compact", embedded = false, preview = false }: {
  people?: Researcher[]; variant?: "grid" | "compact"; embedded?: boolean; preview?: boolean;
}) {
  const { hash, key } = useLocation();
  const linkedPerson = people.find(item => `#${item.id}` === hash)?.id;
  const [group, setGroup] = useState<Group>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<string | null>(linkedPerson ?? null);
  const [openQuestions, setOpenQuestions] = useState<Record<string, number>>({});
  const savedScroll = useRef(0);
  const lastSelected = useRef<string | null>(null);
  const root = useRef<HTMLElement>(null);
  const returning = useRef(false);
  const changingPage = useRef(false);
  const reducedMotion = useReducedMotion();
  const term = query.trim().toLocaleLowerCase();
  const matches = people.filter(person => (group === "all" || person.membership === group)
    && `${person.name} ${person.role} ${person.roleLabel ?? ""} ${person.background?.discipline ?? ""}`.toLocaleLowerCase().includes(term));
  const pages = Math.max(1, Math.ceil(matches.length / PAGE_SIZE));
  const visible = matches.slice(Math.min(page, pages - 1) * PAGE_SIZE, (Math.min(page, pages - 1) + 1) * PAGE_SIZE);
  const person = people.find(item => item.id === selected);
  const open = (id: string) => {
    savedScroll.current = window.scrollY;
    lastSelected.current = id;
    setSelected(id);
  };
  const close = () => {
    returning.current = true;
    setSelected(null);
  };
  const neighbour = (offset: number) => {
    const index = matches.findIndex(item => item.id === selected);
    const next = matches[(index + offset + matches.length) % matches.length];
    if (next) setSelected(next.id);
  };
  const changePage = (next: number) => {
    changingPage.current = true;
    setPage(next);
  };
  useLayoutEffect(() => {
    if (linkedPerson) {
      setGroup("all");
      setQuery("");
      setPage(Math.floor(people.findIndex(item => item.id === linkedPerson) / PAGE_SIZE));
      lastSelected.current = linkedPerson;
      setSelected(linkedPerson);
    } else if (hash === "#people") {
      setSelected(null);
    }
  }, [linkedPerson, hash, key, people]);
  useLayoutEffect(() => {
    if (selected) {
      root.current?.scrollIntoView({ block: "start", behavior: "instant" });
    } else if (returning.current) {
      returning.current = false;
      if (savedScroll.current) window.scrollTo({ top: savedScroll.current, behavior: "instant" });
      else root.current?.scrollIntoView({ block: "start", behavior: "instant" });
      root.current?.querySelector<HTMLButtonElement>(`[data-person="${lastSelected.current}"]`)?.focus({ preventScroll: true });
    }
  }, [selected]);
  useLayoutEffect(() => {
    if (!changingPage.current) return;
    changingPage.current = false;
    root.current?.querySelector<HTMLButtonElement>("[data-person]")?.focus({ preventScroll: true });
    root.current?.querySelector(".pg-browse-controls")?.scrollIntoView({ block: "start", behavior: "instant" });
  }, [page]);
  if (!people.length) return null;

  return <MotionConfig reducedMotion="user"><LayoutGroup id={`people-directory-${variant}`}><motion.section ref={root} className={`shell pg-root pg-root--${variant}${preview ? " pg-root--preview" : ""}`} transition={{ layout: { duration: reducedMotion ? 0 : .48, ease: [.16, 1, .3, 1] } }}>
    {person && <h2 id="people-title" className="sr-only">{peoplePage.title}</h2>}
    <AnimatePresence initial={false} mode="popLayout">
      {person ? <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : .22 }}>
        <Profile embedded={embedded} canNavigate={matches.length > 1} person={person} question={openQuestions[person.id] ?? 0} onQuestion={index => setOpenQuestions(previous => ({ ...previous, [person.id]: index }))} onClose={close} onPrevious={() => neighbour(-1)} onNext={() => neighbour(1)} />
      </motion.div> : <motion.div key="browse" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : .2 }}>
        <header className="pg-opening"><Tape as={embedded ? "h2" : "h1"} id="people-title" size="display">{peoplePage.title}</Tape><p className="page-lead">{peoplePage.intro}</p></header>
        <div className="pg-browse-controls">
          <div className="pg-filters" role="group" aria-label="Team membership">{([['all', 'Everyone'], ['core', 'Core team'], ['associated', 'Associated members']] as const).map(([value, label]) => <button key={value} aria-pressed={group === value} onClick={() => { setGroup(value); setPage(0); }}>{label}</button>)}</div>
          <label className="pg-search"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="6.5" /><path d="m15 15 6 6" /></svg><span className="sr-only">Search people</span><input type="search" value={query} placeholder="Name, role or expertise" onChange={event => { setQuery(event.target.value); setPage(0); }} /></label>
        </div>
        {variant === "compact" ? <CompactPeopleCards people={visible} embedded={embedded} onOpen={open} /> : <div className="pg-cards">{visible.map(item => <button className="pg-person-card" key={item.id} data-person={item.id} onClick={() => open(item.id)} aria-label={`Read ${item.name}’s profile`}>
          <Portrait person={item} />
          <span className="pg-card-identity"><span className="pg-card-name"><span className="pg-name-text">{item.name}</span><Arrow direction="diagonal" /></span><span className="pg-card-role">{item.roleLabel ?? item.role}</span>{item.membership === "associated" && <span className="pg-card-membership">Associated member</span>}</span>
        </button>)}</div>}
        {visible.length === 0 && <div className="pg-empty"><p role="status">No matching people.</p><button onClick={() => { setQuery(""); setGroup("all"); }}>Clear search and filters<Arrow /></button></div>}
        {pages > 1 && <nav className="pg-pagination" aria-label="Team pages"><button aria-label="Previous people" disabled={page === 0} onClick={() => changePage(page - 1)}><span className="pg-reverse"><Arrow /></span></button><span aria-live="polite">{page + 1} / {pages}</span><button aria-label="Next people" disabled={page === pages - 1} onClick={() => changePage(page + 1)}><Arrow /></button></nav>}
      </motion.div>}
    </AnimatePresence>
  </motion.section></LayoutGroup></MotionConfig>;
}
