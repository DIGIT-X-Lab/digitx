// Controller regression harness. Exercises the real controller with a fake
// animation clock and minimal DOM; it does not verify browser rendering.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import * as data from '../public/previews/digitx-story-data.mjs';

const source = (await readFile(new URL('../public/previews/digitx-story.mjs', import.meta.url), 'utf8')).replace(/^import .*;\n/gm, '');
async function boot({ reduced = false, search = '?from=47.9' } = {}) {
  const elements = new Map(), events = new Map(), frames = new Map(), effects = [];
  let frameId = 0, reducedChange;
  const element = key => {
    if (!elements.has(key)) elements.set(key, {
      style: {}, dataset: {}, textContent: '', value: '', hidden: false,
      setAttribute(name, value) { this[name] = value; },
      removeAttribute(name) { delete this[name]; },
      addEventListener(name, fn) { events.set(`${key}:${name}`, fn); },
      querySelectorAll() { return []; },
    });
    return elements.get(key);
  };
  const preference = { matches: reduced, addEventListener(_, fn) { reducedChange = fn; } };
  const document = {
    hidden: false, activeElement: null, body: { classList: { add() {} } }, fonts: { load: async () => [] },
    querySelector: element, querySelectorAll: () => [], getElementById: element,
    addEventListener(name, fn) { events.set(name, fn); },
  };
  const parent = { postMessage() {} };
  const context = vm.createContext({
    ...data, document, window: { parent, addEventListener(name, fn) { events.set(`window:${name}`, fn); } }, URLSearchParams,
    location: { search, origin: 'http://localhost:5180' }, matchMedia: () => preference,
    ResizeObserver: class { observe() {} },
    createScene: () => ({ markup: '', motions: [] }),
    attachKeplerEffects: () => time => effects.push(time),
    requestAnimationFrame(fn) { const id = ++frameId; frames.set(id, fn); return id; },
    cancelAnimationFrame(id) { frames.delete(id); },
  });
  await new vm.Script(`(async () => {${source}\n})()`).runInContext(context);
  return {
    player: context.window.digitxStory, effects, elements, frames,
    step(timestamp) { const queued = [...frames.values()]; frames.clear(); queued.forEach(fn => fn(timestamp)); },
    hide() { document.hidden = true; events.get('visibilitychange')(); },
    reduce() { preference.matches = true; reducedChange(); },
    replay() { events.get('#replay:click')(); },
    visible(visible, origin = 'http://localhost:5180', source = parent) { events.get('window:message')({ origin, source, data: { type: 'digitx-story-visibility', visible } }); },
  };
}

const h = await boot();
h.step(0); h.step(200);
assert.equal(h.player.state().time, 48, 'The story must stop on its final frame.');
assert.equal(h.player.state().playing, true, 'KEPLER effects must keep playing after the story ends.');
assert(h.effects.at(-1) > 48, 'The effects clock must continue beyond the story duration.');
const before = h.effects.at(-1);
h.step(1200);
assert(h.effects.at(-1) > before);
assert.equal(h.player.state().time, 48);
h.player.pause();
assert.equal(h.frames.size, 0, 'Pause must cancel the only animation loop.');
const frozen = h.effects.at(-1); h.step(2200); assert.equal(h.effects.at(-1), frozen);
h.player.play(); h.step(2300); h.step(2400);
assert.equal(h.player.state().time, 48, 'Resume at the ending must not restart the story.');
assert(h.effects.at(-1) > frozen);
h.hide(); assert.equal(h.frames.size, 0);
h.player.seek(20); assert.equal(h.effects.at(-1), 20); assert.equal(h.frames.size, 0);
h.replay(); assert.equal(h.player.state().time, 0); assert.equal(h.effects.at(-1), 0);
assert.equal(h.frames.size, 1);
h.reduce(); assert.equal(h.frames.size, 0);
const quiet = await boot({ reduced: true });
assert.equal(quiet.frames.size, 0, 'Reduced motion must prevent autoplay.');
quiet.player.play(); quiet.step(0); quiet.step(200);
assert.equal(quiet.player.state().time, 48); assert.equal(quiet.frames.size, 0, 'No ambient loop under reduced motion.');
console.log('PASS: final-frame effects continue; pause, resume, seek, replay, hidden tab and reduced motion behave correctly.');

const embed = await boot({ search: '?embed=1' });
assert.equal(embed.player.state().playing, false, 'An embedded story must wait until visible.');
embed.visible(true, 'https://unrelated.example');
assert.equal(embed.player.state().playing, false, 'Ignore messages from an unrelated origin.');
embed.visible(true, 'http://localhost:5180', {});
assert.equal(embed.player.state().playing, false, 'Ignore messages from another window.');
embed.visible(true);
assert.equal(embed.player.state().playing, true);
embed.visible(false);
assert.equal(embed.frames.size, 0, 'Scrolling away must stop the animation loop.');
embed.visible(true);
assert.equal(embed.player.state().playing, false, 'Returning must not override a pause or restart the film.');
const quietEmbed = await boot({ reduced: true, search: '?embed=1' });
quietEmbed.visible(true);
assert.equal(quietEmbed.frames.size, 0, 'Embedded autoplay must honour reduced motion.');
console.log('PASS: embedded visibility, one-shot autoplay, sender checks and reduced motion.');
