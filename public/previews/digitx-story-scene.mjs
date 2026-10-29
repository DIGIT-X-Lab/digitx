import { chapters, fields, records, timing, lesionSources, visitLesions, patientLesions, patientAssets, reportExamples, keplerAnswers } from './digitx-story-data.mjs';
import { createKnowledgeNetwork } from './digitx-story-network.mjs';
import { keplerEffectsMarkup } from './digitx-story-kepler.mjs';

const ink = '#f1eeea', muted = '#a59e96', line = '#4d4741', bg = '#0b0a09';
const coral = '#e36b63', blue = '#a9bbc9', sage = '#a5b49f';
const reportHighlight = '#ef6257';
const asset = name => `/illustrations/anatomy/${name}.webp`;
const esc = s => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const text = (x, y, content, size = 22, colour = ink, extra = '') => `<text x="${x}" y="${y}" font-size="${size}" fill="${colour}" ${extra}>${esc(content)}</text>`;
const path = (d, colour = line, extra = '') => `<path d="${d}" fill="none" stroke="${colour}" ${extra.includes('stroke-width=') ? '' : 'stroke-width="1.25"'} ${extra}/>`;
const image = (name, x, y, w, h, extra = '') => `<image href="${asset(name)}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet" ${extra}/>`;
const dot = (x, y, r = 4, colour = ink) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${colour}"/>`;

export function createScene() {
  const motions = [];
  const move = (id, contents, spec) => {
    motions.push({ id, ...spec });
    return `<g id="${id}" opacity="0">${contents}</g>`;
  };
  const phase = (i, contents) => move(`phase-${i}`, contents, {
    start: chapters[i].start, duration: .5,
    end: i === chapters.length - 1 ? undefined : chapters[i + 1].start - .3, exit: .3,
  });
  const lesion = (entry, animatedId, start) => {
    const source = lesionSources[entry.source];
    const target = entry.at ?? [source.cx, source.cy];
    const contents = `<g clip-path="url(#lesion-${entry.source})">${image('tumour-overlay', 0, 0, 1024, 1536)}</g>`;
    const spec = { start, duration: .9, instant: true, scaleFrom: entry.from ?? entry.to, scaleTo: entry.to, pivot: [source.cx, source.cy], from: [target[0] - source.cx, target[1] - source.cy], to: [target[0] - source.cx, target[1] - source.cy] };
    return animatedId ? move(animatedId, contents, spec) : `<g transform="translate(${target[0] - source.cx} ${target[1] - source.cy}) translate(${source.cx} ${source.cy}) scale(${entry.to}) translate(${-source.cx} ${-source.cy})">${contents}</g>`;
  };
  const lesions = (entries, x, y, w, h, prefix, start = 0) => `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="0 0 1024 1536" preserveAspectRatio="xMidYMid meet">${entries.map((entry, i) => lesion(entry, prefix ? `${prefix}-${i}` : null, start + i * .08)).join('')}</svg>`;
  const cohortStart = chapters[2].start, connectStart = chapters[3].start;
  const patient2Time = timing.rowStart + 2 * timing.rowStep;
  const patient3Time = timing.rowStart + 3 * timing.rowStep;

  let markup = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1480 800" role="img" aria-label="From human observations to connected biological investigation" aria-describedby="scene-description">
  <desc id="scene-description">A front-facing wireframe human generates a sequence of images and varied reports. Tissue measurements and structured facts form patient records, which connect into an inspectable representation for computational research. All people and values are fictional examples.</desc>
  <style>text{font-family:Inter,Arial,sans-serif;font-weight:400;letter-spacing:-.35px} .tabular{font-variant-numeric:tabular-nums} .small{letter-spacing:0}</style>
  <defs>${lesionSources.map((s, i) => `<clipPath id="lesion-${i}" clipPathUnits="userSpaceOnUse"><rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}"/></clipPath>`).join('')}
    <filter id="report-text-marker" x="-.015" y="-.15" width="1.03" height="1.35" color-interpolation-filters="sRGB">
      <feFlood flood-color="#301714" result="backing"/>
      <feMerge><feMergeNode in="backing"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="1480" height="800" fill="${bg}"/>
  ${move('investigation-human-shift', move('human-presence',
    move('anchor-initial', image('front-clean', 40, 134, 416, 624, 'opacity=".82"'), { start: -1, end: patient2Time, instant: true, windows: [[-1, 7.9], [cohortStart - .35]] }) +
    move('anchor-second', image(patientAssets['PAT-002'], 40, 134, 416, 624, 'opacity=".82"'), { start: patient2Time, end: patient3Time, instant: true }) +
    move('anchor-third', image(patientAssets['PAT-003'], 40, 134, 416, 624, 'opacity=".82"'), { start: patient3Time, end: chapters[3].start, instant: true }) +
    move('anchor-return', image('front-clean', 40, 134, 416, 624, 'opacity=".82"'), { start: chapters[3].start, instant: true }) +
    move('identity-initial', text(248, 765, 'PAT-001', 20, ink, 'text-anchor="middle"'), { start: -1, end: patient2Time, instant: true }) +
    move('identity-second', text(248, 765, 'PAT-002', 20, ink, 'text-anchor="middle"'), { start: patient2Time, end: patient3Time, instant: true }) +
    move('identity-third', text(248, 765, 'PAT-003', 20, ink, 'text-anchor="middle"'), { start: patient3Time, end: chapters[3].start, instant: true }) +
    move('identity-return', text(248, 765, 'PAT-001', 20, ink, 'text-anchor="middle"'), { start: chapters[3].start, instant: true }) +
    move('anchor-tumour', image('tumour-overlay', 40, 134, 416, 624, 'opacity=".9"'), { start: 6, end: 8.1, exit: .65 }) +
    move('anchor-muscle', image('muscle', 40, 134, 416, 624, 'opacity=".82"'), { start: 7.9, duration: .4, end: 9.5, exit: .4 }) +
    move('anchor-fat', image('fat', 40, 134, 416, 624, 'opacity=".82"'), { start: 9.5, duration: .4, end: 11.2, exit: .5 }) +
    records.map((record, row) => move(`anchor-record-${row}`, lesions(row === 1 ? visitLesions[1] : patientLesions[record.id], 40, 134, 416, 624), { start: timing.rowStart + row * timing.rowStep, end: row === records.length - 1 ? chapters[3].start : timing.rowStart + (row + 1) * timing.rowStep, instant: true })).join('') +
    move('anchor-final-tumour', lesions(patientLesions['PAT-001'], 40, 134, 416, 624), { start: chapters[3].start, instant: true }),
    { start: -1, windows: [[-1, 11.15], [cohortStart - .35]], from: [0, 0], to: [55, 0], moveStart: connectStart, moveDuration: .8 }), { start: -1, end: chapters[4].start, exit: .45, from: [0, 0], to: [-35, 0], moveStart: chapters[4].start, moveDuration: .5 })}`;

  // 01: a longitudinal image strip above the clinical-document sequence.
  const visits = [
    ['Baseline', visitLesions[0]],
    ['Week 3', [{ source: 0, from: 1, to: .9 }, { source: 1, from: 1, to: .82 }, { source: 2, from: 1, to: .5 }]],
    ['Week 6', visitLesions[1]],
    ['Week 9', [{ source: 0, from: .76, to: .4 }, { source: 1, from: .66, to: .55 }, { source: 0, from: 0, to: .3, at: [582, 409] }]],
    ['Week 12', visitLesions[2]],
  ];
  const scan = (x, label, entries, i) => move(`scan-${i}`, `<g transform="translate(${x} 222)">
    <rect x="12" y="-12" width="150" height="225" fill="${bg}" stroke="${line}" opacity=".4"/>
    <rect x="6" y="-6" width="150" height="225" fill="${bg}" stroke="${line}" opacity=".7"/>
    <rect width="150" height="225" fill="${bg}" stroke="${muted}" stroke-width=".9"/>
    ${image('front-clean', 0, 5, 150, 215, 'opacity=".8"')}
    ${lesions(entries, 0, 5, 150, 215, `visit-${i}-lesion`, .65 + i * .55)}
    ${text(75, 259, label, 19, muted, 'text-anchor="middle"')}
    </g>`, { start: .5 + i * .55, from: [-20, 0], duration: .6 });
  const document = (x, title, description, i) => move(`report-${i}`, `<g transform="translate(${x} 595)">
    <path d="M0 0H205V112H0Z" fill="${bg}" stroke="${line}"/>
    ${text(17, 32, title, 21)}${text(17, 61, description, 15, muted)}
    ${path('M17 81H185', line)}${path('M17 93H150', line)}
    </g>`, { start: 3.25 + i * .22, from: [0, 12], duration: .6 });
  markup += phase(0, text(56, 85, chapters[0].title, 45) +
    text(490, 181, 'Images over time', 27) +
    move('observation-link', `<svg x="411" y="407" width="32" height="48" viewBox="0 0 32 48">${path('m7 7 17 17L7 41', ink, 'stroke-linecap="square" stroke-linejoin="miter"')}</svg>`, { start: .35 }) +
    visits.map(([label, entries], i) => scan(490 + i * 190, label, entries, i)).join('') +
    move('observation-time', path('M565 512H1325', line) + [565, 755, 945, 1135, 1325].map(x => dot(x, 512, 3, muted)).join(''), { start: 2.9, duration: .6 }) +
    move('report-row-title', text(490, 568, 'Reports and clinical context', 27), { start: 3.05, duration: .5 }) +
    document(490, 'Radiology', 'Imaging findings', 0) +
    document(728, 'Pathology', 'Tissue findings', 1) +
    document(966, 'Laboratory', 'Blood biomarkers', 2) +
    document(1204, 'Treatment notes', 'Therapy and follow-up', 3)
  );

  // 02: one source occupies the left-hand stage at a time.
  const measured = [
    ['Tumour volume', records[0].tumour, coral],
    ['Muscle volume', records[0].muscle, blue],
    ['Fat volume', records[0].fat, sage],
  ];
  const measurements = measured.map(([label, value, colour], i) => {
    const y = 325 + i * 114;
    return move(`measurement-${i}`, text(506, y, label, 26, colour) + text(1280, y, value, 34, ink, 'text-anchor="end" class="tabular"') + path(`M506 ${y + 30}H1280`, line), { start: timing.imageStart + i * timing.imageStep, from: [-20, 0], duration: .8 });
  }).join('');
  let reportSequence = '';
  reportExamples.forEach((report, i) => {
    const start = timing.reportStart + i * timing.reportStep;
    const end = i === reportExamples.length - 1 ? timing.reportEnd : start + timing.reportStep - .2;
    const page = `<path d="M118 207H738V637H118Z" fill="${bg}" stroke="${line}" opacity=".4"/>
      <path d="M103 222H723V652H103Z" fill="${bg}" stroke="${muted}" opacity=".5"/>
      <path d="M88 237H708V667H88Z" fill="#11100e" stroke="${muted}" stroke-width="1"/>
      ${text(122, 279, 'PAT-001', 16, muted)}${text(674, 279, report.visit, 16, muted, 'text-anchor="end"')}
      ${text(122, 322, report.title, 29)}${path('M122 344H674', line)}
      ${report.lines.map((line, j) => text(122, 399 + j * 42, line, 23, '#c4beb7')).join('')}
      ${text(122, 618, 'Narrative clinical report', 16, muted)}`;
    let highlights = '', facts = '';
    report.facts.forEach((fact, j) => {
      const factStart = start + .8 + j * .8;
      highlights += move(`report-context-${i}-${j}`, fact.lines.map(line =>
        text(122, 399 + line * 42, report.lines[line], 23, reportHighlight, 'filter="url(#report-text-marker)"')
      ).join(''), { start: factStart - .3, duration: .2, end: j === report.facts.length - 1 ? end : factStart + .35, exit: .15 });
      const y = 323 + j * 116;
      facts += move(`narrative-fact-${i}-${j}`, text(856, y, fact.label, 19, muted) + text(856, y + 39, fact.value, 27, blue, 'class="tabular"') +
        (fact.unit ? text(898, y + 39, fact.unit, 20, blue) : '') + text(1390, y + 39, fact.context, 18, ink, 'text-anchor="end"') + path(`M856 ${y + 64}H1390`, line), { start: factStart, duration: .55, from: [0, 8] });
    });
    reportSequence += move(`narrative-report-${i}`, page + highlights +
      text(88, 188, 'Running text', 27) + text(856, 188, 'Computable facts', 27) +
      text(856, 263, 'Observation', 16, muted) + text(1390, 263, 'Context', 16, muted, 'text-anchor="end"') +
      `<svg x="765" y="422" width="26" height="40" viewBox="0 0 32 48">${path('m7 7 17 17L7 41', ink)}</svg>` + facts +
      move(`narrative-note-${i}`, text(740, 724, report.note, 21, muted, 'text-anchor="middle"'), { start: start + 2.7, duration: .4 }),
      { start: i === 0 ? 11.6 : start, duration: .35, end, exit: .2, from: [0, 10] });
  });
  markup += phase(1, text(56, 85, chapters[1].title, 45) +
    move('image-measurement-section', text(506, 193, 'Images into measurements', 29) + text(506, 238, 'Tumours, anatomy and body composition', 19, muted) + measurements, { start: 5.6, duration: .5, end: 11.1, exit: .4 }) + reportSequence
  );

  // 03: one schema, repeated visits, then more people. No fabricated counters.
  let table = text(465, 203, 'A shared record', 27) + text(1410, 203, 'Measurements + context + time', 18, muted, 'text-anchor="end"');
  fields.forEach(field => { table += text(field.x, 274, field.label, 18, muted); });
  table += path('M465 296H1410', muted);
  records.forEach((record, row) => {
    const y = 351 + row * 78;
    const start = timing.rowStart + row * timing.rowStep;
    table += move(`record-band-${row}`, `<rect x="451" y="${y - 38}" width="972" height="65" fill="#11100e"/>` + path(`M465 ${y + 35}H1410`, line), { start, duration: .5 });
    table += move(`record-active-${row}`, `<rect x="451" y="${y - 38}" width="972" height="65" fill="#24201b"/>` + dot(437, y - 7, 4, ink), { start, end: row === records.length - 1 ? chapters[3].start : start + timing.rowStep, instant: true });
    fields.forEach((field, col) => {
      const colour = field.key === 'tumour' ? coral : field.key === 'muscle' ? blue : field.key === 'fat' ? sage : ink;
      table += move(`cell-${row}-${col}`, text(field.x, y, record[field.key], field.key === 'histology' ? 17 : 20, colour, 'class="tabular"'), { start: start + .15 + col * .07, duration: .45, from: [0, 8] });
    });
  });
  table += move('cohort-note', text(465, 727, 'One person stays whole. More people become comparable.', 23, muted), { start: cohortStart + 5.4 });
  markup += phase(2, text(56, 85, chapters[2].title, 45) + table);

  // 04–05: one full radial hierarchy. Edges, points and labels paint in
  // separate layers so a later branch can never cut through an earlier label.
  const network = createKnowledgeNetwork();
  let graphEdges = '', graphNodes = '', graphLabels = '';
  network.edges.forEach((edge, i) => {
    const start = connectStart + .5 + edge.depth * .23 + i * .006;
    graphEdges += move(`network-edge-${i}`, path(edge.d, '#b4aa99', `stroke-opacity=".53" stroke-width="${edge.depth < 3 ? 1.2 : .85}" pathLength="1"`), { start, duration: .8, draw: true });
  });
  const radialLabel = (node, label, size, radius, colour, role) => {
    const left = Math.cos(node.angle * Math.PI / 180) < 0;
    const rad = node.angle * Math.PI / 180;
    const x = network.centre.x + Math.cos(rad) * radius * network.stretch;
    const y = network.centre.y + Math.sin(rad) * radius;
    const rotation = node.angle + (left ? 180 : 0);
    const width = label.length * size * .55 + 8;
    const inside = role === 'field';
    const anchor = inside ? (left ? 'start' : 'end') : (left ? 'end' : 'start');
    const offset = (left ? -1 : 1) * (inside ? -6 : 6);
    const rx = anchor === 'end' ? offset - width + 3 : offset - 3;
    return `<g transform="translate(${x} ${y}) rotate(${rotation})"><rect x="${rx}" y="${-size + 1}" width="${width}" height="${size + 5}" fill="${bg}"/>${text(offset, 3, label, size, colour, `text-anchor="${anchor}"`)}</g>`;
  };
  const innerLabel = (node, colour = ink) => {
    const rad = node.angle * Math.PI / 180;
    const radius = node.kind === 'person' ? 76 : 112;
    const size = node.kind === 'person' ? 13 : 11;
    const x = network.centre.x + Math.cos(rad) * radius;
    const y = network.centre.y + Math.sin(rad) * radius;
    const rotation = node.angle + 90 + (Math.sin(rad) > 0 ? 180 : 0);
    const width = node.label.length * size * .6 + 8;
    return `<g transform="translate(${x} ${y}) rotate(${rotation})"><rect x="${-width / 2}" y="-11" width="${width}" height="19" fill="${bg}"/>${text(0, 3, node.label, size, colour, 'text-anchor="middle"')}</g>`;
  };
  network.nodes.forEach((node, i) => {
    const colour = node.field === 'tumour' ? coral : node.kind === 'value' && node.attribute !== 'unit' ? blue : muted;
    const radius = node.kind === 'person' ? 4 : node.kind === 'value' ? 2.7 : node.kind === 'field' ? 2.2 : 1.7;
    graphNodes += move(`network-node-${node.id}`, `<circle cx="${node.x}" cy="${node.y}" r="${radius}" fill="${node.kind === 'value' ? colour : bg}" stroke="${colour}" stroke-width=".8"/>`, { start: connectStart + .6 + node.depth * .23 + i * .006, duration: .6 });
    if (node.kind === 'value') graphLabels += move(`network-label-${node.id}`, radialLabel(node, node.label, 12, 240, ink, 'value'), { start: connectStart + 2.5 + i * .006, duration: .6 });
    if (node.kind === 'field') graphLabels += move(`network-label-${node.id}`, radialLabel(node, node.label, 11, 187, muted, 'field'), { start: connectStart + 2.3 + i * .006, duration: .6 });
    if (node.kind === 'person') graphLabels += move(`network-label-${node.id}`, innerLabel(node), { start: connectStart + 1.4, duration: .6 });
  });
  let evidence = '';
  network.investigations.forEach((query, q) => {
    let edges = '', nodes = '', labels = '';
    network.edges.filter(edge => query.edges.includes(edge.id)).forEach(edge => {
      edges += move(`evidence-edge-${q}-${edge.id}`, path(edge.d, blue, 'stroke-width="1.7" pathLength="1"'), { start: query.start + edge.depth * .035, duration: .4, draw: true });
    });
    network.nodes.filter(node => query.nodes.includes(node.id)).forEach(node => {
      const colour = node.field === 'tumour' ? coral : blue;
      nodes += `<circle cx="${node.x}" cy="${node.y}" r="${node.kind === 'value' ? 3.5 : 2.5}" fill="${node.kind === 'value' ? colour : bg}" stroke="${colour}" stroke-width="1.1"/>`;
      if (node.kind === 'value') {
        nodes += `<circle cx="${node.x}" cy="${node.y}" r="7" fill="none" stroke="${colour}" stroke-opacity=".65" stroke-width=".9"/>`;
        labels += radialLabel(node, node.label, 12, 240, colour, 'value');
      }
      if (node.kind === 'field') labels += radialLabel(node, node.label, 11, 187, ink, 'field');
      if (node.kind === 'person' || node.kind === 'visit') labels += innerLabel(node);
    });
    evidence += move(`answer-evidence-${q}`, edges + nodes + labels, { start: query.start, duration: .4, end: query.end, exit: .2 });
  });
  const centreLabel = move('network-centre-label', `<circle cx="${network.centre.x}" cy="${network.centre.y}" r="33" fill="${bg}"/>${text(network.centre.x, network.centre.y - 4, 'Connected', 13, ink, 'text-anchor="middle"')}${text(network.centre.x, network.centre.y + 13, 'records', 13, muted, 'text-anchor="middle"')}`, { start: connectStart + .5 });
  markup += move('knowledge-network',
    move('network-context', graphEdges + graphNodes + graphLabels, { start: connectStart - .1, settleAt: keplerAnswers[0].at, settleOpacity: .25 }) + evidence + centreLabel,
    { start: connectStart + .2, duration: .4, from: [0, 0], to: [-445, 15], moveStart: chapters[4].start, moveDuration: .9, scaleFrom: 1, scaleTo: 1.05, pivot: [network.centre.x, network.centre.y] });
  markup += phase(3, text(56, 85, chapters[3].title, 45) +
    move('network-caption', text(935, 784, 'Images, measurements and clinical context, connected.', 21, muted, 'text-anchor="middle"'), { start: connectStart + 4, duration: .5 }));
  const dialogue = keplerAnswers.map((message, i) => message.lines.map((line, j) => move(`kepler-message-${i}-${j}`, text(1002, message.y + j * 31, line, 21, i === 2 ? blue : ink), { start: message.at + j * .17, duration: .45, from: [0, 7], settleAt: keplerAnswers[i + 1]?.at, settleOpacity: .62 })).join('')).join('');
  const chat = `<rect x="976" y="184" width="454" height="520" rx="12" fill="#100f0d" stroke="#37332e" stroke-width=".8"/>` +
    keplerEffectsMarkup(chapters[4].start + .65) + text(1066, 237, 'KEPLER', 20) +
    path('M1002 279H1404', line) + text(1002, 316, 'Review the connected records.', 17, muted) +
    move('kepler-greeting', text(1002, 360, 'Hi, I’m Kepler.', 23), { start: chapters[4].start + 1.35, duration: .45, from: [0, 7] }) + dialogue;
  markup += phase(4, text(56, 85, chapters[4].title, 43) +
    move('kepler-dialogue', chat, { start: chapters[4].start + .65, duration: .5, from: [14, 0] }));
  markup += '</svg>';
  return { markup, motions };
}
