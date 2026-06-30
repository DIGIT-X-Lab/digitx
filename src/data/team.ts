export interface TeamMember {
  name: string;
  role: string;
  label: string;
  tags: string[];
  bio: string;
  university: string;
  github?: string;
  linkedin?: string;
  scholar?: string;
}

export const teamMembers: TeamMember[] = [
  {
    name: 'Prof. Dr. Lalith Kumar Shiyam Sundar',
    role: 'Group Lead',
    label: 'Group Lead',
    tags: ['Medical imaging', 'Multimodal integration', 'Knowledge graphs'],
    bio: 'Focuses on clinically grounded AI that fuses imaging, text, and structured data into explainable knowledge graphs for real-world decisions.',
    university: 'LMU Radiology · LMU University Hospital',
    github: 'https://github.com/LalithShiyam',
    linkedin: 'https://de.linkedin.com/in/lalith-kumar-shiyam-sundar-phd-3a2aaba0',
    scholar: 'https://scholar.google.com/citations?user=L6iMPN4AAAAJ&hl=en',
  },
  {
    name: 'Hagen Lamprecht',
    role: 'Doctoral researcher',
    label: 'Doctoral researcher',
    tags: ['Agentic systems', 'Autonomous research', 'Medical imaging AI'],
    bio: 'Focuses on autoresearch agents that target the real bottleneck in medical imaging AI, scarce expert tuning time, autonomously proposing, running, and validating model improvements against metrics clinicians trust.',
    university: 'Ludwig Maximilian University of Munich',
    github: 'https://github.com/Hogandr',
    linkedin: 'https://www.linkedin.com/in/hagen-lamprecht-44a456234/',
  },
  {
    name: 'Peter Benedict Schildberg',
    role: 'Doctoral researcher',
    label: 'Doctoral researcher',
    tags: ['Temporal knowledge graphs', 'Disease trajectories', 'Clinical reasoning'],
    bio: "Focuses on temporal knowledge graphs that link a patient's diagnoses, treatments, labs, and imaging over time, letting clinicians reason about how a condition's trajectory evolves.",
    university: 'Ludwig Maximilian University of Munich',
    github: 'https://github.com/chillybang',
    linkedin: 'https://www.linkedin.com/in/b-schildberg/',
  },
  {
    name: 'Sameer Singh Rawat',
    role: 'Master thesis student',
    label: 'Master thesis student',
    tags: ['AI automation', 'Ontology', 'LLMs'],
    bio: 'Focuses on automated ontology induction from medical documents using large language models.',
    university: 'Ludwig Maximilian University of Munich',
    github: 'https://github.com/SameerR007',
    linkedin: 'https://www.linkedin.com/in/sameer-s-1333a6172',
  },
];
