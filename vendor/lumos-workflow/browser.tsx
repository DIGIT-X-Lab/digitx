import React from "react";
import { createRoot } from "react-dom/client";
import { Intake, Extraction } from "./src/frontier/Walkthrough";
import { Research } from "./src/frontier/Research";
import type { Study } from "./src/frontier/FilmKit";

/** The original v8 HTML scenes, sampled at the same excerpts as the approved
 * highlights. Only the presentation clock and viewport are adapted for the site. */
declare global { interface Window { remotion_staticFiles: { name: string; src: string }[] } }
window.remotion_staticFiles = ["lumos-logo.svg", "source-report.png"].map(name => ({ name, src: new URL(name, location.href).href }));
const root = createRoot(document.getElementById("scene")!);
const study: Study = await fetch("./study.json").then(response => response.json());
let time = 0;
function render() {
  const component = time < 3.8 ? <Intake t={time + 1} study={study} />
    : time < 4.3 ? <Intake t={time + 1.7} study={study} />
    : time < 10.6 ? <Extraction t={time - 4.3} study={study} />
    : time < 14.9 ? <Extraction t={time - 3} study={study} />
    : <Research t={time - 11.9} study={study} />;
  root.render(component);
  document.documentElement.dataset.chapter = time < 3.8 ? "documents" : time < 10.6 ? "extraction" : time < 14.9 ? "source" : "analysis";
}
function fit() {
  // Shell spans y=92..1038 in the original 1920×1080 composition. Fit the entire
  // application, including its top breadcrumb and lower controls, without cropping.
  const scale = Math.min(innerWidth / 1920, innerHeight / 946);
  const scene = document.getElementById("scene")!;
  scene.style.transform = `translate(${(innerWidth - 1920 * scale) / 2}px, ${(innerHeight - 946 * scale) / 2 - 92 * scale}px) scale(${scale})`;
}
window.addEventListener("resize", fit);
window.addEventListener("message", event => {
  if (event.source !== parent || event.origin !== location.origin || event.data?.type !== "lumos:frame") return;
  if (!Number.isFinite(event.data.time)) return;
  time = Math.max(0, Math.min(24.7, event.data.time));
  render();
});
await document.fonts.load("400 28px Inter");
fit(); render();
parent.postMessage({ type: "lumos:ready" }, location.origin);
