/**
 * Research page copy. Source: editorial/02-RESEARCH.md, rendered verbatim.
 * PI revision, 25 October 2026: three connected research pillars in this order.
 */

export type AreaId = "physiology" | "computable" | "systems";

export const research = {
  title: "Research",
  indexLabel: "Research pillars",
  intro: [
    "We develop computational methods and research systems to investigate how the body works, in health and disease.",
  ],
  areas: [
    {
      id: "physiology" as AreaId,
      title: "Understanding physiology",
      intro: [
        "We use medical imaging to understand the body in health and disease, bringing anatomical, functional and molecular information together. This approach has its roots in hybrid imaging. Before DIGITX, we started ENHANCE.PET at QIMP in Vienna: an initiative for sharing tools, data and knowledge so more researchers can study the body in this way.",
        "Its tools, now widely used by the imaging community, support analysis across organs, tracers and time. At DIGITX, we’re extending this work across PET, CT and MR for deeper phenotyping. Alongside characterising physiology and disease, we’re investigating how organs respond and adapt when the body is challenged.",
        "To follow these responses across the body, we’re using total-body PET in challenge studies. Its simultaneous coverage and high temporal resolution let us track molecular signals across organs and investigate how their responses unfold together. These studies also drive our development of tools, a new data format and computational methods to manage large, time-resolved datasets and distinguish physiological signals from noise and motion.",
      ],
      slot: "AI-generated conceptual wireframe artwork. Provenance and generation prompt: docs/visuals/physiology-schematic.md.",
    },
    {
      id: "computable" as AreaId,
      title: "Making data computable",
      intro: [
        "We believe that structure creates the conditions for insight. We make data computable so researchers can bring information together, uncover patterns and investigate new questions.",
        "Digital data is not automatically computable. We turn unstructured data, such as clinical narratives, into structured observations and derive quantitative measurements from images. These can then be connected and analysed together.",
        "We preserve the context needed to interpret the data: how it was acquired, how it was processed and how measurements and observations relate to one another. Researchers can trace results back to their source and assess them in context.",
      ],
      slot: "Evidence: one image-derived measurement and one source-linked text example, each labelled real or illustrative and linked to its method or tool.",
    },
    {
      id: "systems" as AreaId,
      title: "Systems for autonomous discovery",
      intro: [
        "Making data computable opens up new ways to investigate it. We build and test AI research systems that can work with connected data, use computational tools and pursue scientific questions.",
        "We are interested in how these systems can move through an investigation: choosing methods, carrying out analyses, examining results and deciding what to investigate next. We study how much of this process they can handle reliably and where human judgement is needed.",
        "We also develop ways to make their actions and evidence open to inspection, so researchers can understand how a result was reached, assess its limitations and decide what needs further investigation.",
      ],
      slot: "Evidence: a publicly cleared real workflow, or omit until available. Do not show invented agent logs.",
    },
  ],
  related: {
    tools: "Relevant tools",
    projects: "Current funded projects",
    publications: "Related publications",
    publicationsSlot: "Related publications appear once each record carries a verified research-area tag.",
  },
} as const;

/** Interface labels and provenance for the existing approved examples. */
export const researchExperience = {
  pillars: {
    hint: "Select a pillar to explore.",
  },
  physiology: {
    enhance: { label: "ENHANCE.PET", href: "https://enhance.pet" },
    modalities: [
      { id: "pet", label: "Molecular", src: "/illustrations/research/modality-pet-v1.png", description: "Conceptual wireframe view of molecular information." },
      { id: "ct", label: "Anatomical", src: "/illustrations/research/modality-ct-v1.png", description: "Conceptual wireframe view of anatomical information." },
      { id: "mr", label: "Functional", src: "/illustrations/research/modality-mr-v1.png", description: "Conceptual wireframe view of functional information." },
    ],
    carousel: {
      instructions: "Conceptual views of molecular, anatomical and functional information. Hover to pause, then click a figure to bring it forward. Leaving resumes the loop. With keyboard focus, use Left and Right to choose a view; Enter holds or releases it. On touch, tap a figure to focus it and tap again to resume. Reduced-motion preferences are respected.",
      hold: "Keep imaging preview paused",
      release: "Release imaging preview",
    },
  },
  systems: {
    visual: "Conceptual view of an AI research system working with scientific questions, connected data and computational tools.",
    question: "Scientific questions",
    data: "Connected data",
    tools: "Computational tools",
    pause: "Pause illustration",
    resume: "Resume illustration",
  },
  film: {
    label: "Watch our approach",
    close: "Close film",
  },
  tools: {
    development: "In development",
    released: "Open source",
  },
  projectLink: "Explore the project",
  record: {
    title: "The work behind the claims.",
    body: "Read the papers, examine the methods and see what is still under investigation.",
    publications: "Publications",
    projects: "Funded projects",
  },
} as const;
