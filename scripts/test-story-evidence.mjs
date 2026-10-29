import assert from 'node:assert/strict';
import { keplerAnswers, motionAt } from '../public/previews/digitx-story-data.mjs';
import { createKnowledgeNetwork } from '../public/previews/digitx-story-network.mjs';
import { createScene } from '../public/previews/digitx-story-scene.mjs';

const network = createKnowledgeNetwork();
const { motions } = createScene();
const selectedValues = query => network.nodes.filter(node => node.kind === 'value' && query.nodes.includes(node.id));
assert.deepEqual(selectedValues(network.investigations[0]).map(node => node.label), ['40.8 mL', '32.4 mL']);
assert.deepEqual(selectedValues(network.investigations[1]).map(node => node.label), ['8 mg/L', 'Not started', '5 mg/L', 'Started']);
assert.equal(new Set(selectedValues(network.investigations[2]).map(node => node.owner)).size, 3);

network.investigations.forEach((query, i) => {
  assert.equal(query.start, keplerAnswers[i].at);
  const values = selectedValues(query);
  assert(values.every(node => query.fields.includes(node.field) && query.records.includes(node.record)));
  for (const value of values) {
    let node = value;
    while (node.parent) {
      assert(query.edges.includes(`${node.parent}--${node.id}`), `Missing source path for ${value.id}`);
      node = network.nodes.find(candidate => candidate.id === node.parent);
    }
  }
  const shown = motions.find(motion => motion.id === `answer-evidence-${i}`);
  assert.equal(motionAt(query.start + .8, shown).opacity, 1);
  for (let other = 0; other < keplerAnswers.length; other++) {
    if (other === i) continue;
    assert.equal(motionAt(query.start + .8, motions.find(motion => motion.id === `answer-evidence-${other}`)).opacity, 0);
  }
});
const human = motions.find(motion => motion.id === 'investigation-human-shift');
assert.equal(motionAt(37, human).opacity, 1);
assert.equal(motionAt(38.5, human).opacity, 0);
const graph = motions.find(motion => motion.id === 'knowledge-network');
assert(motionAt(37, graph).transform.includes('scale(1.0000)'));
assert(motionAt(39, graph).transform.includes('scale(1.0500)'));
assert.equal(new Set(motions.map(motion => motion.id)).size, motions.length);
console.log('PASS: each answer selects exactly its source observations and complete graph paths; timing, human exit and graph transition match.');
