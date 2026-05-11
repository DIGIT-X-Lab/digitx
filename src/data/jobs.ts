export interface Job {
  id: string;
  badge: string;
  type: string;
  title: string;
  subtitle: string | null;
  shortDescription: string;
  fullDescription: string[];
  requirements: string[];
  niceToHave?: string[];
  tags: string[];
  cta: string;
}

export const jobs: Job[] = [
  {
    id: 'phd-vlm',
    badge: 'Open Position',
    type: 'Full-time',
    title: 'PhD Position',
    subtitle: 'Vision Language Models for Medical Imaging',
    shortDescription: "Building foundation models that jointly reason over medical images and clinical text.",
    fullDescription: [
      "Most medical AI treats images and text as separate worlds. Segmentation models look at pixels. Language models read reports. But clinicians reason across both at the same time: they look at the scan, read the history, and form a judgment that draws on everything. We want to build models that work the same way.",
      "This PhD is about building LYNX, a vision language foundation model for 3D medical imaging. Not another CLIP variant fine-tuned on medical images. LYNX puts volumes, text, and segmentation into a single unified token space: one autoregressive transformer that can read a scan and write the report, segment the anatomy, and be queried like a search engine for similar cases. Most existing work (CT-CLIP, CT-RATE, BiomedCLIP) either does retrieval or generation. LYNX does both from one set of weights, natively in 3D, not on 2D slices.",
      "You will train this on 15 years of real clinical data from LMU University Hospital, across CT, MRI, and PET/CT. Designing pretraining strategies that actually capture the relationship between what the image shows and what the report says. Building evaluation frameworks that go beyond leaderboard metrics.",
      "If that sounds like a problem worth spending three years on, keep reading.",
      "Here's the reality of this work: writing code and publishing papers is only part of it. Working with real patient data means writing ethics applications. Building things clinicians actually use means learning to think alongside them. Some of this is slow and unglamorous. We'll teach you, but you need to genuinely want to learn.",
      "The position is onsite at LMU Klinikum Munich, starting Q2 2026. We're GPU-rich: you'll have access to our CORE cluster with DGX systems, plus your own Nvidia DIGIT Spark for local development. Salary follows TV-L E13. The initial contract is one year, enough time for all of us to see if this is the right fit.",
      "To apply: send us your CV, a brief note on why this work resonates with you, and a link to something you've built that you're proud of (code, paper, project, anything). No formal cover letter needed.",
    ],
    requirements: [
      'MSc in Computer Science, Biomedical Engineering, Medical Informatics, Physics, or related',
      'Strong Python and PyTorch skills. You should be comfortable training models from scratch, not just running notebooks.',
      'Background in deep learning for computer vision or NLP (ideally both)',
      'You follow through on your commitments and communicate openly when things change',
    ],
    niceToHave: [
      'Experience with vision-language models, CLIP, or multimodal pretraining',
      'Familiarity with medical imaging data (DICOM, NIfTI) or clinical workflows',
      'Published work in medical AI, computer vision, or NLP',
    ],
    tags: ['VLMs', 'Foundation Models', 'Medical Imaging', 'Multimodal AI'],
    cta: 'Apply Now',
  },
  {
    id: 'phd-nuclear-medicine',
    badge: 'Open Position',
    type: 'Full-time · 3 years',
    title: 'PhD Position',
    subtitle: 'AI-Driven Analysis of Medical Imaging Data',
    shortDescription: "Using PET and MRI to build AI models that predict treatment response and advance personalized medicine for brain tumor patients.",
    fullDescription: [
      "LMU University Hospital Munich is one of the largest and most competitive university hospitals in Germany and Europe, providing patient care at the highest medical level across 48 specialized departments.",
      "The Department of Nuclear Medicine is looking for a highly motivated PhD candidate to join our team at the intersection of clinical research and methodological innovation. You will work in an interdisciplinary group of physicians, physicists, chemists, and biologists, with a focus on data-driven analysis of brain tumors (gliomas), primarily using PET imaging (FET tracer), working towards advancing personalized medicine through quantitative imaging methods.",
      "Your work will span the full pipeline: AI-driven analysis of multimodal imaging data (PET and MRI) to extract clinically relevant quantitative features, developing computer vision and AI models for automated tumor segmentation and subtype classification, AI-based prediction of treatment response and tumor recurrence from longitudinal imaging data, correlating imaging parameters with neuropathological biopsy findings, and building multimodal AI models that jointly analyze imaging and clinical text data.",
      "We offer a dynamic, interdisciplinary research environment at one of Europe's leading university hospitals, access to high-performance computing infrastructure for deep learning research, close mentorship in an open and collaborative working environment, and career development opportunities including international networking and support for publishing in leading journals. Remuneration follows TV-L E13 at 65%, with the possibility of an increase to 75%.",
      "The position is based at Campus Großhadern, Munich. Start date is by arrangement. Please apply by 24 May 2026 — as the position needs to be filled promptly, we encourage you to apply as soon as possible.",
      "To apply: send your CV and cover letter as a single PDF to Hagen Lamprecht at Hagen.Lamprecht@med.uni-muenchen.de.",
    ],
    requirements: [
      "Master's degree in computer science, data science, physics, or a related field, with a very good academic record",
      'Strong Python skills',
      'Working knowledge of machine learning, deep learning, or computer vision',
      'Strong analytical and problem-solving skills',
      'Comfortable working both independently and as part of an interdisciplinary team',
      'Excellent written and spoken English',
    ],
    niceToHave: [
      'Experience with medical image processing libraries (e.g. MONAI, SimpleITK)',
      'Familiarity with medical image formats (NIfTI, DICOM) and visualization tools (3D Slicer, MITK)',
      'Experience with Linux-based computing environments and HPC systems',
      'German language skills are welcome but not required',
    ],
    tags: ['PET Imaging', 'Computer Vision', 'Neuro-Oncology', 'Multimodal AI'],
    cta: 'Apply Now',
  },
  {
    id: 'master-thesis',
    badge: 'Open Positions',
    type: 'Thesis',
    title: 'Master Thesis Projects',
    subtitle: 'Foundation Models / Autonomous Structuring / Multimodal Integration',
    shortDescription: "Thesis projects for students who want real problems, not toy datasets.",
    fullDescription: [
      "If you're looking for a thesis project with real clinical data and problems that actually matter, keep reading.",
      "Current topics include fine-tuning foundation models for medical imaging and clinical text, autonomous structuring of clinical documents, and multimodal integration across imaging, labs, and narratives. You'd be working on one of these, or we shape something together based on what excites you.",
      "You'll be embedded in the lab, working alongside the team. We expect independence but we're here when you get stuck. The goal is a thesis you're proud of, skills that transfer, and maybe a paper if the work lands well.",
      "We're GPU-rich: you'll have access to our CORE cluster with DGX systems, and yes, even thesis students get their own Nvidia DIGIT Spark. For students who thrive here and want to continue, a thesis can grow into a PhD position. That's not a promise or a requirement, just something that happens naturally when the fit is right.",
      "To apply: send us your CV and a short note on what you're interested in. If you have code or projects you're proud of, share a link. No formal cover letter needed.",
    ],
    requirements: [
      'Enrolled in Biomedical Engineering, Medical Informatics, Physics, Computer Science, AI, or related program',
      'Solid programming skills (bonus if you work well with AI coding tools)',
      'Willing to sit with ambiguity and iterate toward clarity',
    ],
    niceToHave: [
      'Prior exposure to medical imaging or clinical data',
      'Interest in knowledge representation or ontologies',
      'Experience with PyTorch, Hugging Face, or similar frameworks',
    ],
    tags: ['Foundation Models', 'Medical Imaging', 'Multimodal AI', 'Ontologies'],
    cta: 'Get in Touch',
  },
];

export const getJobById = (id: string): Job | undefined => {
  return jobs.find(job => job.id === id);
};
