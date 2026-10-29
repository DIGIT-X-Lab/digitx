import { affiliations } from "@/data/affiliations";

/**
 * People page copy. Source: editorial/06-PEOPLE.md.
 * Never write a researcher's answers on their behalf.
 */

export const peoplePage = {
  title: "People",
  intro: "We come from different backgrounds and work on different problems. These are the people behind the research.",
  fields: {
    role: "Role",
    background: "Expertise",
    interests: "Research interests",
    work: "Selected work",
    contact: "Contact",
    profiles: "Profiles",
  },
  roster: {
    title: "Team",
    core: "Core team",
    associated: "Associated members",
    associatedMember: "Associated member",
    search: "Search people",
    placeholder: "Name, role or expertise",
    pages: "Team pages",
    previous: "Previous people",
    next: "Next people",
    empty: "No matching people.",
    clear: "Clear search",
  },
  prompts: [
    "What I'm trying to understand",
    "What I'm currently building",
    "What I haven't figured out yet",
    "What I would love to collaborate on",
  ],
  pi: {
    name: "Prof. Dr. Lalith Kumar Shiyam Sundar",
    role: "Professor of Digital Transformation in Radiology",
    title: "Professor of Digital Transformation in Radiology",
    affiliation: affiliations.radiology,
    /** Draft for PI approval. Development only until approved. */
    storyDraft:
      "Working with quantitative PET and total-body imaging taught me that collecting a rich signal and understanding what it means are different problems. Some of the tools I developed to tackle those problems began helping other researchers with questions of their own. That experience shaped how I think about scientific software. At DIGITX, we are continuing that work while asking broader questions across physiology, medical data and computational research systems.",
  },
  opportunities: {
    title: "Opportunities",
    open: "Open",
    closed: "No current openings",
    categories: [
      { id: "masters-thesis", title: "Master’s thesis projects" },
      { id: "phd", title: "PhD positions" },
      { id: "postdoc", title: "Postdoctoral positions" },
    ] as const,
  },
  slots: {
    portrait: "Authentic portrait, supplied and approved by the researcher.",
    answers: "Researcher-authored answers to the four prompts. Each person may omit or modify prompts.",
    story: "PI story: draft for PI approval. Hidden in production until approved.",
  },
};
