export interface FocusArea {
  num: string;
  title: string;
  desc: string;
  example: string;
}

export const focusAreas: FocusArea[] = [
  {
    num: '01',
    title: 'Autonomous Structuring of Clinical Data',
    desc: 'Make PDFs, dictated notes, images, and labs computable. Normalize names, keep provenance, and deliver structured data without endless prep.',
    example: 'Example: Radiology PDF → FHIR bundle with SNOMED/LOINC codes and time stamps preserved.',
  },
  {
    num: '02',
    title: 'Knowledge Graphs as a Common Substrate',
    desc: 'Link that data into a clinical graph that understands people, time, and relationships — not just isolated fields.',
    example: 'Example: patient → has_diagnosis → ICD/SNOMED node → linked to meds, labs, imaging, and time points with causal hints.',
  },
  {
    num: '03',
    title: 'Reasoning Interfaces for Clinicians',
    desc: 'Give clinicians ways to ask grounded questions, see the evidence path, and challenge the logic — safely and quickly.',
    example: 'Example: "Show tumor response over 6 months" → evidence-backed trend with cited sources.',
  },
  {
    num: '04',
    title: 'Scalable Infrastructure for Health Evidence',
    desc: 'Run analyses across thousands of datasets with audit trails, reproducibility, and guardrails built in.',
    example: 'Example: Cohort builder + reproducible pipelines with lineage, so results are portable across sites.',
  },
];
