#!/usr/bin/env node
/** Refresh verified original journal papers and citation counts, without Scholar scraping. */
import { readFileSync, writeFileSync, renameSync } from 'node:fs';
import { discoveryQuery, fetchRecords, mergePublications } from './publications-import.mjs';

const output = new URL('../src/data/publications.json', import.meta.url);
const read = path => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));

try {
  const config = read('../src/data/publication-researchers.json');
  const curation = read('../src/data/publications-curation.json');
  const previous = JSON.parse(readFileSync(output, 'utf8'));
  console.log(`Fetching verified researchers: ${config.researchers.map(person => person.name).join(', ')} (${config.minYear}+).`);
  const records = await fetchRecords(discoveryQuery(config));
  const papers = mergePublications(previous, records, config, curation);
  // Replace only a complete snapshot, after every API page and validation succeeds.
  const temporary = new URL(`${output.href}.tmp`);
  writeFileSync(temporary, `${JSON.stringify(papers, null, 2)}\n`);
  renameSync(temporary, output);
  console.log(`Wrote ${papers.length} verified journal papers.`);
} catch (error) {
  console.error(`Publication update failed; previous snapshot retained. ${error.message}`);
  process.exitCode = 1;
}
