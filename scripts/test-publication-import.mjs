import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fetchRecords, mergePublications, toPublication } from './publications-import.mjs';

const researcher = {
  name: 'Verified Researcher', orcid: '0000-0000-0000-0001',
  names: ['Verified Researcher'], affiliations: ['Example University'],
};
const config = { minYear: 2025, researchers: [researcher] };
const record = {
  id: '123', source: 'MED', doi: '10.1234/PAPER', pubYear: '2026',
  title: 'A [&lt;sup&gt;18&lt;/sup&gt;F]PET dataset.',
  pubTypeList: { pubType: ['Journal Article', 'data-paper'] },
  journalInfo: { journal: { title: 'Scientific Data' } },
  authorList: { author: [{ firstName: 'Verified', lastName: 'Researcher',
    authorAffiliationDetailsList: { authorAffiliation: [{ affiliation: 'Example University' }] } }] },
  firstPublicationDate: '2026-09-01', citedByCount: 0,
};

test('requires a verified identity, not a matching surname or initials', () => {
  assert.deepEqual(toPublication(record, config)?.groupAuthors, ['Verified Researcher']);
  for (const author of [
    { firstName: 'V', lastName: 'Researcher' },
    { firstName: 'Someone Else', lastName: 'Researcher' },
    { firstName: 'Verified', lastName: 'Researcher' },
  ]) assert.equal(toPublication({ ...record, authorList: { author: [author] } }, config), null);
  const identified = { fullName: 'Researcher V', authorId: { type: 'ORCID', value: researcher.orcid } };
  assert(toPublication({ ...record, authorList: { author: [identified] } }, config));
});

test('excludes conference material and non-original publications', () => {
  for (const type of ['Conference Paper', 'Conference Abstract', 'Review', 'Letter', 'Editorial', 'Preprint', 'Published Erratum', 'Retracted Publication']) {
    assert.equal(toPublication({ ...record, pubTypeList: { pubType: ['Journal Article', type] } }, config), null, type);
  }
  assert.equal(toPublication({ ...record, pubTypeList: {} }, config), null);
  assert.equal(toPublication({ ...record, journalInfo: { issue: 'Suppl 1', journal: { title: 'Meeting Abstracts' } } }, config), null);
  assert(toPublication({ ...record, abstractText: 'This dataset was used in a MICCAI conference challenge.' }, config));
});

test('keeps verified zero citations distinct from missing counts and decodes titles', () => {
  const paper = toPublication(record, config);
  assert.equal(paper.citationCount, 0);
  assert.equal(paper.title, 'A [18F]PET dataset');
  assert.equal(toPublication({ ...record, citedByCount: undefined }, config).citationCount, null);
});

test('DOI matching preserves editorial IDs, updates counts, deduplicates and retains uncrawled papers', () => {
  const previous = [
    { paperId: 'legacy-id', doi: '10.1234/paper', title: 'Approved title', year: 2026 },
    { paperId: 'manual-id', doi: '10.1234/other', title: 'Not indexed', year: 2025 },
  ];
  const papers = mergePublications(previous, [record, record], config, {});
  assert.equal(papers.length, 2);
  assert.equal(papers[0].paperId, 'legacy-id');
  assert.equal(papers[0].title, 'Approved title');
  assert.equal(papers[0].citationCount, 0);
  assert.equal(papers[1].paperId, 'manual-id');
  const excluded = mergePublications(previous, [record], config, { excludeDois: { '10.1234/paper': 'Not original research' } });
  assert.deepEqual(excluded.map(p => p.paperId), ['manual-id']);
  assert.throws(() => mergePublications(previous, [], config, {}), /empty/i);
});

test('pagination collects every API page and refuses truncated responses', async () => {
  const requests = [];
  const fakeFetch = async url => {
    requests.push(url.searchParams.get('cursorMark'));
    return { ok: true, json: async () => ({ hitCount: 2, nextCursorMark: 'next', resultList: { result: [record] } }) };
  };
  assert.equal((await fetchRecords('query', fakeFetch)).length, 2);
  assert.deepEqual(requests, ['*', 'next']);
  await assert.rejects(fetchRecords('query', async () => ({ ok: true, json: async () => ({ hitCount: 2, resultList: { result: [] } }) })), /empty|incomplete/i);
  await assert.rejects(fetchRecords('query', async () => ({ ok: false, status: 403 })), /403/);
});
