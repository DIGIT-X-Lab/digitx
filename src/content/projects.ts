/**
 * Funded projects. Source: editorial/04-PROJECTS.md, rendered verbatim.
 * Funded projects with confirmed current or upcoming status. No Vienna-era grants or unsubmitted proposals.
 * Unverified fields are omitted in production; their notes show in development.
 */

import type { AreaId } from "./research";

export interface ProjectField {
  label: string;
  value?: string;
  /** Explicit connection to the software developed through this project. */
  toolSlug?: string;
  /** Development-only note when the value is not yet verified. */
  verify?: string;
}

export interface Project {
  id: string;
  name: string;
  descriptor: string;
  body: string;
  fields: ProjectField[];
  areas: AreaId[];
}

export const projectsPage = {
  title: "Funded projects",
  intro: "We pursue research problems worth solving. Through grant-funded projects, we develop and test ideas that could move the field forward.",
};

export const projectsExperience = {
  starts: "Starts",
  current: "In progress",
  explore: "explore",
  pause: "Pause animation",
  play: "Play animation",
  identities: {
    kepler: { label: "KEPLER's flowing ivory wave" },
    arche: { label: "The Lumos mascot" },
    brezn: { label: "GALAH's ivory wireframe bird portrait" },
  } as Record<string, { label: string }>,
};

export const projects: Project[] = [
  {
    id: "kepler",
    name: "KEPLER",
    descriptor: "Investigating AI-enabled adaptation of radiology models.",
    body: "KEPLER is a ZIM-funded collaboration with deepc that will investigate an LLM-based system for adapting radiology foundation models for X-ray and CT on site, with checks built into the workflow.",
    fields: [
      { label: "Funding", value: "ZIM" },
      { label: "Partners", value: "deepc" },
      { label: "Starts", value: "January 2027" },
      { label: "Status", value: "Funded, upcoming" },
      { label: "Public outputs", verify: "Link only to publicly cleared results. Autonomous fine-tuning is not yet validated." },
    ],
    areas: ["systems"],
  },
  {
    id: "arche",
    name: "ARCHE",
    descriptor: "Making multimodal theranostics data usable for computational research.",
    body: "ARCHE, supported by ICPO, addresses the structuring of multimodal data in theranostics. Lumos is the software developed through this project.",
    fields: [
      { label: "Funding", value: "ICPO" },
      { label: "Partners", verify: "Collaborators and their permission to be named." },
      { label: "Period", verify: "Project dates." },
      { label: "Status", value: "Funded, running" },
      { label: "Software", value: "Lumos", toolSlug: "lumos" },
    ],
    areas: ["computable"],
  },
  {
    id: "brezn",
    name: "BREZN",
    descriptor: "Investigating AI-assisted lung cancer staging across Bavarian centres.",
    body: "BREZN is a BZKF-supported collaboration addressing lung cancer staging across participating centres. GALAH is the software developed through this project. The work is intended to contribute data relevant to the forthcoming tenth edition of the TNM staging system.",
    fields: [
      { label: "Funding", value: "BZKF" },
      { label: "Partners", verify: "Participating centres and their permission to be named." },
      { label: "Period", verify: "Project dates." },
      { label: "Status", value: "Funded, running" },
      { label: "Software", value: "GALAH", toolSlug: "galah" },
    ],
    areas: ["computable"],
  },
];
