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
    name: 'Dr. Sahib Julka',
    role: 'Post Doctoral Researcher',
    label: 'Post Doctoral Researcher',
    tags: ['LLMs', 'Knowledge graphs', 'Automation'],
    bio: 'Focuses on LLM-based knowledge graph creation from clinical text and structured sources.',
    university: 'LMU University Hospital',
    github: 'https://github.com/julka01',
    linkedin: 'https://www.linkedin.com/in/julka01/',
    scholar: 'https://scholar.google.com/citations?user=GaEUyB0AAAAJ&hl=en',
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
