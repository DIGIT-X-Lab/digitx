import { chapters, chapterAt, duration, motionAt, patientAt, activeRecordAt } from './digitx-story-data.mjs';
import { createScene } from './digitx-story-scene.mjs';
import { attachKeplerEffects } from './digitx-story-kepler.mjs';

const $ = selector => document.querySelector(selector);
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const params = new URLSearchParams(location.search);
const inPage = params.get('layout') === 'home';
const embedded = params.get('embed') === '1';
const researchEmbed = embedded && params.get('layout') === 'research';
if (embedded) document.body.classList.add('embedded');
if (researchEmbed) document.body.classList.add('research-embedded');
if (inPage) {
  document.body.classList.add('page-context');
  document.querySelectorAll('[data-page-context]').forEach(el => { el.hidden = false; });
  $('.study-label').textContent = 'Homepage placement study';
}
const { markup, motions } = createScene();
$('#scene').innerHTML = markup;
// Align the slide with the website gutters while retaining each scene's
// original heading and its place in the animation timeline.
if (researchEmbed) $('#scene > svg').setAttribute('viewBox', '56 32 1392 768');
const renderKeplerEffects = attachKeplerEffects($('#scene svg'));
const animated = motions.map(spec => ({ spec, element: document.getElementById(spec.id), previous: {} }));
$('#chapters').innerHTML = chapters.map((chapter, i) => `<button class="chapter" type="button" data-chapter="${i}" aria-label="Show stage ${i + 1}: ${chapter.name}"><span class="chapter-number">0${i + 1}</span>${chapter.name}</button>`).join('');
const chapterButtons = [...document.querySelectorAll('[data-chapter]')];
let time = 0, effectsTime = 0, playing = false, ready = false, raf = 0, lastTimestamp = null, previousChapter = -1;
let embedStarted = false;
if (embedded) {
  window.addEventListener('message', event => {
    if (event.source !== window.parent || event.origin !== location.origin || event.data?.type !== 'digitx-story-visibility') return;
    if (!event.data.visible) pause();
    else if (ready && !embedStarted && !reduced.matches) { embedStarted = true; play(); }
  });
  const reportSize = () => window.parent.postMessage({ type: 'digitx-story-size', height: Math.ceil($('main').getBoundingClientRect().height) }, location.origin);
  new ResizeObserver(reportSize).observe($('main'));
}
$('#scrub').max = String(duration);

function updateControls() {
  $('#play-label').textContent = playing ? 'Pause' : time >= duration ? 'Resume motion' : 'Play';
  $('#play-icon').setAttribute('d', playing ? 'M4 3H6V13H4ZM10 3H12V13H10Z' : 'M4 2L13 8L4 14Z');
  $('#play').setAttribute('aria-label', playing ? 'Pause animation' : time >= duration ? 'Resume KEPLER animation' : 'Play animation');
}
function render() {
  for (const item of animated) {
    const state = motionAt(time, item.spec);
    for (const [attribute, value] of Object.entries(state)) {
      if (item.previous[attribute] !== value) item.element.setAttribute(attribute, String(value));
    }
    item.previous = state;
  }
  renderKeplerEffects(effectsTime);
  $('#scrub').value = String(time);
  $('#scrub').style.background = `linear-gradient(to right, var(--ink) ${100 * time / duration}%, var(--line) ${100 * time / duration}%)`;
  $('#time').textContent = `0:${String(Math.floor(time)).padStart(2, '0')} / 0:${duration}`;
  const current = Math.max(0, chapterAt(time));
  if (current !== previousChapter) {
    chapterButtons.forEach((button, i) => i === current ? button.setAttribute('aria-current', 'step') : button.removeAttribute('aria-current'));
    $('#stage-status').textContent = `${chapters[current].title} ${chapters[current].description}`;
    $('#mobile-title').textContent = chapters[current].title;
    $('#mobile-description').textContent = chapters[current].description;
    previousChapter = current;
  }
}
function tick(timestamp) {
  if (!playing) return;
  const previousTime = time;
  if (lastTimestamp != null) effectsTime += (timestamp - lastTimestamp) / 1000;
  time = Math.min(duration, effectsTime);
  lastTimestamp = timestamp;
  if (time !== previousTime) render();
  else renderKeplerEffects(effectsTime);
  if (time >= duration && reduced.matches) { pause(); return; }
  raf = requestAnimationFrame(tick);
}
function pause() { playing = false; cancelAnimationFrame(raf); lastTimestamp = null; updateControls(); }
function play() {
  if (!ready) return;
  playing = true; lastTimestamp = null; cancelAnimationFrame(raf); updateControls();
  raf = requestAnimationFrame(tick);
}
function seek(value) { if (embedded) embedStarted = true; pause(); time = Math.max(0, Math.min(duration, value)); effectsTime = time; render(); updateControls(); }
$('#play').addEventListener('click', () => playing ? pause() : play());
$('#replay').addEventListener('click', () => { seek(0); play(); });
$('#scrub').addEventListener('input', event => seek(Number(event.target.value)));
chapterButtons.forEach((button, i) => button.addEventListener('click', () => seek(chapters[i].inspect)));
document.addEventListener('keydown', event => {
  if (embedded && event.key === 'Escape') {
    pause();
    window.parent.postMessage({ type: 'digitx-story-close' }, location.origin);
    return;
  }
  if (['INPUT', 'BUTTON', 'SUMMARY', 'A'].includes(document.activeElement?.tagName) || event.ctrlKey || event.metaKey || event.altKey) return;
  if (event.code === 'Space') { event.preventDefault(); playing ? pause() : play(); }
  if (event.key === 'ArrowRight') { event.preventDefault(); seek(chapters[Math.min(chapters.length - 1, chapterAt(time) + 1)].inspect); }
  if (event.key === 'ArrowLeft') { event.preventDefault(); seek(chapters[Math.max(0, chapterAt(time) - 1)].inspect); }
});
document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
reduced.addEventListener('change', () => { if (reduced.matches) seek(chapters[Math.max(0, chapterAt(time))].inspect); });

render();
const imageSources = [...new Set([...$('#scene').querySelectorAll('image')].map(el => el.getAttribute('href')))];
try {
  await Promise.all([document.fonts.load('400 22px Inter'), ...imageSources.map(src => new Promise((resolve, reject) => {
    const img = new Image(); img.onload = () => img.decode().then(resolve, reject); img.onerror = reject; img.src = src;
  }))]);
  ready = true;
  $('#scene').setAttribute('aria-busy', 'false');
  $('#load-status').hidden = true;
  ['#play', '#replay', '#scrub'].forEach(id => { $(id).disabled = false; });
  // A query parameter opens a particular still without racing an autoplay.
  const requested = Number(params.get('stage'));
  const requestedTime = Number(params.get('from'));
  if (requested >= 1 && requested <= chapters.length) seek(chapters[requested - 1].inspect);
  else if (params.has('from') && Number.isFinite(requestedTime)) {
    seek(requestedTime);
    if (!reduced.matches) play();
  }
  else if (reduced.matches) seek(chapters[0].inspect);
  else if (embedded) { /* Wait for the parent to confirm this section is visible. */ }
  else if (inPage) {
    let started = false;
    const observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      if (entry.intersectionRatio >= .35 && !started) { started = true; play(); }
      else if (entry.intersectionRatio < .1 && playing) pause();
    }, { threshold: [0, .1, .35] });
    observer.observe($('#scene'));
  }
  else play();
  if (embedded) window.parent.postMessage({ type: 'digitx-story-ready' }, location.origin);
} catch {
  $('#load-status').textContent = 'Some artwork could not be loaded. You can still explore the stages below.';
  $('#scene').setAttribute('aria-busy', 'false');
  ready = true;
  ['#play', '#replay', '#scrub'].forEach(id => { $(id).disabled = false; });
  seek(chapters[0].inspect);
  if (embedded) window.parent.postMessage({ type: 'digitx-story-ready', degraded: true }, location.origin);
}
// Inspection hook for the prototype, not a simulated research backend.
window.digitxStory = { seek, play, pause, state: () => ({ time, effectsTime, playing, ready, stage: chapterAt(time) + 1, patient: patientAt(time), record: activeRecordAt(time) }), duration };
