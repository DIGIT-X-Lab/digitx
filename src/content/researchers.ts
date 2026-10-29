import { teamMembers } from "@/data/team";
import { peoplePage } from "./people";

/** Identity and profile links are retained from the PI-supplied roster.
 * Researcher-authored material is separate from the old site's bios and tags.
 * Add only material supplied by its author; keep drafts out of production.
 */
export interface ResearcherResponse {
  id: string;
  question: string;
  answer: string;
  status: "draft" | "approved";
}

export interface Researcher {
  id: string;
  name: string;
  greeting?: string;
  role: string;
  roleLabel?: string;
  background?: { discipline: string };
  membership?: "core" | "associated";
  affiliation: string;
  profiles: { platform: "github" | "linkedin" | "scholar" | "email"; label: string; href: string }[];
  portrait?: { src: string; alt: string; status: "draft" | "approved"; placeholder?: boolean; mirrored?: boolean };
  responses: ResearcherResponse[];
  homepageResponseId?: string;
  story?: { text: string; status: "draft" | "approved" };
  interests?: string[];
  selectedWork?: { title: string; href: string }[];
}

/** Researcher answers supplied or explicitly approved by the PI on 29 October 2026.
 * Preserve the approved wording, including the distinction between a goal and a result.
 */
const authoredResponses: Record<string, ResearcherResponse[]> = {
  "lalith-shiyam-sundar": [
    {
      id: "understand",
      question: peoplePage.prompts[0],
      answer: "How the body’s many parts work together, and what changes when things go wrong. We collect extraordinary amounts of information about people. I’m curious about how much more we could understand if we could connect those pieces.",
      status: "approved",
    },
    {
      id: "building",
      question: peoplePage.prompts[1],
      answer: "A lab where people from different backgrounds can follow a good question somewhere unexpected. My own path has taken a few turns, so I have a soft spot for that. It’s my first lab, and I’m learning too. I want people to be happy here, to know their ideas can change our direction, and to feel comfortable saying “I don’t understand this yet.” Preferably before I have to admit the same.",
      status: "approved",
    },
    {
      id: "unanswered",
      question: peoplePage.prompts[2],
      answer: "How to build the lab I just described. I know how I’d like people to feel here; I’m still learning what I need to do to make that happen. When to help, when to step back, and how to notice when someone needs something they haven’t asked for.",
      status: "approved",
    },
    {
      id: "collaborate",
      question: peoplePage.prompts[3],
      answer: "I’d love to work with clinicians on the things that make them say, “I wish we could…” I like building things, and I get excited about what new imaging and computing technologies might let us do. I’d want to sit down with you, understand what would actually help, and see what we can make work. I won’t necessarily know how at the start. That’s part of what makes it interesting.",
      status: "approved",
    },
  ],
  "hagen-lamprecht": [
    {
      id: "understand",
      question: peoplePage.prompts[0],
      answer: "Can frontier AI models do the work of a medical AI researcher, and help us build the next generation of medical AI?",
      status: "approved",
    },
    {
      id: "building",
      question: peoplePage.prompts[1],
      answer: "In a sense, I’m trying to replace myself. Through KEPLER, I’m working towards AI systems that can develop medical AI models themselves, taking on work that currently needs researchers like me. I want to find out how far frontier models can go, and how we can tell whether they’re doing the work well. Ideally, I’ll have to find myself a new problem to work on.",
      status: "approved",
    },
    {
      id: "unanswered",
      question: peoplePage.prompts[2],
      answer: "What is really worth automating, and where are the limits?",
      status: "approved",
    },
    {
      id: "collaborate",
      question: peoplePage.prompts[3],
      answer: "Projects where we can put that ambition to the test. I’d like to work with people developing medical AI and explore what an AI researcher could contribute, where it gets stuck, and what we can learn from both.",
      status: "approved",
    },
  ],
  "peter-benedict-schildberg": [
    {
      id: "understand",
      question: peoplePage.prompts[0],
      answer: "How much more can we learn about disease when we connect what happened to a patient, when it happened, and what followed? I’m interested in what AI could help us understand when we preserve that history.",
      status: "approved",
    },
    {
      id: "building",
      question: peoplePage.prompts[1],
      answer: "I’m building LUMOS to turn scattered clinical records into connected patient histories. We represent these as temporal graphs, linking clinical events and keeping track of how they unfold over time. I want to explore whether those connections help us understand disease better.",
      status: "approved",
    },
    {
      id: "unanswered",
      question: peoplePage.prompts[2],
      answer: "When is extracting the facts enough, and when do we need to reason about how they connect over time? I’m still working out how to tell whether a more complete history gives us a more useful understanding.",
      status: "approved",
    },
    {
      id: "collaborate",
      question: peoplePage.prompts[3],
      answer: "I’d like to work with clinicians and researchers on questions where the patient’s history matters. What would you want to understand if you could follow the whole story across reports, scans and years of care? Those are the questions I’d like to bring to our work on temporal graphs and AI.",
      status: "approved",
    },
  ],
  "maissa-monsour": [
    {
      id: "understand",
      question: peoplePage.prompts[0],
      answer: "What becomes possible when AI learns medicine the way clinicians do, by combining every source of information, and uses that knowledge to look ahead.",
      status: "approved",
    },
    {
      id: "building",
      question: peoplePage.prompts[1],
      answer: "I’m building multimodal AI that brings different types of medical data together into one coherent picture of each patient, so that we can move from describing disease to predicting how it will develop. Alongside this, I’m developing autonomous AI agents that read medical images, apply established clinical guidelines and turn their findings into structured assessments. These agents are designed to adapt as medical knowledge and guidelines evolve, so that their results stay consistent, transparent and trustworthy over time.",
      status: "approved",
    },
    {
      id: "unanswered",
      question: peoplePage.prompts[2],
      answer: "How do we know when an AI system is truly ready to be trusted in clinical practice?",
      status: "approved",
    },
    {
      id: "collaborate",
      question: peoplePage.prompts[3],
      answer: "Projects that open the black box of medical AI, where every prediction comes with reasoning a clinician can understand, question and trust.",
      status: "approved",
    },
  ],
  "frederic-paul-thiele": [
    {
      id: "understand",
      question: peoplePage.prompts[0],
      answer: "How to transform the enormous amount of clinical knowledge buried in medical records into a computable representation of human disease?",
      status: "approved",
    },
    {
      id: "building",
      question: peoplePage.prompts[1],
      answer: "What aims to become the largest multimodal, longitudinal Neuro-Oncology dataset to date, powered by our own AI-driven data extraction infrastructure.",
      status: "approved",
    },
    {
      id: "unanswered",
      question: peoplePage.prompts[2],
      answer: "How to move beyond extracting individual facts toward reconstructing complete patient histories. At scale.",
      status: "approved",
    },
    {
      id: "collaborate",
      question: peoplePage.prompts[3],
      answer: "Combining our fragmented, underutilized clinical datasets and making them computable with AI - so we can finally uncover the answers to brain tumors that have been hiding in our own data all along.",
      status: "approved",
    },
  ],
};

/** PI-approved greetings for opened profiles; directory names stay canonical. */
const profileGreetings: Partial<Record<string, string>> = {
  "lalith-shiyam-sundar": "Hi, I’m Lalith.",
  "hagen-lamprecht": "Hi, I’m Hagen.",
  "peter-benedict-schildberg": "Hi, I’m Bene.",
  "maissa-monsour": "Hi, I’m Maissa.",
  "maximilian-tiling": "Hi, I’m Max.",
  "frederic-paul-thiele": "Hi, I’m Frederic.",
};

export const researchers: Researcher[] = teamMembers.map(member => ({
  id: member.id,
  name: member.id === "lalith-shiyam-sundar" ? peoplePage.pi.name : member.name,
  greeting: profileGreetings[member.id],
  role: member.id === "lalith-shiyam-sundar" ? peoplePage.pi.role : member.role,
  roleLabel: member.label,
  background: member.background,
  membership: member.membership ?? "core",
  affiliation: member.id === "lalith-shiyam-sundar" ? peoplePage.pi.affiliation : member.university,
  portrait: member.portrait,
  profiles: [
    { platform: "github" as const, label: "GitHub", href: member.github },
    { platform: "linkedin" as const, label: "LinkedIn", href: member.linkedin },
    { platform: "scholar" as const, label: "Google Scholar", href: member.scholar },
    { platform: "email" as const, label: "Email", href: member.email ? `mailto:${member.email}` : undefined },
  ].filter((profile): profile is Researcher["profiles"][number] => Boolean(profile.href)),
  responses: authoredResponses[member.id] ?? [],
  ...(member.id === "lalith-shiyam-sundar" ? { story: { text: peoplePage.pi.storyDraft, status: "draft" as const } } : {}),
}));

export const peopleReview = {
  label: "Editorial preview",
  note: "The four prompts and PI story come from the handoff. Portraits and responses still need to be supplied or approved by their authors. These review fields are hidden in production.",
  portrait: "Portrait to be supplied",
  portraitNote: "Authentic portrait, approved by the researcher.",
  prompts: "Researcher-authored responses to collect",
  response: "Researcher's own response pending",
  draft: "Draft for researcher approval",
  storyDraft: "PI story · draft for approval",
  placeholder: "Placeholder portrait",
} as const;
