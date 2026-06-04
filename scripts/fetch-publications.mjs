#!/usr/bin/env node

/**
 * Fetches recent publications from public Google Scholar profiles.
 *
 * Google Scholar does not provide an official JSON API. This scraper is best-effort:
 * it reads the public profile article tables, filters to 2025+, deduplicates by
 * normalized title, and writes src/data/publications.json.
 *
 * Usage: node scripts/fetch-publications.mjs
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const GOOGLE_SCHOLAR_PROFILES = [
  {
    name: 'Lalith Kumar Shiyam Sundar',
    profileId: 'L6iMPN4AAAAJ',
  },
];

const MIN_YEAR = 2025;
const PAGE_SIZE = 100;
const OUTPUT_PATH = new URL('../src/data/publications.json', import.meta.url);
const CURATION_PATH = new URL('../src/data/publications-curation.json', import.meta.url);
const SCHOLAR_BASE = 'https://scholar.google.com';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function loadCuration() {
  const path = fileURLToPath(CURATION_PATH);
  if (!existsSync(path)) {
    return { exclude: {}, overrides: {} };
  }

  return JSON.parse(readFileSync(path, 'utf8'));
}

function decodeEntities(value) {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&ndash;/g, '-')
    .replace(/&mdash;/g, '-')
    .replace(/&hellip;/g, '...');
}

function stripHtml(value) {
  return decodeEntities(
    value
      .replace(/<script[\s\S]*?<\/script>/g, '')
      .replace(/<style[\s\S]*?<\/style>/g, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  );
}

function normalizeTitle(title) {
  return title
    .toLowerCase()
    .replace(/[\u2010-\u2015]/g, '-')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function parseAuthors(value) {
  return value
    .split(',')
    .map((author) => author.trim())
    .filter(Boolean);
}

function applyCuration(publication, curation) {
  if (curation.exclude?.[publication.paperId]) {
    return null;
  }

  return {
    ...publication,
    ...(curation.overrides?.[publication.paperId] ?? {}),
  };
}

function makeScholarUrl(href) {
  return new URL(decodeEntities(href).replace(/&amp;/g, '&'), SCHOLAR_BASE).toString();
}

function makePaperId(profileId, href, title) {
  const citationId = new URL(decodeEntities(href).replace(/&amp;/g, '&'), SCHOLAR_BASE)
    .searchParams.get('citation_for_view');

  if (citationId) return `scholar:${citationId}`;
  return `scholar:${profileId}:${normalizeTitle(title)}`;
}

function parseRows(html, profile) {
  const rows = [...html.matchAll(/<tr class="gsc_a_tr">([\s\S]*?)<\/tr>/g)].map(
    (match) => match[1]
  );

  const publications = [];
  for (const row of rows) {
    const titleMatch = row.match(/<a href="([^"]+)" class="gsc_a_at">([\s\S]*?)<\/a>/);
    if (!titleMatch) continue;

    const title = stripHtml(titleMatch[2]);
    const yearMatch = row.match(/<span class="gsc_a_h[^"]*">([\s\S]*?)<\/span>/);
    const year = Number(stripHtml(yearMatch?.[1] ?? ''));
    if (!Number.isFinite(year)) continue;

    const grayMatches = [...row.matchAll(/<div class="gs_gray">([\s\S]*?)<\/div>/g)];
    const authors = stripHtml(grayMatches[0]?.[1] ?? '');
    const venue = stripHtml(
      (grayMatches[1]?.[1] ?? '').replace(/<span class="gs_oph">[\s\S]*?<\/span>/g, '')
    );
    const citationMatch = row.match(/class="gsc_a_ac[^"]*">([\s\S]*?)<\/a>/);
    const citationCount = Number(stripHtml(citationMatch?.[1] ?? '0')) || 0;

    publications.push({
      paperId: makePaperId(profile.profileId, titleMatch[1], title),
      title,
      authors: parseAuthors(authors),
      year,
      venue,
      publicationDate: null,
      citationCount,
      doi: null,
      pubmedId: null,
      source: 'google-scholar',
      sourceProfile: profile.name,
      sourceUrl: makeScholarUrl(titleMatch[1]),
    });
  }

  return publications;
}

async function fetchScholarPage(profileId, offset) {
  const url = new URL('/citations', SCHOLAR_BASE);
  url.searchParams.set('hl', 'en');
  url.searchParams.set('oe', 'ASCII');
  url.searchParams.set('user', profileId);
  url.searchParams.set('pagesize', String(PAGE_SIZE));
  url.searchParams.set('view_op', 'list_works');
  url.searchParams.set('sortby', 'pubdate');
  url.searchParams.set('cstart', String(offset));

  console.log(`  Fetching ${url}`);
  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (compatible; DIGITX-publications-fetcher/1.0; +https://digitx.de)',
    },
  });

  if (!res.ok) {
    throw new Error(`Google Scholar returned ${res.status} ${res.statusText}`);
  }

  const bytes = await res.arrayBuffer();
  const html = new TextDecoder('utf-8').decode(bytes);
  if (/unusual traffic|sorry\/index/i.test(html)) {
    throw new Error('Google Scholar returned an anti-automation block page');
  }

  return html;
}

async function fetchProfilePublications(profile) {
  const publications = [];

  for (let offset = 0; offset < 1000; offset += PAGE_SIZE) {
    const html = await fetchScholarPage(profile.profileId, offset);
    const pagePublications = parseRows(html, profile);
    if (pagePublications.length === 0) break;

    publications.push(...pagePublications.filter((pub) => pub.year >= MIN_YEAR));

    const years = pagePublications.map((pub) => pub.year).filter(Number.isFinite);
    const oldestYear = Math.min(...years);
    if (pagePublications.length < PAGE_SIZE || oldestYear < MIN_YEAR) break;

    await sleep(2_000);
  }

  return publications;
}

async function main() {
  const curation = loadCuration();
  const byTitle = new Map();
  let order = 0;

  for (const profile of GOOGLE_SCHOLAR_PROFILES) {
    console.log(`Fetching Google Scholar publications for ${profile.name}...`);
    const publications = await fetchProfilePublications(profile);
    console.log(`  Found ${publications.length} papers (${MIN_YEAR}+)`);

    for (const publication of publications) {
      const curatedPublication = applyCuration(publication, curation);
      if (!curatedPublication) {
        console.log(`  Curated out: ${publication.title}`);
        continue;
      }

      const key = normalizeTitle(curatedPublication.title);
      const existing = byTitle.get(key);
      if (!existing || curatedPublication.citationCount > existing.citationCount) {
        byTitle.set(key, { ...curatedPublication, order: existing?.order ?? order++ });
      }
    }

    await sleep(2_000);
  }

  const allPapers = [...byTitle.values()]
    .sort((a, b) => b.year - a.year || a.order - b.order)
    .map(({ order: _order, ...publication }) => publication);

  const outPath = fileURLToPath(OUTPUT_PATH);

  writeFileSync(outPath, JSON.stringify(allPapers, null, 2) + '\n');
  console.log(`\nWrote ${allPapers.length} papers (${MIN_YEAR}+) to ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
