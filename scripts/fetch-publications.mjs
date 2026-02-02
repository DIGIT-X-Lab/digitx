#!/usr/bin/env node

/**
 * Fetches publications for all lab members from Semantic Scholar API.
 * Deduplicates by paperId, filters to 2025+, and writes to src/data/publications.json.
 *
 * Usage: node scripts/fetch-publications.mjs
 */

const AUTHOR_IDS = [
  // Lalith Shiyam Sundar (4 name variants)
  '41126165',
  '41067995',
  '2002047424',
  '2189043918',
  // Sahib Julka
  '51259504',
];

const MIN_YEAR = 2025;
const OUTPUT_PATH = new URL('../src/data/publications.json', import.meta.url);
const API_BASE = 'https://api.semanticscholar.org/graph/v1';
const FIELDS = 'title,authors,year,venue,publicationDate,citationCount,externalIds,url,publicationTypes';

// Skip conference abstracts and other non-article types
const ALLOWED_TYPES = new Set(['JournalArticle', 'Review', 'CaseReport', 'Study', 'LettersAndComments', 'Editorial']);

// Venues that are conference abstract books (not peer-reviewed articles)
const BLOCKED_VENUES = new Set(['nuclearmedizin', 'nuclearmedicine']);


// Respect rate limits — wait between requests
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchAuthorPapers(authorId) {
  const papers = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const url = `${API_BASE}/author/${authorId}/papers?fields=${FIELDS}&offset=${offset}&limit=${limit}`;
    console.log(`  Fetching ${url}`);

    const res = await fetch(url);

    if (res.status === 429) {
      console.log('  Rate limited, waiting 30s...');
      await sleep(30_000);
      continue; // retry same offset
    }

    if (!res.ok) {
      console.error(`  Error ${res.status} for author ${authorId}: ${res.statusText}`);
      break;
    }

    const json = await res.json();
    const batch = json.data ?? [];
    papers.push(...batch);

    if (batch.length < limit || (json.next == null && batch.length === 0)) break;
    offset += limit;
    await sleep(1_500); // polite delay
  }

  return papers;
}

function normalisePaper(paper) {
  const externalIds = paper.externalIds ?? {};
  return {
    paperId: paper.paperId,
    title: paper.title ?? '',
    authors: (paper.authors ?? []).map((a) => a.name),
    year: paper.year ?? null,
    venue: paper.venue ?? '',
    publicationDate: paper.publicationDate ?? null,
    citationCount: paper.citationCount ?? 0,
    doi: externalIds.DOI ?? null,
    pubmedId: externalIds.PubMed ?? null,
    semanticScholarUrl: paper.url ?? `https://www.semanticscholar.org/paper/${paper.paperId}`,
  };
}

async function main() {
  const seen = new Set();
  const allPapers = [];

  for (const authorId of AUTHOR_IDS) {
    console.log(`Fetching papers for author ${authorId}...`);
    const raw = await fetchAuthorPapers(authorId);
    console.log(`  Found ${raw.length} papers`);

    for (const p of raw) {
      if (!p.paperId || seen.has(p.paperId)) continue;
      seen.add(p.paperId);

      // Filter by year
      if (p.year == null || p.year < MIN_YEAR) continue;

      // Filter by publication type — keep articles, skip conference abstracts
      const types = p.publicationTypes ?? [];
      if (types.length > 0 && !types.some((t) => ALLOWED_TYPES.has(t))) {
        console.log(`  Skipping (type: ${types.join(', ')}): ${p.title}`);
        continue;
      }

      // Filter by venue blocklist (catches abstracts Semantic Scholar didn't tag)
      const venueLower = (p.venue ?? '').toLowerCase().replace(/[\s-]/g, '');
      if (BLOCKED_VENUES.has(venueLower)) {
        console.log(`  Skipping (venue: ${p.venue}): ${p.title}`);
        continue;
      }

      allPapers.push(normalisePaper(p));
    }

    await sleep(1_500);
  }

  // Sort by publicationDate descending (newest first), fall back to year
  allPapers.sort((a, b) => {
    const da = a.publicationDate ?? `${a.year}-12-31`;
    const db = b.publicationDate ?? `${b.year}-12-31`;
    return db.localeCompare(da);
  });

  const { writeFileSync } = await import('node:fs');
  const { fileURLToPath } = await import('node:url');
  const outPath = fileURLToPath(OUTPUT_PATH);

  writeFileSync(outPath, JSON.stringify(allPapers, null, 2) + '\n');
  console.log(`\nWrote ${allPapers.length} papers (${MIN_YEAR}+) to ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
