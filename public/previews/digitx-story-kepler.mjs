import { MODE_FRAMES, resolvePreset } from './vendor/thinking-orbs/engine.es.js';

// The official Thinking Orbs geometry, painted as SVG instead of canvas.
// No private timer: the story controller supplies the current time.
const start = 38.15;
const beamPerimeter = 2 * (454 + 520 - 4 * 12) + 2 * Math.PI * 12;
const preset = resolvePreset('composing', 64);
const round = n => Math.round(n * 1000) / 1000;
const ink = white => {
  const strength = 1 - white;
  return `rgb(${[241, 238, 234].map(n => Math.round(n * strength)).join(' ')})`;
};

export function keplerEffectsAt(time) {
  const elapsed = Math.max(0, time - start);
  return {
    layers: [{ state: 'composing', opacity: 1, frame: MODE_FRAMES[preset.mode](64, elapsed * preset.speed * .65, preset.opts) }],
    beam: elapsed / 7.5 * beamPerimeter,
    state: 'composing',
  };
}

const orbMarkup = ({ frame, opacity }) => `<g opacity="${round(opacity)}">` +
  frame.lines.map(line => `<line x1="${round(line.x1)}" y1="${round(line.y1)}" x2="${round(line.x2)}" y2="${round(line.y2)}" stroke="${ink(line.white)}" stroke-opacity="${round(line.a ?? 1)}" stroke-width="${round(line.w)}"/>`).join('') +
  frame.dots.map(dot => `<circle cx="${round(dot.x)}" cy="${round(dot.y)}" r="${round(dot.r)}" fill="${ink(dot.white)}" fill-opacity="${round(dot.a ?? 1)}"/>`).join('') + '</g>';

// Native-SVG interpretation of libraries.dev/beam. Continuous light gradients
// follow the rounded border, avoiding segmented strokes or animated filters.
function borderPoint(distance) {
  let d = ((distance % beamPerimeter) + beamPerimeter) % beamPerimeter;
  const arc = Math.PI * 6;
  const segments = [
    [430, t => [988 + t, 184]],
    [arc, t => [1418 + 12 * Math.cos(-Math.PI / 2 + t / 12), 196 + 12 * Math.sin(-Math.PI / 2 + t / 12)]],
    [496, t => [1430, 196 + t]],
    [arc, t => [1418 + 12 * Math.cos(t / 12), 692 + 12 * Math.sin(t / 12)]],
    [430, t => [1418 - t, 704]],
    [arc, t => [988 + 12 * Math.cos(Math.PI / 2 + t / 12), 692 + 12 * Math.sin(Math.PI / 2 + t / 12)]],
    [496, t => [976, 692 - t]],
    [arc, t => [988 + 12 * Math.cos(Math.PI + t / 12), 196 + 12 * Math.sin(Math.PI + t / 12)]],
  ];
  for (const [length, point] of segments) { if (d <= length) return point(d); d -= length; }
  return [988, 184];
}
const beamLights = [
  { id: 'trail', behind: 58, radius: 140, colour: '#a9bbc9' },
  { id: 'head', behind: 0, radius: 75, colour: '#f1eeea' },
];
const beamMarkup = phase => '<defs>' + beamLights.map(light => {
  const [x, y] = borderPoint(phase - light.behind);
  return `<radialGradient id="kepler-beam-${light.id}" gradientUnits="userSpaceOnUse" cx="${round(x)}" cy="${round(y)}" r="${light.radius}"><stop offset="0" stop-color="${light.colour}"/><stop offset=".3" stop-color="${light.colour}" stop-opacity=".8"/><stop offset="1" stop-color="${light.colour}" stop-opacity="0"/></radialGradient>`;
}).join('') + '</defs>' + beamLights.map(light => [
  [9, .055], [4, .19], [1.6, .95],
].map(([width, opacity]) => `<rect x="976" y="184" width="454" height="520" rx="12" fill="none" stroke="url(#kepler-beam-${light.id})" stroke-width="${width}" stroke-opacity="${opacity}"/>`).join('')).join('');

export function keplerEffectsMarkup(time) {
  const state = keplerEffectsAt(time);
  return `<g id="kepler-beam" aria-hidden="true">${beamMarkup(state.beam)}</g><g id="kepler-orb" transform="translate(992 197)" aria-hidden="true">${state.layers.map(orbMarkup).join('')}</g>`;
}

export function attachKeplerEffects(svg) {
  const orb = svg.querySelector('#kepler-orb');
  const beams = beamLights.map(light => ({ ...light, element: svg.querySelector(`#kepler-beam-${light.id}`) }));
  const ns = 'http://www.w3.org/2000/svg';
  orb.replaceChildren();
  const pools = [0].map(() => {
    const group = document.createElementNS(ns, 'g');
    const lines = document.createElementNS(ns, 'g'), dots = document.createElementNS(ns, 'g');
    group.append(lines, dots); orb.append(group);
    return { group, lines, dots, linePool: [], dotPool: [] };
  });
  const attrs = (element, values) => {
    for (const [name, value] of Object.entries(values)) {
      const next = String(typeof value === 'number' ? round(value) : value);
      if (element.getAttribute(name) !== next) element.setAttribute(name, next);
    }
  };
  const paint = (items, pool, container, tag, attributes) => {
    while (pool.length < items.length) {
      const element = document.createElementNS(ns, tag);
      container.append(element); pool.push(element);
    }
    pool.forEach((element, i) => {
      if (i >= items.length) { element.setAttribute('display', 'none'); return; }
      element.removeAttribute('display'); attrs(element, attributes(items[i]));
    });
  };
  return time => {
    if (time < start) return;
    const state = keplerEffectsAt(time);
    pools.forEach((pool, i) => {
      const layer = state.layers[i];
      attrs(pool.group, { opacity: layer?.opacity ?? 0 });
      if (!layer) return;
      paint(layer.frame.lines, pool.linePool, pool.lines, 'line', line => ({ x1: line.x1, y1: line.y1, x2: line.x2, y2: line.y2, stroke: ink(line.white), 'stroke-opacity': line.a ?? 1, 'stroke-width': line.w }));
      paint(layer.frame.dots, pool.dotPool, pool.dots, 'circle', dot => ({ cx: dot.x, cy: dot.y, r: dot.r, fill: ink(dot.white), 'fill-opacity': dot.a ?? 1 }));
    });
    beams.forEach(light => {
      const [cx, cy] = borderPoint(state.beam - light.behind);
      attrs(light.element, { cx, cy });
    });
  };
}
