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
    title: 'PhD Position: Vision Language Models for Medical Imaging',
    subtitle: null,
    shortDescription: "Building foundation models that jointly reason over medical images and clinical text.",
    fullDescription: [
      "Most medical AI treats images and text as separate worlds. Segmentation models look at pixels. Language models read reports. But clinicians reason across both simultaneously: they read the scan, correlate with history, and form a judgment. We want to build models that do the same.",
      "This PhD is about developing vision language models (VLMs) for the medical imaging domain. The focus is on building foundation models that can jointly understand radiological images and clinical narratives, grounded in real patient data across CT, MRI, and PET/CT.",
      "You will work on training and evaluating VLMs on multi-institutional clinical datasets, designing pretraining strategies that capture the relationship between imaging findings and clinical context, and building evaluation frameworks that go beyond standard benchmarks.",
      "The position is onsite at LMU Klinikum Munich. You will have access to our CORE cluster with DGX systems, plus your own Nvidia DIGIT Spark for local development. Salary follows TV-L E13. We value honest science, open-source culture, and building things that actually help clinicians.",
      "To apply: send us your CV, a brief note on why this work interests you, and a link to something you have built (code, paper, project). No formal cover letter needed.",
    ],
    requirements: [
      'MSc in Computer Science, Biomedical Engineering, Medical Informatics, Physics, or related',
      'Strong programming skills in Python and experience with PyTorch',
      'Background in deep learning for computer vision or NLP',
      'Ability to work independently and communicate clearly',
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
