// Fictional teaching records. No values are inferred from the rendered anatomy.
export const mission = 'Developing new ways to observe human biology, and new computational intelligence to understand it.';
export const duration = 48;
export const chapters = [
  { name: 'Observe', start: 0, inspect: 4.4, title: 'We start with many observations of one person.', description: 'Images and different kinds of reports accumulate over time.' },
  { name: 'Make computable', start: 5.5, inspect: 19.4, title: 'We make observations computable.', description: 'First measure anatomy in images. Then interpret narrative reports as computable observations, preserving units, time and negation.' },
  { name: 'Bring together', start: 25, inspect: 30.8, title: 'We bring each person’s information together.', description: 'The person and their record change together. Measurements, clinical context and time stay connected.' },
  { name: 'Connect', start: 32, inspect: 36.9, title: 'We connect information across people.', description: 'Connect images, body composition, laboratory findings, pathology, treatment and time around the person.' },
  { name: 'Investigate', start: 37.5, inspect: 48, title: 'We develop and test autonomous AI for discovery.', description: 'We build and test autonomous AI research systems to look for patterns, test explanations and ask new questions about human biology.' },
];
export const timing = { imageStart: 6.2, imageStep: 1.75, reportStart: 12, reportStep: 4, reportEnd: 24.55, rowStart: 25.4, rowStep: 1.25, graphStart: 33.1, peerStart: 40.4 };
export const patientAssets = { 'PAT-001': 'front-clean', 'PAT-002': 'patient-002', 'PAT-003': 'patient-003' };
export const fields = [
  { key: 'id', label: 'Patient', x: 465 },
  { key: 'visit', label: 'Time', x: 578 },
  { key: 'tumour', label: 'Tumour', x: 690 },
  { key: 'muscle', label: 'Muscle', x: 800 },
  { key: 'fat', label: 'Fat', x: 907 },
  { key: 'histology', label: 'Pathology', x: 1006 },
  { key: 'crp', label: 'CRP', x: 1174 },
  { key: 'treatment', label: 'Treatment', x: 1286 },
];
export const records = [
  { id: 'PAT-001', visit: 'Baseline', tumour: '40.8 mL', muscle: '22.8 L', fat: '18.5 L', histology: 'Adenocarcinoma', crp: '8 mg/L', treatment: 'Not started' },
  { id: 'PAT-001', visit: 'Week 6', tumour: '32.4 mL', muscle: '22.5 L', fat: '18.3 L', histology: 'Adenocarcinoma', crp: '5 mg/L', treatment: 'Started' },
  { id: 'PAT-002', visit: 'Baseline', tumour: '53.2 mL', muscle: '25.1 L', fat: '20.2 L', histology: 'Squamous cell', crp: '11 mg/L', treatment: 'Not started' },
  { id: 'PAT-003', visit: 'Baseline', tumour: '29.1 mL', muscle: '21.4 L', fat: '17.9 L', histology: 'Adenocarcinoma', crp: '6 mg/L', treatment: 'Not started' },
];
const tumourChange = ((Number.parseFloat(records[0].tumour) - Number.parseFloat(records[1].tumour)) / Number.parseFloat(records[0].tumour) * 100).toFixed(1);
// Each authored answer names the records and fields that its visual uses.
// The third answer proposes a comparison; it does not assert a cohort finding.
export const keplerAnswers = [
  { id: 'tumour-change', at: chapters[4].start + 2.3, y: 405, fields: ['tumour'], records: [0, 1],
    lines: [`I found a ${tumourChange}% fall in tumour volume`, 'for PAT-001 from baseline to week 6.'] },
  { id: 'clinical-context', at: chapters[4].start + 5.1, y: 510, fields: ['crp', 'treatment'], records: [0, 1],
    lines: [`CRP fell from ${Number.parseFloat(records[0].crp)} to ${records[1].crp}. Treatment`, 'had started by week 6.'] },
  { id: 'compare-people', at: chapters[4].start + 7.8, y: 615, fields: ['tumour', 'crp'], records: [0, 1, 2, 3],
    lines: ['Next, I would compare these changes', 'across more people.'] },
];
// Authored fictional examples of contextual interpretation, not executed outputs.
// The wider table shows a subset of these observations.
export const reportExamples = [
  {
    title: 'Pathology report', visit: 'Baseline',
    lines: ['The biopsy from the left lower lobe confirms', 'adenocarcinoma. No lymphovascular invasion', 'is identified in the sampled tissue.'],
    note: 'Preserve the finding, its location and what was not seen.',
    facts: [
      { label: 'Histology', value: records[0].histology, context: 'Confirmed', lines: [0, 1], kind: 'finding' },
      { label: 'Sample site', value: 'Left lower lobe', context: 'Biopsy', lines: [0], kind: 'site' },
      { label: 'Lymphovascular invasion', value: 'Not identified', context: 'In sampled tissue', lines: [1, 2], kind: 'negated' },
    ],
  },
  {
    title: 'Laboratory report', visit: 'Baseline and follow-up',
    lines: ['At baseline, C-reactive protein measured eight', 'milligrams per litre. It was five at the', 'six-week review.'],
    note: 'The same measurement, with its unit and the right visit.',
    facts: [
      { label: 'CRP', value: '8', unit: 'mg/L', context: 'Baseline', lines: [0, 1], kind: 'quantity' },
      { label: 'CRP', value: '5', unit: 'mg/L', context: 'Week 6', lines: [1, 2], kind: 'quantity' },
    ],
  },
  {
    title: 'Treatment note', visit: 'Baseline and follow-up',
    lines: ['At the first visit, systemic treatment had not', 'yet begun. By the six-week review,', 'the first cycle had been given.'],
    note: 'Distinguish what had not happened from what happened later.',
    facts: [
      { label: 'Treatment', value: records[0].treatment, context: 'Baseline', lines: [0, 1], kind: 'negated' },
      { label: 'Treatment', value: records[1].treatment, context: 'Week 6', lines: [1, 2], kind: 'status' },
    ],
  },
];
export function activeRecordAt(time) {
  if (time < chapters[2].start || time >= chapters[3].start) return 0;
  return Math.max(0, records.findLastIndex((_, row) => time >= timing.rowStart + row * timing.rowStep));
}
export function patientAt(time) { return records[activeRecordAt(time)].id; }

// Individual lesion layers, on the original 1024 × 1536 artwork canvas.
export const lesionSources = [
  { x: 381, y: 331, w: 101, h: 95, cx: 431.5, cy: 378.5 },
  { x: 363, y: 498, w: 131, h: 133, cx: 428.5, cy: 564.5 },
  { x: 472, y: 679, w: 76, h: 77, cx: 510, cy: 717.5 },
];
export const visitLesions = [
  [{ source: 0, from: 1, to: 1 }, { source: 1, from: 1, to: 1 }, { source: 2, from: 1, to: 1 }],
  [{ source: 0, from: 1, to: .76 }, { source: 1, from: 1, to: .66 }, { source: 2, from: 1, to: 0 }],
  [{ source: 0, from: .76, to: 0 }, { source: 1, from: .66, to: .45 }, { source: 0, from: 0, to: .65, at: [582, 409] }],
];
export const patientLesions = {
  'PAT-001': visitLesions[0],
  'PAT-002': [{ source: 0, to: 1.15, at: [582, 385] }, { source: 1, to: 1.1 }, { source: 2, to: .85 }],
  'PAT-003': [{ source: 0, to: .7 }, { source: 1, to: .65 }],
};

export function chapterAt(time) {
  return chapters.findLastIndex(chapter => time >= chapter.start);
}
export const clamp = n => Math.min(1, Math.max(0, n));
export const ease = n => { const t = clamp(n); return t * t * (3 - 2 * t); };
export function motionAt(time, spec) {
  const progress = ease((time - spec.start) / (spec.duration ?? 0.7));
  const exit = spec.end == null ? 1 : 1 - ease((time - spec.end) / (spec.exit ?? 0.4));
  const from = spec.from ?? [0, 0];
  const to = spec.to ?? [0, 0];
  const movement = spec.moveStart == null ? progress : ease((time - spec.moveStart) / (spec.moveDuration ?? .8));
  const state = {
    opacity: +((spec.instant ? (time >= spec.start && (spec.end == null || time < spec.end) ? 1 : 0) : progress * exit) * (spec.opacity ?? 1)).toFixed(4),
    transform: `translate(${(from[0] + (to[0] - from[0]) * movement).toFixed(2)} ${(from[1] + (to[1] - from[1]) * movement).toFixed(2)})`,
  };
  if (spec.scaleFrom != null) {
    const scale = spec.scaleFrom + (spec.scaleTo - spec.scaleFrom) * (spec.moveStart == null ? progress : movement);
    const [x, y] = spec.pivot;
    state.transform += ` translate(${x} ${y}) scale(${scale.toFixed(4)}) translate(${-x} ${-y})`;
  }
  if (spec.settleAt != null) state.opacity *= 1 - ease((time - spec.settleAt) / .6) * (1 - spec.settleOpacity);
  if (spec.windows) {
    state.opacity *= Math.max(...spec.windows.map(([start, end]) =>
      ease((time - start) / .4) * (end == null ? 1 : 1 - ease((time - end) / .4))));
  }
  if (spec.draw) {
    state['stroke-dasharray'] = progress === 1 ? 'none' : '1';
    state['stroke-dashoffset'] = +(1 - progress).toFixed(4);
  }
  return state;
}
