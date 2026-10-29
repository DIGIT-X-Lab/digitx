/** Operational summaries checked against the linked project documentation on
 * 26 October 2026. Illustrations describe concepts, not measured tool outputs.
 * Keep release truth in tools.ts; these records supply the practical detail.
 */
import { illustrations } from "./illustrations";

export interface ToolGuide {
  overview: string;
  demo: string;
  input: string;
  output: string;
  requirements: string;
  docs: string;
  install?: string;
  scope?: string;
  citation?: { title: string; href: string; kind: "Paper" | "Software record" };
}

export const toolGuides: Record<string, ToolGuide> = {
  moose: {
    demo: "MOOSE turns CT scans into labelled maps of organs and tissues. These maps give researchers defined anatomical regions to measure and compare across the body, with different models covering different structures.",
    overview: "MOOSE segments organs and tissues in CT scans, producing labelled masks for further analysis. Choose the model that covers the structures relevant to your study.",
    input: "CT scans prepared for the selected segmentation model.",
    output: "Labelled organ and tissue segmentation masks.",
    requirements: "Python 3.10 or newer and at least 16 GB of RAM. Runs on Windows, macOS and Linux; GPU acceleration is optional.",
    docs: "https://moosez.readthedocs.io/en/latest/",
    install: "pip install moosez",
    scope: "Available models have different anatomical and modality coverage. The code uses Apache-2.0; model weights are published under CC BY 4.0.",
    citation: { title: "Fully-automated, semantic segmentation of whole-body 18F-FDG PET/CT images based on data-centric artificial intelligence", href: "https://doi.org/10.2967/jnumed.122.264063", kind: "Paper" },
  },
  mosaicx: {
    demo: "MOSAICX uses a researcher-defined template to turn medical documents into structured data. It returns the requested fields with excerpts from the original text, so each extracted value can be traced back to its source and reviewed.",
    overview: "MOSAICX turns medical documents into structured information using a template that defines what to extract. Fields retain excerpts from the original text, so a researcher can return to the source when reviewing an extraction.",
    input: "Medical documents and an extraction template.",
    output: "Structured JSON with source-text excerpts.",
    requirements: "Python 3.11 or newer and a configured language-model server. PDFs and images also require the Chandra OCR service; hardware depends on the models you run.",
    docs: "https://github.com/DIGIT-X-Lab/MOSAICX#readme",
    install: "pip install git+https://github.com/DIGIT-X-Lab/MOSAICX.git",
    scope: "The extraction template and model configuration define the task. Source excerpts support review; they do not by themselves establish the accuracy of an extracted field.",
    citation: { title: "MOSAICX software record", href: "https://doi.org/10.5281/zenodo.17601890", kind: "Software record" },
  },
  lion: {
    demo: "LION identifies and outlines tumours in FDG or PSMA PET scans using tracer-specific models. It returns segmentation masks, tumour volumes and tracer-uptake measurements that researchers can review and use in further analysis.",
    overview: "LION segments tumours in PET images using tracer-specific models. It accepts FDG or PSMA PET input and produces masks that can be inspected and used in subsequent research analysis.",
    input: "FDG or PSMA PET images in NIfTI or DICOM format.",
    output: "Tumour segmentation masks, with optional projection previews.",
    requirements: "Python 3.10 or newer. CPU, NVIDIA CUDA and Apple Silicon MPS are supported. CT is not required by the current FDG and PSMA models.",
    docs: "https://github.com/ENHANCE-PET/LION#readme",
    install: "pip install lionz",
    scope: "Choose the model for the tracer in your study. Optional SUV thresholding requires SUV-calibrated input.",
    // Pires et al., J Nucl Med, 30 September 2026. Verified against PMID 42816125.
    citation: { title: "Fully Automated Segmentation of [18F]FDG and [68Ga]/[18F]PSMA PET/CT Images via Data-Centric Deep Learning", href: "https://doi.org/10.2967/jnumed.126.272852", kind: "Paper" },
  },
  falcon: {
    demo: "FALCON corrects movement between frames in dynamic PET scans, including brain, whole-body and total-body studies. It produces an aligned image series for investigating how tracer uptake changes over time.",
    overview: "FALCON aligns frames in dynamic PET studies to account for movement during acquisition. Its registration workflow supports whole-body, total-body and brain imaging studies.",
    input: "A dynamic PET image series.",
    output: "Motion-corrected PET frames.",
    requirements: "Python 3.10–3.14 on Windows, macOS or Linux. Uses the greedy registration toolkit; follow the platform-specific installation instructions.",
    docs: "https://falconz.readthedocs.io/en/latest/",
    install: "pip install falconz",
    citation: { title: "Fully Automated, Fast Motion Correction of Dynamic Whole-Body and Total-Body PET/CT Imaging Studies", href: "https://doi.org/10.2967/jnumed.122.265362", kind: "Paper" },
  },
  puma: {
    demo: "PUMA aligns PET/CT studies acquired with different tracers or at different time points in the same person. It returns aligned images and masks, and can combine tracer signals into colour-coded views for studying complementary information together.",
    overview: "PUMA brings serial PET/CT studies into a shared anatomical space. This allows complementary tracer distributions to be studied together, with aligned images, masks and optional multiplexed composites.",
    input: "PET/CT studies from different tracers or time points in the same person.",
    output: "Aligned PET and CT images, masks and registration transforms; optional multiplexed composites.",
    requirements: "Python 3.10 or newer. Runs on CPU or GPU, including Apple Silicon. Arrange the PET and CT inputs by tracer as described in the documentation.",
    docs: "https://github.com/ENHANCE-PET/PUMA#readme",
    install: "pip install pumaz",
    citation: { title: "Fully Automated Image-Based Multiplexing of Serial PET/CT Imaging for Facilitating Comprehensive Disease Phenotyping", href: "https://doi.org/10.2967/jnumed.125.269688", kind: "Paper" },
  },
  annotatex: {
    demo: "ANNOTATEX lets researchers highlight observations in text, assign labels and connect related findings. It keeps these annotations linked to their source and exports the labels and relationships as structured data for research or model development.",
    overview: "ANNOTATEX lets researchers highlight text, assign labels and connect related observations. Annotations, relationships and structured exports stay linked within the same workspace.",
    input: "Text or PDF documents and a labelling schema.",
    output: "Text annotations and relationships, exported as JSON or CSV.",
    requirements: "A web browser for the application. Self-host with Docker, or build from source using Node.js 18 or newer and npm 9 or newer.",
    docs: "https://github.com/DIGIT-X-Lab/ANNOTATEX#readme",
    citation: { title: "ANNOTATEX software record", href: "https://doi.org/10.5281/zenodo.17601554", kind: "Software record" },
  },
  nifti2dicom: {
    demo: "nifti2dicom converts NIfTI images and segmentation masks into DICOM images or DICOM SEG, using a reference scan to preserve spatial geometry. It also produces a conversion report recording the geometry, label mapping and any warnings for review.",
    overview: "nifti2dicom converts research images and segmentation masks into DICOM using a reference scan. It carries reference geometry into the conversion and records the resulting files in a conversion report.",
    input: "A NIfTI image or segmentation mask and a reference DICOM series.",
    output: "DICOM images or a multi-segment DICOM SEG, plus a conversion report.",
    requirements: "A Python environment and the source DICOM reference series. The documentation explains geometry matching and supported output profiles.",
    docs: "https://github.com/ENHANCE-PET/nifti2dicom#readme",
    install: "pip install nifti2dicom",
    scope: "Input units and geometry must agree with the reference. Supported output profiles and validation evidence are documented in the repository.",
  },
};

export const toolStudyCopy = {
  schematic: "Method schematic",
  anatomy: "Illustrative anatomy",
  segmentation: "Illustrative segmentation",
  document: "Illustrative text example",
  mosaicx: {
    source: illustrations.report,
    sourceText: illustrations.narrative,
    output: "Structured fields",
    hint: "Select a field to trace its source.",
    description: "Fictional pathology report linked to two illustrative structured fields. Coloured source phrases and matching references show where each value comes from. This is a concept demonstration, not a live extraction or verified clinical output.",
    fields: [
      { id: "site", ...illustrations.fields[1], excerpt: "left lower lobe", reference: "1" },
      { id: "histology", ...illustrations.fields[0], excerpt: "adenocarcinoma", reference: "2" },
    ],
  },
  moose: { input: "Medical images", output: "Organs & tissues" },
  lion: { tracers: [
    { name: "FDG", asset: "patient-002.webp", description: "Existing female wireframe with illustrative coral breast and axillary tumour masks" },
    { name: "PSMA", asset: "patient-003.webp", description: "Existing male wireframe with multiple illustrative blue prostate, nodal and skeletal tumour masks" },
  ], description: "Conceptual FDG breast-cancer and PSMA prostate-cancer segmentation examples" },
  falcon: {
    before: "Moving frames", after: "Aligned frames",
    description: "Illustration of frame-to-frame motion correction. Three displaced views of the same anatomy converge to a shared spatial reference. This spatial illustration does not depict tracer uptake or a measured FALCON result.",
  },
  puma: {
    input: "Serial PET/CT", output: "Shared anatomical space", studies: ["Tracer A", "Tracer B", "Tracer C"],
    channels: ["red", "green", "blue"],
    lesions: [
      { id: "chest-red", x: 397, y: 330, size: 94, source: "350 315 160 145", channels: ["red"] },
      { id: "chest-green-blue", x: 550, y: 375, size: 68, source: "475 690 145 145", channels: ["green", "blue"] },
      { id: "abdomen-red-green", x: 382, y: 500, size: 118, source: "330 480 230 205", channels: ["red", "green"] },
      { id: "abdomen-rgb", x: 535, y: 580, size: 62, source: "350 315 160 145", channels: ["red", "green", "blue"] },
      { id: "pelvis-green-blue", x: 480, y: 705, size: 80, source: "475 690 145 145", channels: ["green", "blue"] },
      { id: "thigh-red-green", x: 390, y: 835, size: 66, source: "330 480 230 205", channels: ["red", "green"] },
    ],
    description: "Conceptual illustration of three PET tracer views fusing into one registered patient. Tumour patterns vary across the body: red-only lesions stay red, red–green overlap becomes yellow, green–blue overlap becomes cyan, and overlap of all three channels becomes white. Each tumour uses the same contour in every contributing channel.",
  },
  nifti2dicom: {
    input: "NIfTI volume", reference: "Reference DICOM", output: "DICOM / SEG",
    title: "NIfTI to DICOM conversion",
    description: "An abstract voxel volume opens into individually framed slices. The same coloured cells remain unchanged as the DICOM reference frame appears. The separated planes are an exploded view for illustration, not a change in physical slice spacing. This is a format-conversion concept, not patient data or a measured output.",
  },
  annotatex: {
    source: "Highlight", structure: "Label & connect", relationship: "located in",
    steps: ["Highlight", "Label", "Connect"],
    hint: "Select a label to trace its phrase.",
    description: "Fictional pathology sentence with two illustrative annotations. Highlighted phrases receive histology and site labels, then a located-in relationship connects adenocarcinoma to the left lower lobe. Select either annotation to highlight its source phrase. This demonstrates manual annotation, not an automated clinical result.",
  },
};
