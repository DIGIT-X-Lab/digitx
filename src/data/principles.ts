export interface Principle {
  title: string;
  desc: string;
}

export const principles: Principle[] = [
  { title: 'Begin with Clinical Reality', desc: 'Health data is messy. We sit with clinicians and build for the workflows that already exist, not the ones we wish existed.' },
  { title: 'Structure Enables Intelligence', desc: 'Predictions without meaning are brittle. We encode semantics, time, and provenance so reasoning has firm ground.' },
  { title: 'LLMs Are Tools, Not Oracles', desc: 'We use language models where they help, and we always anchor them in verifiable knowledge graphs with clear evidence.' },
  { title: 'Reproducibility and Scale Matter', desc: 'Methods should generalize across institutions and populations. We test for that and build for that.' },
  { title: 'Quiet Ambition', desc: 'We take on foundational work with humility and patience. We measure progress by safer care and stronger science.' },
];
