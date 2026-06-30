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
