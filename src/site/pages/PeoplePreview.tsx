import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PeopleOriginalPreview from "./PeopleOriginalPreview";
import { Arrow, ArrowLink } from "../components/primitives";
import PeopleGridPrototype from "./PeopleGridPrototype";
import { showPeoplePreview } from "../env";

const variants = ["grid", "compact", "current"] as const;

/** Same composition as the main section, using isolated review data. */
export default function PeoplePreview() {
  const [params, setParams] = useSearchParams();
  const variant = params.get("variant");
  const prototyping = (import.meta.env.DEV || showPeoplePreview) && variants.some(item => item === variant);
  const change = (value: string) => { setParams({ variant: value }, { replace: true }); window.scrollTo({ top: 0, behavior: "instant" }); };
  useEffect(() => {
    if (!prototyping) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.target instanceof HTMLElement && event.target.closest("input, textarea, select, button, a, [contenteditable]")) return;
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const offset = event.key === "ArrowLeft" ? -1 : 1;
      setParams({ variant: variants[(variants.findIndex(item => item === variant) + offset + variants.length) % variants.length] }, { replace: true });
      window.scrollTo({ top: 0, behavior: "instant" });
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [prototyping, variant, setParams]);
  useEffect(() => {
    const existing = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const robots = existing ?? document.createElement("meta");
    const previous = robots.content;
    robots.name = "robots"; robots.content = "noindex, nofollow";
    if (!existing) document.head.append(robots);
    return () => { if (existing) robots.content = previous; else robots.remove(); };
  }, []);
  return <>
    {prototyping && (variant === "grid" || variant === "compact") ? <PeopleGridPrototype key={variant} variant={variant} /> : <><PeopleOriginalPreview preview opportunities={false} /><div className="shell page-section"><ArrowLink to="/#people">Back to the site</ArrowLink></div></>}
    {prototyping && <nav className="pg-switcher" aria-label="People design mockups"><span>Mockup</span>
      <button className="pg-switch-arrow" aria-label="Previous design" onClick={() => change(variants[(variants.findIndex(item => item === variant) + 2) % 3])}><span className="pg-reverse"><Arrow /></span></button>
      {variants.map((value, index) => <button key={value} aria-pressed={variant === value} onClick={() => change(value)}>{["Portrait grid", "Compact", "Original"][index]}</button>)}
      <button className="pg-switch-arrow" aria-label="Next design" onClick={() => change(variants[(variants.findIndex(item => item === variant) + 1) % 3])}><Arrow /></button>
    </nav>}
  </>;
}
