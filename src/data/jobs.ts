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
    id: 'research-position',
    badge: 'Open Position',
    type: 'Full-time',
    title: 'Research Position',
    subtitle: 'PhD / Postdoc / Research Engineer',
    shortDescription: "Building infrastructure and tools that enable health intelligence.",
    fullDescription: [
      "Clinical AI has a trust problem. Models make predictions, but clinicians can't see why. Data sits in silos (imaging here, notes there, labs somewhere else) and nobody can trace how a conclusion was reached. We're betting on temporal knowledge graphs, built with autonomous AI agents, as the way forward. Not because it's the hype, but because it seems like the reasonable path: connecting imaging, text, and structured clinical data into infrastructure for reasoning that clinicians can actually follow and challenge.",
      "If that sounds like a problem worth solving, keep reading.",
      "Here's the reality of this work: writing code and publishing papers is only part of it. Working with real patient data means writing ethics applications. Building things clinicians actually use means learning to think alongside them. Some of this is slow and unglamorous. We'll teach you, but you need to genuinely want to learn.",
      "A bit about us: the lab is ten months old. I was a postdoc ten months ago, so do the math. First-time PI, still figuring out the German academic system, definitely don't have all the answers. What I can promise is a culture where trust comes first, where it's safe to name what isn't working, and where we take the work seriously without taking ourselves too seriously. Strong industry and academic collaborations. We're having fun building this.",
      "The position is onsite at LMU Klinikum Munich. We're GPU-rich: you'll have access to our CORE cluster with DGX systems, plus your own Nvidia DIGIT Spark for local development. Salary follows TV-L E13/E14 depending on experience. The initial contract is one year, enough time for all of us to see if this is the right fit.",
      "To apply: send us your CV, a brief note on why this work resonates with you, and a link to something you've built that you're proud of (code, paper, project, anything). No formal cover letter needed.",
    ],
    requirements: [
      'MSc/PhD in Biomedical Engineering, Medical Informatics, Physics, Computer Science, or related',
      'You can build maintainable systems (programming language doesn\'t matter)',
      'You follow through on your commitments and communicate openly when things change',
      'Social skills and emotional intelligence for working closely with clinicians and team members',
    ],
    niceToHave: [
      'Experience with knowledge graphs, ontologies, or semantic technologies',
      'Background in medical imaging or clinical NLP',
      'Prior experience in clinical or interdisciplinary research settings',
    ],
    tags: ['Temporal KGs', 'Explainable AI', 'Multimodal', 'Clinical Research'],
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
