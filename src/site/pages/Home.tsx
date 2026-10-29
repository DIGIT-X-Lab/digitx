import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { home, homeExperience as copy } from "@/content/home";
import { publications } from "@/data/publications";
import { ArrowLink, Arrow } from "../components/primitives";
import { ResearchStory } from "../components/ResearchStory";
import { HomeObservations } from "../components/HomeObservations";
import { HomeHeroVisual } from "../components/HomeHeroVisual";
import { HeroPressureText } from "../components/HeroPressureText";
import { useHeroSequence } from "../components/useHeroSequence";
import { HomeTools } from "../components/HomeTools";
import { HomePeople } from "../components/HomePeople";
import { formatAuthors, venueName } from "../format";
import "./home.css";

function PlayIcon() {
  return <svg viewBox="0 0 20 20" width="20" height="20" fill="none" aria-hidden="true"><path d="M6 4L16 10L6 16V4Z" fill="currentColor" /></svg>;
}

/** The approved opening, shared with the continuous site without repeating its examples. */
export function HomeHero({ reviewPreview = false }: { reviewPreview?: boolean } = {}) {
  const { opening } = home;
  const questionBreak = opening.title.indexOf(" when ");
  const sequence = useHeroSequence({ navigationAware: reviewPreview });
  return <div className="home-page">
    <section ref={sequence.root} id="home" data-site-section="home" className="home-hero-sequence" aria-labelledby="home-title" tabIndex={-1}>
      <div ref={sequence.stage} className="home-hero shell">
      <div className="home-hero-copy">
        <p className="home-affiliation">{opening.eyebrow.split(" · ").map((part, index) => <span key={part}>{index > 0 && <span className="home-affiliation-separator"> · </span>}{part}</span>)}</p>
        <h1 id="home-title" tabIndex={-1}>
          <span className="home-question-main">{opening.titleLines.map((line, index) => <span className="home-question-line" key={line}>{index > 0 && " "}{index === opening.titleLines.length - 1 ? <>{line.slice(0, line.indexOf(opening.titleHighlight))}<span className="home-question-highlight"><HeroPressureText text={opening.titleHighlight} outline autoShine /></span></> : line}</span>)}</span>{" "}
          <span className="home-question-condition">{opening.title.slice(questionBreak + 1)}</span>
        </h1>
        <div className="home-hero-bottom">
          <div className="home-actions">
            <Link to={opening.link.to} className="home-research-action"><span>{opening.link.label}</span><Arrow /></Link>
            <Link to={opening.toolsLink.to} className="home-tools-action"><span>{opening.toolsLink.label}</span><Arrow /></Link>
          </div>
        </div>
      </div>
      <div className="home-hero-intro" aria-hidden="true">
        <p className="home-intro-question"><span>{opening.intro.lead}</span><span className="home-intro-focus"><HeroPressureText text={opening.intro.focus} /></span></p>
        <div className="home-intro-subject"><p><span>{opening.intro.bridge}</span><span className="home-intro-focus"><HeroPressureText text={opening.intro.subject} outline /></span></p><p className="home-intro-condition">{opening.title.slice(questionBreak + 1)}</p></div>
      </div>
      <HomeHeroVisual ref={sequence.visual} onUnavailable={sequence.artworkUnavailable} />
      <button type="button" className="home-hero-scroll-cue" onClick={sequence.revealQuestion} aria-label={copy.heroVisual.revealQuestion}><span>{copy.heroVisual.scrollCue}</span><Arrow direction="down" /></button>
      </div>
    </section>
  </div>;
}

export default function Home() {
  const { opening, idea, opportunity, contributions, record, people, invitation } = home;
  const [watching, setWatching] = useState(false);
  const player = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!watching) return;
    player.current?.scrollIntoView({ block: "start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    player.current?.focus({ preventScroll: true });
  }, [watching]);
  const close = () => {
    setWatching(false);
    requestAnimationFrame(() => {
      trigger.current?.focus({ preventScroll: true });
      trigger.current?.scrollIntoView({ block: "center", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    });
  };

  return <div className="home-page">
    <HomeHero />

    <section className="home-section home-computability-section shell" id="computability" aria-labelledby="computability-title">
      <div className="home-section-heading"><h2 id="computability-title">{idea.title}</h2><div>{idea.body.map(p => <p key={p}>{p}</p>)}</div></div>
      <HomeObservations />
    </section>

    <section className={`home-film-section shell${watching ? " is-watching" : ""}`} id="approach" aria-labelledby="approach-title">
      <div className="home-opportunity-introduction"><h2 id="approach-title">{opportunity.title}</h2><div>{opportunity.body.map(p => <p key={p}>{p}</p>)}</div></div>
      <div className="home-film-feature">
        <p className="home-mission">{opening.mission.join(" ")}</p>
        <div className="home-film-preview"><button ref={trigger} type="button" className="home-film-poster" onClick={() => setWatching(true)} aria-expanded={watching} aria-controls="home-film-player">
          <img src="/illustrations/story/connected-records.png" alt="" width="2220" height="1200" loading="lazy" />
          <span className="home-film-play"><PlayIcon /></span>
          <span className="home-film-caption"><span>{copy.watch}</span><span>{copy.duration}<Arrow direction="diagonal" /></span></span>
        </button><p className="home-film-provenance">{copy.filmProvenance}</p></div>
      </div>
      {watching && <div className="home-film-player" id="home-film-player" ref={player} tabIndex={-1} role="region" aria-label={copy.watch}>
        <div className="home-film-player-heading"><p>{copy.watch}</p><button type="button" onClick={close}>{copy.close}<span aria-hidden="true">×</span></button></div>
        <ResearchStory />
      </div>}
    </section>

    <section className="home-section home-software-section shell" id="tools" aria-labelledby="tools-title">
      <div className="home-section-heading"><div><p className="home-eyebrow">{copy.softwareLabel}</p><h2 id="tools-title">{contributions.title}</h2></div><div><p>{contributions.body}</p><ArrowLink to={contributions.link.to}>{contributions.link.label}</ArrowLink></div></div>
      <HomeTools />
    </section>

    <section className="home-reading-section" aria-labelledby="record-title"><div className="shell home-reading-grid">
      <div><p className="home-eyebrow">{record.label}</p><h2 id="record-title">{record.title}</h2><p className="home-reading-intro">{record.body}</p><div className="home-reading-links">{record.links.map(link => <ArrowLink key={link.to} to={link.to}>{link.label}</ArrowLink>)}</div></div>
      <ol className="home-papers">{publications.slice(0, 3).map(p => <li key={p.paperId}><p className="home-paper-meta">{venueName(p.venue)}{p.year ? ` · ${p.year}` : ""}</p><h3>{p.sourceUrl ? <a href={p.sourceUrl} target="_blank" rel="noopener noreferrer">{p.title}<Arrow direction="diagonal" /></a> : p.title}</h3><p className="home-paper-authors">{formatAuthors(p.authors)}</p></li>)}</ol>
    </div></section>

    <section className="home-section home-team-section shell" id="people" aria-labelledby="people-title">
      <div className="home-section-heading"><div><p className="home-eyebrow">{people.label}</p><h2 id="people-title">{people.title}</h2></div><ArrowLink to={people.link.to}>{people.link.label}</ArrowLink></div>
      <HomePeople />
    </section>

    <section className="home-contact-section shell" aria-labelledby="invitation-title"><div className="home-contact-inner"><div><p className="home-eyebrow">{invitation.label}</p><h2 id="invitation-title">{invitation.title}</h2></div><div><p>{invitation.body}</p><p className="home-listen">{invitation.final}</p><Link to={invitation.link.to} className="home-button">{invitation.link.label}<Arrow direction="diagonal" /></Link></div></div></section>
  </div>;
}
