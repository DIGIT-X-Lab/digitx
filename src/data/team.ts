import { affiliations } from "./affiliations";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  label: string;
  tags: string[];
  bio: string;
  university: string;
  github?: string;
  linkedin?: string;
  scholar?: string;
  email?: string;
  portrait?: { src: string; alt: string; status: "draft" | "approved"; mirrored?: boolean };
  membership?: "core" | "associated";
  background?: { discipline: string };
}

export const teamMembers: TeamMember[] = [
  {
    id: 'lalith-shiyam-sundar',
    name: 'Prof. Dr. Lalith Kumar Shiyam Sundar',
    role: 'Group Lead',
    label: 'Group Lead',
    background: { discipline: 'Biomedical engineering' },
    tags: ['Medical imaging', 'Multimodal integration', 'Knowledge graphs'],
    bio: 'Focuses on clinically grounded AI that fuses imaging, text, and structured data into explainable knowledge graphs for real-world decisions.',
    university: affiliations.radiology,
    github: 'https://github.com/LalithShiyam',
    linkedin: 'https://de.linkedin.com/in/lalith-kumar-shiyam-sundar-phd-3a2aaba0',
    scholar: 'https://scholar.google.com/citations?user=L6iMPN4AAAAJ&hl=en',
    portrait: { src: '/portraits/lalith-shiyam-sundar-studio-sharp-web.jpg', alt: 'Lalith Kumar Shiyam Sundar', status: 'approved', mirrored: false },
  },
  {
    id: 'hagen-lamprecht',
    name: 'Hagen Lamprecht, M.Sc.',
    role: 'Doctoral researcher',
    label: 'Doctoral researcher',
    background: { discipline: 'Statistics and data science' },
    tags: ['Agentic systems', 'Autonomous research', 'Medical imaging AI'],
    bio: 'Focuses on autoresearch agents that target the real bottleneck in medical imaging AI, scarce expert tuning time, autonomously proposing, running, and validating model improvements against metrics clinicians trust.',
    university: affiliations.radiology,
    github: 'https://github.com/Hogandr',
    linkedin: 'https://www.linkedin.com/in/hagen-lamprecht-44a456234/',
    portrait: { src: '/portraits/hagen-lamprecht-web.jpg', alt: 'Hagen Lamprecht', status: 'approved' },
  },
  {
    id: 'peter-benedict-schildberg',
    name: 'Benedict Schildberg, M.Sc.',
    role: 'Doctoral researcher',
    label: 'Doctoral researcher',
    background: { discipline: 'Physics' },
    tags: ['Temporal knowledge graphs', 'Disease trajectories', 'Clinical reasoning'],
    bio: "Focuses on temporal knowledge graphs that link a patient's diagnoses, treatments, labs, and imaging over time, letting clinicians reason about how a condition's trajectory evolves.",
    university: affiliations.radiology,
    github: 'https://github.com/chillybang',
    linkedin: 'https://www.linkedin.com/in/b-schildberg/',
    portrait: { src: '/portraits/peter-benedict-schildberg-web.jpg', alt: 'Benedict Schildberg', status: 'approved' },
  },
  {
    id: 'maissa-monsour',
    name: 'Maissa Monsour, M.Sc.',
    role: 'Doctoral researcher',
    label: 'Doctoral researcher',
    background: { discipline: 'Electrical engineering and information technology' },
    tags: [],
    bio: '',
    university: affiliations.nuclearMedicine,
    membership: 'associated',
    github: 'https://github.com/MaissaMa',
    linkedin: 'https://www.linkedin.com/in/maissa-mansour-565ba922b/',
    portrait: { src: '/portraits/maissa-monsour-studio-web.jpg', alt: 'Maissa Monsour', status: 'approved' },
  },
  {
    id: 'maximilian-tiling',
    name: 'Maximilian Tiling, MD',
    role: 'Clinical associate',
    label: 'Clinical associate',
    background: { discipline: 'Medicine' },
    tags: [],
    bio: '',
    university: affiliations.radiology,
    membership: 'associated',
    linkedin: 'https://www.linkedin.com/in/maximilian-tiling-18778635a/',
    portrait: { src: '/portraits/maximilian-tiling-official-web.webp', alt: 'Maximilian Tiling', status: 'approved' },
  },
  {
    id: 'frederic-paul-thiele',
    name: 'Frederic Paul Thiele, MD',
    role: 'Clinical associate',
    label: 'Clinical associate',
    background: { discipline: 'Neurosurgery / Neuro-Oncology' },
    tags: [],
    bio: '',
    university: affiliations.neurosurgery,
    membership: 'associated',
    github: 'https://github.com/frxderic',
    linkedin: 'https://de.linkedin.com/in/dr-med-univ-frederic-thiele-b49849226',
    scholar: 'https://scholar.google.com/citations?user=inGD8ccAAAAJ&hl=en',
    portrait: { src: '/portraits/frederic-paul-thiele-web.webp', alt: 'Frederic Paul Thiele', status: 'approved' },
  },
];
