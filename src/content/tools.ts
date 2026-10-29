/**
 * Tools page copy and tool records. Source: editorial/03-TOOLS.md.
 *
 * Operational fields (function, interface, licence, repository) were checked against
 * each repository on 2026-10-24. Corrections to the handoff:
 *  - LION is tumour segmentation, not motion correction (README: "Fully automated tumor
 *    segmentation for FDG and PSMA PET scans").
 *  - FALCON is the motion-correction tool (README: "PET Motion Correction").
 *  - nifti2dicom converts one way: NIfTI images and masks into DICOM.
 */

import type { AreaId } from "./research";

export type DataKind = "Imaging" | "Documents";
export type Interface = "Command line" | "Application";
export type Status = "released" | "development" | "validation";

export interface Tool {
  slug: string;
  name: string;
  function: string;
  /** Short, plain-English description used in the catalogue. */
  summary?: string;
  data: DataKind[];
  interface: Interface;
  status: Status;
  licence?: string;
  plannedLicence?: string;
  licenceNote?: string;
  repo?: string;
  areas: AreaId[];
  /** Bento footprint: columns × rows on the widest grid. */
  size: "lg" | "wide" | "sm";
}

export const toolsPage = {
  title: "Tools",
  intro: "We build tools to solve the problems we encounter in studying how the body works. Where we can, we share them as open-source software, so others can use them, adapt them and take the work further.",
  filters: ["All", "Imaging", "Documents"] as const,
  dataLabels: { Imaging: "Image", Documents: "Text" } satisfies Record<DataKind, string>,
  released: "Available tools",
  development: "In development",
  developmentNote: "These tools are still being developed and are not yet publicly available.",
  explore: "Explore tool",
  repository: "GitHub",
  paper: "Paper",
  filterLabel: "Browse tools by data type",
  filterReset: "Show all tools",
  empty: "No tools match this selection.",
  localNote: "This website does not process medical data or provide hosted computation.",
  fields: {
    what: "What it does",
    example: "See an example",
    code: "Get the code",
    docs: "Documentation",
    requirements: "Requirements",
    related: "Related work",
    limitations: "Known limitations",
    licence: "Licence",
    status: "Status",
  },
  statusLabel: {
    released: "Open source",
    development: "In development",
    validation: "Ready for validation",
  },
  slots: {
    detail: "What it does: one short paragraph grounded in the documentation.",
    example: "Example: a precomputed, labelled example that runs in the browser. Synthetic or rights-cleared only.",
    docs: "Documentation link, checked.",
    requirements: "Requirements: interface, hardware and dependencies, checked against the repository.",
    related: "Related work: published evaluation and citation for this tool.",
    limitations: "Known limitations: from published evaluation only. Omit unsupported claims.",
    maintainers: "Maintainers and contributors as credited, with citation.",
  },
};

export const tools: Tool[] = [
  {
    slug: "moose",
    name: "MOOSE",
    function: "Whole-body organ and tissue segmentation in CT scans.",
    summary: "Segments organs and tissues in CT scans.",
    data: ["Imaging"],
    interface: "Command line",
    status: "released",
    licence: "Apache-2.0",
    repo: "https://github.com/ENHANCE-PET/MOOSE",
    areas: ["physiology", "computable"],
    size: "lg",
  },
  {
    slug: "mosaicx",
    name: "MOSAICX",
    function: "Extracts structured information from medical documents, with excerpts linking values to source text.",
    summary: "Turns medical documents into structured data linked to the source text.",
    data: ["Documents"],
    interface: "Command line",
    status: "released",
    licence: "Apache-2.0",
    repo: "https://github.com/DIGIT-X-Lab/MOSAICX",
    areas: ["computable"],
    size: "wide",
  },
  {
    slug: "lion",
    name: "LION",
    function: "Tumour segmentation for FDG and PSMA PET.",
    summary: "Finds and outlines tumours in FDG and PSMA PET scans.",
    data: ["Imaging"],
    interface: "Command line",
    status: "released",
    licence: "Apache-2.0",
    repo: "https://github.com/ENHANCE-PET/LION",
    areas: ["physiology", "computable"],
    size: "sm",
  },
  {
    slug: "falcon",
    name: "FALCON",
    function: "Motion correction for dynamic total-body and whole-body PET.",
    summary: "Corrects movement between frames in dynamic PET scans.",
    data: ["Imaging"],
    interface: "Command line",
    status: "released",
    licence: "GPL-3.0",
    repo: "https://github.com/ENHANCE-PET/FALCON",
    areas: ["physiology"],
    size: "sm",
  },
  {
    slug: "puma",
    name: "PUMA",
    function: "Alignment of multi-tracer and serial imaging studies.",
    summary: "Aligns PET/CT scans across tracers and time.",
    data: ["Imaging"],
    interface: "Command line",
    status: "released",
    licence: "GPL-3.0",
    repo: "https://github.com/ENHANCE-PET/PUMA",
    areas: ["physiology", "computable"],
    size: "sm",
  },
  {
    slug: "nifti2dicom",
    name: "nifti2dicom",
    function: "Converts NIfTI images and masks into DICOM, with masks saved as DICOM SEG.",
    summary: "Converts NIfTI images and masks into DICOM.",
    data: ["Imaging"],
    interface: "Command line",
    status: "released",
    licence: "Apache-2.0",
    repo: "https://github.com/ENHANCE-PET/nifti2dicom",
    areas: ["computable"],
    size: "sm",
  },
  {
    slug: "annotatex",
    name: "ANNOTATEX",
    function: "Application for expert labelling and structuring of text.",
    summary: "Helps researchers label text and connect related information.",
    data: ["Documents"],
    interface: "Application",
    status: "released",
    licence: "Apache-2.0",
    licenceNote: "VERIFY: the repository's LICENSE file is Apache-2.0, but GitHub does not detect it (NOASSERTION).",
    repo: "https://github.com/DIGIT-X-Lab/ANNOTATEX",
    areas: ["computable"],
    size: "wide",
  },
  {
    slug: "taipan",
    name: "TAIPAN",
    function: "Explores how PET signals change over time.",
    data: ["Imaging"],
    interface: "Application",
    status: "validation",
    plannedLicence: "Apache-2.0",
    areas: ["physiology"],
    size: "sm",
  },
  {
    slug: "lumos",
    name: "Lumos",
    function: "Turns documents into structured data and runs analyses through Ask Lumos.",
    data: ["Documents"],
    interface: "Application",
    status: "validation",
    plannedLicence: "Apache-2.0",
    areas: ["computable"],
    size: "sm",
  },
  {
    slug: "galah",
    name: "GALAH",
    function: "Turns PET/CT images into a report draft for clinician review.",
    data: ["Imaging", "Documents"],
    interface: "Application",
    status: "validation",
    plannedLicence: "Apache-2.0",
    areas: ["computable"],
    size: "wide",
  },
];
