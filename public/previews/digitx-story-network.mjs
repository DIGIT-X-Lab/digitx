import { records, keplerAnswers } from './digitx-story-data.mjs';

// Hierarchical view of the fictional cohort: person, visit, domain, field, value.
// Quantity values and units stay distinct in data and share one visual label.
export function createKnowledgeNetwork() {
  const nodes = [], edges = [];
  const centre = { x: 935, y: 425 };
  const stretch = 1;
  const radii = [0, 56, 103, 149, 190, 232];
  const root = { id: 'cohort', label: 'Connected records', kind: 'root', children: [] };
  const domains = [
    { key: 'imaging', label: 'Imaging', fields: [['tumour', 'Tumour volume']] },
    { key: 'composition', label: 'Body composition', fields: [['muscle', 'Muscle'], ['fat', 'Fat']] },
    { key: 'context', label: 'Clinical context', fields: [['histology', 'Pathology'], ['crp', 'CRP'], ['treatment', 'Treatment']] },
  ];
  for (const owner of [...new Set(records.map(record => record.id))]) {
    const person = { id: owner, label: owner, kind: 'person', owner, children: [] };
    records.forEach((record, index) => {
      if (record.id !== owner) return;
      const visit = { id: `visit-${index}`, label: record.visit, kind: 'visit', owner, record: index, children: [] };
      for (const domain of domains) {
        const group = { id: `${visit.id}-${domain.key}`, label: domain.label, kind: 'domain', domain: domain.key, owner, record: index, children: [] };
        for (const [key, label] of domain.fields) {
          const field = { id: `${visit.id}-${key}`, label, value: record[key], field: key, kind: 'field', domain: domain.key, owner, record: index, children: [] };
          const quantity = /^(\d+(?:\.\d+)?)\s+(.+)$/.exec(record[key]);
          field.children.push({ id: `${field.id}-value`, label: record[key], value: record[key], quantity: quantity ? Number(quantity[1]) : null, unit: quantity?.[2] ?? null, field: key, attribute: 'value', kind: 'value', domain: domain.key, owner, record: index, children: [] });
          group.children.push(field);
        }
        visit.children.push(group);
      }
      person.children.push(visit);
    });
    root.children.push(person);
  }
  const leaves = [];
  function flatten(node, parent = null, depth = 0) {
    node.parent = parent?.id; node.depth = depth; node.radius = radii[depth];
    nodes.push(node);
    if (!node.children.length) leaves.push(node);
    node.children.forEach(child => flatten(child, node, depth + 1));
  }
  flatten(root);
  // Put additional air between visits, and more again between people.
  let position = 0;
  leaves.forEach((leaf, i) => {
    if (i) position += leaf.owner !== leaves[i - 1].owner ? 2.5 : leaf.record !== leaves[i - 1].record ? 1.8 : 1;
    leaf.position = position;
  });
  const circumference = position + 2.5;
  leaves.forEach(leaf => { leaf.angle = -176 + leaf.position / circumference * 360; });
  function branchAngle(node) {
    if (node.children.length) {
      node.children.forEach(branchAngle);
      node.angle = (node.children[0].angle + node.children.at(-1).angle) / 2;
    }
  }
  branchAngle(root);
  const polar = (radius, angle) => {
    const radians = angle * Math.PI / 180;
    return { x: centre.x + Math.cos(radians) * radius * stretch, y: centre.y + Math.sin(radians) * radius };
  };
  const nodeIndex = new Map(nodes.map(node => [node.id, node]));
  for (const node of nodes) Object.assign(node, polar(node.radius, node.angle));
  for (const node of nodes.slice(1)) {
    const parent = nodeIndex.get(node.parent);
    const midpoint = (parent.radius + node.radius) / 2;
    const c1 = polar(midpoint, parent.depth === 0 ? node.angle : parent.angle);
    const c2 = polar(midpoint, node.angle);
    edges.push({ id: `${parent.id}--${node.id}`, a: parent.id, b: node.id, owner: node.owner, field: node.field, record: node.record, domain: node.domain, depth: node.depth,
      d: `M${parent.x} ${parent.y}C${c1.x} ${c1.y} ${c2.x} ${c2.y} ${node.x} ${node.y}` });
  }
  const investigations = keplerAnswers.map((query, i) => {
    const selected = nodes.filter(node => node.kind === 'value' && query.fields.includes(node.field) && query.records.includes(node.record));
    const selectedIds = new Set(), selectedNodes = new Set();
    for (const leaf of selected) {
      let node = leaf;
      while (node.parent) { selectedNodes.add(node.id); selectedIds.add(`${node.parent}--${node.id}`); node = nodeIndex.get(node.parent); }
    }
    return { ...query, start: query.at, end: keplerAnswers[i + 1]?.at, edges: [...selectedIds], nodes: [...selectedNodes] };
  });
  return { nodes, edges, investigations, centre, stretch };
}
