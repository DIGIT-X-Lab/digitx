// Deterministic SVG frames. No browser or real-time recording is involved.
import fs from 'node:fs';
import { once } from 'node:events';
import { createScene } from '../../public/previews/digitx-story-scene.mjs';
import { motionAt } from '../../public/previews/digitx-story-data.mjs';
import { keplerEffectsMarkup } from '../../public/previews/digitx-story-kepler.mjs';

const work = process.env.DIGITX_EXPORT_DIR || '/tmp/digitx-video-export';
const repo = new URL('../../', import.meta.url).pathname;
const traces = JSON.parse(fs.readFileSync(`${work}/logo-traces.json`, 'utf8'));
const { markup, motions } = createScene();
const specs = new Map(motions.map(spec => [spec.id, spec]));
const base = markup.replace(keplerEffectsMarkup(38.15), 'KEPLER_EFFECTS_HERE');
const bg = '#0b0a09';
const clamp = x => Math.max(0, Math.min(1, x));
const smooth = x => { x = clamp(x); return x * x * (3 - 2 * x); };
function bezier(x, x1, y1, x2, y2) {
  x = clamp(x); let lo = 0, hi = 1;
  const b = (t, a, c) => 3 * (1 - t) ** 2 * t * a + 3 * (1 - t) * t * t * c + t ** 3;
  for (let i = 0; i < 20; i++) { const m = (lo + hi) / 2; if (b(m, x1, x2) < x) lo = m; else hi = m; }
  return b((lo + hi) / 2, y1, y2);
}
const ease = x => bezier(x, .65, 0, .35, 1);
const attrs = values => Object.entries(values).map(([k, v]) => `${k}="${v}"`).join(' ');
function story(time) {
  return base.replace(/<g id="([^"]+)" opacity="0">/g, (all, id) => specs.has(id)
    ? `<g id="${id}" ${attrs(motionAt(Math.min(time, 48), specs.get(id)))}>` : all)
    .replace('KEPLER_EFFECTS_HERE', keplerEffectsMarkup(time))
    .replace(/href="\/illustrations\/anatomy\/([^".]+)\.webp"/g, (_, name) => `href="file://${repo}public/illustrations/anatomy/${name}.png"`)
    .replace(/^<svg /, '<svg x="0" y="16.25" width="1480" height="800" ');
}
function ending(t) {
  const ms = t * 1000;
  const settle = ease((ms - 3500) / 1100);
  const scale = 1.35 - .35 * settle;
  const tx = 318.2 * (1 - settle), ty = 38.85 * (1 - settle);
  const outline = 1 - clamp((ms - 1850) / 300);
  const solid = bezier((ms - 1850) / 300, 0, 0, .58, 1);
  const tone = ease((ms - 2200) / 1300);
  const colour = '#' + [119, 113, 106].map((c, i) => Math.round(c + ([241, 238, 234][i] - c) * tone).toString(16).padStart(2, '0')).join('');
  const gloss = bezier((ms - 2200) / 1300, .42, 0, .58, 1);
  const person = bezier((ms - 4250) / 750, .22, 1, .36, 1);
  const website = bezier((ms - 4700) / 750, .22, 1, .36, 1);
  return `<defs>
    <filter id="logo-invert" color-interpolation-filters="sRGB"><feComponentTransfer><feFuncR type="table" tableValues="1 0"/><feFuncG type="table" tableValues="1 0"/><feFuncB type="table" tableValues="1 0"/></feComponentTransfer></filter>
    <mask id="logo-ink" maskUnits="userSpaceOnUse" x="0" y="0" width="1563" height="1563"><image width="1563" height="1563" href="file://${work}/original-brandImage.png" filter="url(#logo-invert)"/></mask>
    <linearGradient id="logo-silver"><stop offset="0" stop-color="white" stop-opacity="0"/><stop offset=".5" stop-color="white" stop-opacity=".85"/><stop offset="1" stop-color="white" stop-opacity="0"/></linearGradient>
    <clipPath id="website-reveal"><rect x="710.4" y="428" width="${520 * website}" height="50"/></clipPath>
  </defs>
  <g transform="translate(${tx} ${ty}) translate(421.8 377.4) scale(${scale}) translate(-421.8 -377.4)">
    <svg x="236.8" y="192.4" width="370" height="370" viewBox="108 108 1349 1349">
      <g opacity="${outline}" fill="none" stroke="#f1eeea" stroke-width="3.6" stroke-linejoin="round" stroke-linecap="round">
        ${traces.map(p => `<path d="${p.d}" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${1 - bezier((ms - p.delay) / p.duration, .4, 0, .2, 1)}"/>`).join('')}
      </g>
      <g opacity="${solid}" mask="url(#logo-ink)"><rect width="1563" height="1563" fill="${colour}"/><rect x="-700" y="-300" width="700" height="2200" fill="url(#logo-silver)" opacity="${.8 * (1 - Math.abs(gloss * 2 - 1))}" transform="translate(${gloss * 2800} 0) skewX(-17)"/></g>
    </svg>
  </g>
  <g font-family="Inter,Arial,sans-serif" fill="#f1eeea">
    <g opacity="${person}" transform="translate(${37 * (1 - person)} 0)">
      <text x="710.4" y="344" font-size="41.625" font-weight="500" letter-spacing="-1.25">L.K. Shiyam Sundar</text>
      <text x="710.4" y="391" font-size="23.125" fill="#c4beb7">lalith.shiyam@med.uni-muenchen.de</text>
    </g>
    <text x="710.4" y="454" font-size="27.75" letter-spacing="-.55" opacity="${website}" clip-path="url(#website-reveal)">thedigitxlab.com</text>
  </g>`;
}
export function frame(t) {
  const content = t < 54 ? `<g opacity="${1 - smooth((t - 53) / .75)}">${story(t)}</g>` : ending(t - 54);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="3840" height="2160" viewBox="0 0 1480 832.5"><rect width="1480" height="832.5" fill="${bg}"/><g opacity="${1 - smooth((t - 62.5) / 1.5)}">${content}</g></svg>`;
}

if (process.argv.includes('--still')) {
  process.stdout.write(frame(Number(process.argv[process.argv.indexOf('--still') + 1])));
} else {
  const first = Number(process.argv[2] || 0), end = Number(process.argv[3] || 3840);
  for (let i = first; i < end; i++) {
    if (!process.stdout.write(JSON.stringify({ i, svg: frame(i / 60) }) + '\n')) await once(process.stdout, 'drain');
  }
}
