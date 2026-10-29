import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const source = readFileSync(new URL('../src/site/pages/publication-archive.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
const { selectPublications, publicationPages } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);

assert.deepEqual(publicationPages(1, 2), [1, 2]);
assert.deepEqual(publicationPages(1, 15), [1, 2, 'gap', 15]);
assert.deepEqual(publicationPages(8, 15), [1, 'gap', 8, 'gap', 15]);
assert.deepEqual(publicationPages(15, 15), [1, 'gap', 14, 15]);

const records = Array.from({ length: 23 }, (_, i) => ({
  paperId: `test-${i}`, title: `Paper ${i}`, authors: ['Öykü Özer'],
  year: i < 12 ? 2026 : 2025, venue: 'Test Journal', publicationDate: null,
  citationCount: 0, doi: null, pubmedId: null,
  note: { summary: i === 16 ? 'Measuring repeatability' : 'Comparing methods', groupAuthors: ['Group Author'] },
}));
const first = selectPublications(records, { query: '', year: 'all', page: 1 });
assert.equal(first.items.length, 10);
assert.deepEqual([first.from, first.to, first.pageCount], [1, 10, 3]);
const second = selectPublications(records, { query: '', year: 'all', page: 2 });
assert.deepEqual(second.groups.map(g => [g.year, g.items.length]), [[2026, 2], [2025, 8]]);
assert.equal(second.items[0].paperId, 'test-10');
const last = selectPublications(records, { query: '', year: 'all', page: 99 });
assert.deepEqual([last.page, last.items.length, last.to], [3, 3, 23]);
const filtered = selectPublications(records, { query: ' ozer repeatability ', year: '2025', page: 3 });
assert.deepEqual(filtered.items.map(p => p.paperId), ['test-16']);
assert.equal(filtered.page, 1);
const empty = selectPublications(records, { query: 'not found', year: 'all', page: 2 });
assert.deepEqual([empty.total, empty.from, empty.to, empty.page], [0, 0, 0, 1]);
assert.equal(selectPublications(records, { query: 'Group Author', year: '2026', page: 1 }).total, 12);
assert.equal(selectPublications([...records].reverse(), { query: '', year: 'all', page: 1 }).groups[0].year, 2026);
// Real curated metadata must support full-name searches despite truncated imports.
const noteSource = readFileSync(new URL('../src/data/publication-notes.ts', import.meta.url), 'utf8');
const noteModule = ts.transpileModule(noteSource, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
const { publicationNotes } = await import(`data:text/javascript;base64,${Buffer.from(noteModule.outputText).toString('base64')}`);
const imported = JSON.parse(readFileSync(new URL('../src/data/publications.json', import.meta.url), 'utf8'));
const { exclude } = JSON.parse(readFileSync(new URL('../src/data/publications-curation.json', import.meta.url), 'utf8'));
const real = imported.filter(p => !Object.hasOwn(exclude, p.paperId)).map(p => ({ ...p, note: publicationNotes[p.paperId] }));
assert(selectPublications(real, { query: 'Thomas Beyer', year: 'all', page: 1 }).items.some(p => p.paperId === 'scholar:L6iMPN4AAAAJ:u_35RYKgDlwC'));
assert(selectPublications(real, { query: 'Sebastian Gutschmayer', year: 'all', page: 1 }).items.some(p => p.paperId === 'scholar:L6iMPN4AAAAJ:cFHS6HbyZ2cC'));
assert(real.every(p => p.note?.summary && p.note?.groupAuthors.length && p.note?.evidenceUrl.startsWith('https://')));
console.log('Publication archive: pagination, year groups, search, filters, clamping and empty state passed.');

// Real rows can wrap differently: pages must respect their measured height,
// including repeated year headings, without dropping or splitting a paper.
const measured = records.slice(0, 5).map((p, i) => ({ ...p, year: i < 3 ? 2026 : 2025 }));
const layout = { availableHeight: 400, yearHeadingHeight: 70, yearGap: 28,
  rowHeights: Object.fromEntries(measured.map((p, i) => [p.paperId, [120, 200, 150, 180, 90][i]])) };
const pageOptions = { query: '', year: 'all', page: 1 };
const fitted = selectPublications(measured, pageOptions, layout);
assert.deepEqual(fitted.items.map(p => p.paperId), ['test-0', 'test-1']);
assert.equal(fitted.pageCount, 3);
const fittedPages = [1, 2, 3].map(page => selectPublications(measured, { ...pageOptions, page }, layout));
assert.deepEqual(fittedPages.map(p => p.items.length), [2, 1, 2]);
assert.deepEqual(fittedPages.flatMap(p => p.items.map(r => r.paperId)), measured.map(p => p.paperId));
assert.deepEqual(fitted.pageAnchors, ['test-0', 'test-2', 'test-3']);
const resized = selectPublications(measured, { ...pageOptions, anchor: 'test-2' }, { ...layout, availableHeight: 600 });
assert.equal(resized.page, 1);
assert.equal(resized.pageCount, 2);
assert(resized.items.some(p => p.paperId === 'test-2'));
const short = selectPublications(measured, pageOptions, { ...layout, availableHeight: 20 });
assert.equal(short.items.length, 1);
assert.equal(short.pageCount, 5);
const yearFiltered = selectPublications(measured, { ...pageOptions, year: '2025', anchor: 'test-0' }, layout);
assert.deepEqual(yearFiltered.items.map(p => p.paperId), ['test-3', 'test-4']);
assert.equal(yearFiltered.pageCount, 1);
const exactFit = selectPublications(measured, pageOptions, { ...layout, availableHeight: 390 });
assert.equal(exactFit.items.length, 2);
// The second year needs its own heading AND the inter-group gap.
const yearBoundary = selectPublications(measured, pageOptions, { ...layout, availableHeight: 800 });
assert.equal(yearBoundary.items.length, 3);
console.log('Viewport pagination: measured rows, year boundaries, resize anchor, exact fit and oversized rows passed.');
