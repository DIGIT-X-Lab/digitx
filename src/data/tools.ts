export interface Tool {
  name: string;
  desc: string;
  tags: string[];
  status: string;
  github: string;
  paper?: string;
  stars: number;
}

export const imagingTools: Tool[] = [
  {
    name: 'MOOSE',
    desc: 'Segments 130+ tissues from CT using nnU-Net; built for multicenter PET/CT workflows and opportunistic screening.',
    tags: ['PET/CT', 'Segmentation', 'Multicenter'],
    status: 'Stable',
    github: 'https://github.com/ENHANCE-PET/MOOSE',
    paper: 'https://pubmed.ncbi.nlm.nih.gov/35772962/',
    stars: 304,
  },
  {
    name: 'FALCON',
    desc: 'One-stop total-body PET motion correction using the greedy diffeomorphic registration engine.',
    tags: ['PET/CT', 'Motion correction', 'Registration'],
    status: 'Stable',
    github: 'https://github.com/ENHANCE-PET/FALCON',
    paper: 'https://pubmed.ncbi.nlm.nih.gov/37290795/',
    stars: 48,
  },
  {
    name: 'PUMA',
    desc: 'PET segmentation-guided diffeomorphic framework for multiplexing tracers to characterise tissue biology.',
    tags: ['PET/CT', 'Segmentation', 'Diffeomorphic'],
    status: 'Stable',
    github: 'https://github.com/ENHANCE-PET/PUMA',
    paper: 'https://jnm.snmjournals.org/content/early/2025/09/18/jnumed.125.269688',
    stars: 21,
  },
];

export const llmTools: Tool[] = [
  {
    name: 'MosaicX',
    desc: 'Autonomous structuring engine that turns PDFs, dictated notes, images, and labs into FHIR-ready, provenance-preserved data.',
    tags: ['FHIR', 'SNOMED/LOINC', 'Provenance', 'Pipelines'],
    status: 'In development',
    github: 'https://github.com/DIGIT-X-Lab/MOSAICX',
    stars: 4,
  },
  {
    name: 'AnnotateX',
    desc: 'GUI web app for rapid text annotation to build gold standards and evaluate structured extraction.',
    tags: ['Annotation', 'Quality', 'Gold standards'],
    status: 'In development',
    github: 'https://github.com/DIGIT-X-Lab/ANNOTATEX',
    stars: 3,
  },
  {
    name: 'KnowledgeX',
    desc: 'A discovery platform that builds graphs from unstructured text with LLMs and supports grounded chat over the graph.',
    tags: ['Knowledge graph', 'LLM-grounding', 'Reasoning'],
    status: 'In development',
    github: 'https://github.com/DIGIT-X-Lab/KnowledgeX',
    stars: 0,
  },
];
