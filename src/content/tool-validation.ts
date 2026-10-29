import { contactEmail } from "./site";

/** PI confirmation, 27 October 2026: TAIPAN, Lumos and GALAH are built;
 * all three need validation. No validation progress or results supplied. */
export const toolValidation = {
  title: "COMING SOON",
  intro: "A few things we’re working on, and would love to explore with you.",
  selectorLabel: "Explore our next tools",
  action: "Want to validate it with us?",
  availability: "Not yet publicly available.",
  detailIntro: "Interested in evaluating this tool in your research? We’d love to explore a collaboration.",
};

/** Public teasers, grounded in the local repositories and the CHILI talk.
 * TAIPAN intentionally omits algorithms, named parameters and unpublished results. */
export const toolTeasers: Record<string, { headline: string; summary: string; invitation: string; artLabel: string }> = {
  taipan: {
    headline: "See what time reveals.",
    summary: "A dynamic PET scan records how a tracer moves through the body over time. TAIPAN turns those changing signals into spatial maps, helping researchers explore the physiology behind the images.",
    invitation: "Working with dynamic PET? Let’s explore what we could learn together.",
    artLabel: "TAIPAN workflow preview: tracer circulation in a dynamic PET scan, temporal analysis, and spatial maps. Reuses the illustrative circulation paths and synthetic maps from the CHILI talk; no patient data or measured results.",
  },
  lumos: {
    headline: "Your documents. New questions.",
    summary: "Lumos turns your documents into a dataset you can check against the source. Ask a research question, and Ask Lumos runs the analysis and creates figures for you, all in one workspace.",
    invitation: "Have a research question buried in documents? We’d love to hear it.",
    artLabel: "Lumos browser workflow: import documents, extract a dataset, verify values against the source, and ask Lumos to run an analysis and create a figure. Reuses the original animation and its fictional cohort; it is not a live analysis or clinical performance demonstration.",
  },
  galah: {
    headline: "From images to a report.",
    summary: "Bring a PET/CT study into GALAH and ask it to draft a report. Image viewing, measurements and reporting share one workspace, so clinicians can review the findings and refine the draft alongside the scan.",
    invitation: "Work with PET/CT? Help us evaluate how this fits into reading and reporting.",
    artLabel: "GALAH workflow preview: add PET/CT images, request a report, and review the generated draft. The anatomy is illustrative and the report excerpts come from GALAH’s existing fictional demo, not a patient study.",
  },
};

/** Interface copy for the finite, browser-only workflow previews. */
export const toolPreview = {
  preview: "Workflow preview",
  pause: "Pause preview",
  resume: "Resume preview",
  replay: "Replay preview",
  taipan: {
    steps: ["Dynamic PET", "Analyse time", "Spatial maps"],
    input: "Dynamic PET", output: "Spatial maps", time: "Time after injection",
    working: "Analysing change over time", done: "Explore the resulting maps",
    provenance: "Synthetic scan illustration",
    passage: "Tracer passage", scrub: "Explore tracer passage",
  },
  lumos: {
    steps: ["Documents", "Dataset", "Ask Lumos", "Figure"],
    input: "Clinical documents", extraction: "Extract the fields your study needs.",
    dataset: "A dataset, ready to investigate", columns: ["Record", "Baseline", "Follow-up"],
    document: "Clinical report", sourceHint: "Values linked to their source documents",
    question: "Define response as ≥25% score reduction. Which baseline factors predict it?",
    working: "Running the analysis", done: "Factors associated with response",
    axis: "Adjusted odds ratio · 95% confidence interval",
    result: "Analysis and figure ready to review", processing: "Preparing the data · fitting the model",
    figureLabel: "Illustrative analysis of the fictional Lumos study. Adjusted odds ratios with 95% confidence intervals: age per ten years 0.69, baseline per ten points 1.79, enhanced versus standard care 1.79. These are synthetic associations, not clinical findings.",
    provenance: "Fictional study from the Lumos film",
  },
  galah: {
    steps: ["PET/CT images", "Ask GALAH", "Report draft"],
    input: "PET/CT study", loaded: "Images added", prompt: "Generate a report for this scan.",
    working: "Writing the report", report: "PET/CT report", section: "Impression",
    status: "Draft for clinician review", provenance: "Fictional study · illustrative anatomy",
    waiting: "Awaiting your request", ready: "Ready for your review",
    assistant: "GALAH", user: "You", followup: "Ask GALAH a follow-up…", send: "Send the example question", greeting: "Hi! Your PET/CT study is ready. What would you like to know?",
    exportPdf: "Export PDF", exportDicom: "Export DICOM SR",
    // Existing mock report from galah-ai-reporter/src/pages/ChatbotReportDemo.tsx.
    findings: [
      "Metabolically active right upper lobe primary lung malignancy.",
      "FDG-avid mediastinal lymphadenopathy consistent with N2 nodal disease.",
      "Suspicious T10 vertebral lesion, likely representing osseous metastasis.",
    ],
  },
};

export const lumosWorkflow = {
  source: "/previews/lumos/index.html",
  title: "From documents to analysis",
  fullscreen: "View fullscreen",
  chapters: [
    { start: 0, still: 2.5, name: "Add documents", caption: "Bring your clinical documents into Lumos." },
    { start: 3.8, still: 9.5, name: "Extract data", caption: "Turn the information you need into a structured dataset." },
    { start: 10.6, still: 12.8, name: "Check the source", caption: "Trace an extracted value back to the original document." },
    { start: 14.9, still: 23.8, name: "Run an analysis", caption: "Ask a research question. Lumos runs the analysis and creates the figure." },
  ],
};

export function validationContactHref(name: string) {
  return `mailto:${contactEmail}?subject=${encodeURIComponent(`Validating ${name} together`)}`;
}
