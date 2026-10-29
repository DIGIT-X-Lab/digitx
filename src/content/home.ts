import { identity } from "./site";

/**
 * Home page copy. Source: editorial/01-HOME.md, rendered verbatim.
 * Editorial notes from the handoff live in `slot` strings, which only render in development.
 */

export const home = {
  opening: {
    // PI-approved mission, refined after the original editorial handoff.
    mission: [
      "Developing new ways to observe human biology,",
      "and new computational intelligence to understand it.",
    ],
    eyebrow: identity,
    title: "What can we understand about the human body when more of its data becomes computable?",
    titleLines: ["What can we understand", "about the human body"],
    titleHighlight: "the human body",
    intro: { lead: "What can we", focus: "understand", bridge: "about the", subject: "human body" },
    link: { to: "/#research", label: "Explore our research" },
    toolsLink: { to: "/#tools", label: "Browse our tools" },
  },

  idea: {
    label: "The idea",
    title: "Digital isn't always computable.",
    body: [
      "Medicine can record a great deal about the body. Being able to study that information is another matter.",
      "We work on the measurements, methods and tools that make more of it usable for research.",
    ],
  },

  opportunity: {
    label: "The opportunity",
    title: "More to investigate.",
    body: [
      "As AI systems become more capable of using tools and carrying out computational work, the questions we can investigate may change too.",
      "We are interested in what happens when those systems can work with richer, better-defined medical data. We build and test research systems to explore that possibility.",
    ],
    slots: {
      multimodal: "Feature: multimodal work. Plain-language claim, figure, scope label and route to its evidence, once cleared material exists.",
      systems: "Feature: research system. Only a publicly cleared, executed workflow. No invented agent logs.",
    },
  },

  contributions: {
    label: "Contributions",
    title: "Things we've built.",
    body: "Our work often leads to software. We share it where we can, so others can examine it, use it and take it further.",
    link: { to: "/tools", label: "Explore the tools" },
  },

  record: {
    label: "Research record",
    title: "The work behind the claims.",
    body: "Read the papers, examine the methods and see what is still under investigation.",
    links: [
      { to: "/publications", label: "Publications" },
      { to: "/projects", label: "Funded projects" },
    ],
    slot: "One figure, explained: only with a rights-cleared real figure and its correct citation. Otherwise the compact publication module below stands alone.",
  },

  people: {
    label: "People",
    title: "Meet the people doing the work.",
    link: { to: "/people", label: "Meet the team" },
  },

  invitation: {
    label: "Invitation",
    title: "What are you trying to understand?",
    body: "A useful collaboration starts with understanding the question.",
    final: "We'll listen first.",
    link: { to: "/contact", label: "Get in touch" },
  },
} as const;

export const storyPlayer = {
  title: "How DIGITX connects observations and investigation",
  open: "Explore the animation",
  loading: "Loading the research story…",
  unavailable: "The animation is taking longer to load. Open it separately to explore the story.",
} as const;

/** Homepage navigation and presentation copy, using the PI's mission language. */
export const homeExperience = {
  watch: "Watch our approach",
  duration: "48 seconds",
  filmProvenance: "Fictional patient records",
  close: "Close animation",
  explore: "Explore this research",
  researchLabel: "Research at DIGITX",
  softwareLabel: "Open research software",
  peoplePreview: "Design preview: generated portrait placeholders and draft responses, based on the current team’s research interests. These are not real likenesses or researcher-authored quotes.",
  portraitLabel: "AI portrait placeholder",
  responseLabel: "Draft response",
  previewQuestion: "What I’m trying to understand",
  illustrationLabel: "Conceptual visualisation",
  scrollLabel: "Discover our approach",
  heroVisual: {
    description: "The same human figure represented as a wireframe and as zeros and ones.",
    scrollCue: "Scroll to explore",
    revealQuestion: "Reveal the question",
    revealLabel: "Show binary representation",
    instructions: "Move over the figure to reveal its binary representation. Click, tap or press Enter or Space to toggle the whole figure.",
    binary: "binary",
    wireframe: "wireframe",
  },
} as const;

/**
 * Captions for the two computability demonstrations.
 * The sentences are approved copy from editorial/02-RESEARCH.md ("Making data computable").
 */
export const computability = {
  image: {
    title: "Image",
    caption: "Medical images already contain numbers, but the quantities a researcher needs may still have to be derived.",
  },
  text: {
    title: "Text",
    caption: "Clinical narratives contain observations, but they may not yet be represented in a form that can be analysed alongside measurements.",
  },
} as const;

/** Existing fictional examples from public/previews/computability-motion.html. */
export const observationExamples = {
  tabs: ["Images to measurements", "Text to structured facts"],
  label: "Choose a computability example",
  imageProvenance: "Illustrative anatomy and example measurements",
  textProvenance: "Fictional clinic letter and structured observations",
  measurementIntro: "A segmented region becomes a measurement.",
  tissueLabel: "Select a tissue",
  calculation: "How the number is obtained",
  calculationNote: "Illustrative values demonstrate volume calculation. They are not measurements of this rendered body or validated software outputs.",
  tissues: [
    { label: "Tumours", title: "Tumour volume", value: "40.8", unit: "mL", overlay: "tumour", colour: "#e36b63", explanation: "Add up the volume of the voxels labelled as tumour.", formula: "5,100 labelled voxels × 8 mm³ = 40.8 mL" },
    { label: "Muscle", title: "Skeletal muscle volume", value: "22.8", unit: "L", overlay: "muscle", colour: "#a9bbc9", explanation: "Measure the segmented muscle tissue across the imaged body.", formula: "2,850,000 labelled voxels × 8 mm³ = 22.8 L" },
    { label: "Fat", title: "Adipose tissue volume", value: "18.5", unit: "L", overlay: "fat", colour: "#9cab9c", explanation: "Quantify fat compartments as part of body composition.", formula: "2,312,500 labelled voxels × 8 mm³ = 18.5 L" },
  ],
} as const;
