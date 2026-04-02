#!/usr/bin/env node

/**
 * Generates news feed by merging:
 *   1. Manual news entries from src/data/news-manual.json
 *   2. Major GitHub releases (first release or major semver bump) from lab orgs
 *   3. New publications detected since last run
 *
 * Usage: node scripts/fetch-news.mjs
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const OUTPUT_PATH = join(ROOT, 'src/data/news.json');
const MANUAL_PATH = join(ROOT, 'src/data/news-manual.json');
const PUBS_PATH = join(ROOT, 'src/data/publications.json');
const PREV_PUBS_PATH = join(ROOT, 'src/data/.publications-prev.json');

const GITHUB_ORGS = ['ENHANCE-PET', 'DIGIT-X-Lab'];
const MAX_NEWS_ITEMS = 12;

// Repos to skip
const SKIP_REPOS = new Set(['FERRET', '.github', 'digitx']);

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Parse semver string like "v2.0.0" or "1.0.0" into { major, minor, patch }
 * Returns null if not valid semver.
 */
function parseSemver(tag) {
  const m = tag.match(/^v?(\d+)\.(\d+)\.(\d+)/);
  if (!m) return null;
  return { major: +m[1], minor: +m[2], patch: +m[3] };
}

/**
 * Determine if a release qualifies as "newsworthy":
 *   - It's the first release of a repo (any version)
 *   - It's a major version bump (X.0.0 where X >= 2)
 */
function isNewsworthyRelease(release, allReleases) {
  const ver = parseSemver(release.tag_name);
  if (!ver) return false;

  // First release of the repo
  if (allReleases.length === 1) return true;

  // Sort by published date ascending
  const sorted = [...allReleases]
    .filter((r) => parseSemver(r.tag_name))
    .sort((a, b) => new Date(a.published_at) - new Date(b.published_at));

  // If this is the earliest release, it's the first appearance
  if (sorted[0]?.id === release.id) return true;

  // Major version bump (X.0.0 where X >= 2)
  if (ver.major >= 2 && ver.minor === 0 && ver.patch === 0) return true;

  return false;
}

/**
 * Fetch all releases for repos in a GitHub org.
 * Returns newsworthy releases as news items.
 */
async function fetchGitHubNews() {
  const items = [];

  for (const org of GITHUB_ORGS) {
    console.log(`Fetching repos for ${org}...`);
    let repos;
    try {
      const res = await fetch(`https://api.github.com/orgs/${org}/repos?per_page=100`);
      if (!res.ok) {
        console.warn(`  Failed to fetch repos for ${org}: ${res.status}`);
        continue;
      }
      repos = await res.json();
    } catch (e) {
      console.warn(`  Error fetching ${org}: ${e.message}`);
      continue;
    }

    for (const repo of repos) {
      if (SKIP_REPOS.has(repo.name)) continue;
      if (repo.fork) continue;

      await sleep(500); // rate limiting

      try {
        const res = await fetch(
          `https://api.github.com/repos/${org}/${repo.name}/releases?per_page=50`
        );
        if (!res.ok) continue;
        const releases = await res.json();
        if (!releases.length) continue;

        for (const release of releases) {
          if (release.draft || release.prerelease) continue;
          if (!isNewsworthyRelease(release, releases)) continue;

          const ver = parseSemver(release.tag_name);
          const isFirst =
            releases.filter((r) => !r.draft && !r.prerelease).length === 1 ||
            releases
              .filter((r) => !r.draft && !r.prerelease && parseSemver(r.tag_name))
              .sort((a, b) => new Date(a.published_at) - new Date(b.published_at))[0]?.id ===
              release.id;

          const title = isFirst
            ? `${repo.name} open-sourced`
            : `${repo.name} ${release.tag_name} released`;

          const description = isFirst
            ? repo.description || `${repo.name} is now available on GitHub.`
            : release.name || `Major release ${release.tag_name} of ${repo.name}.`;

          items.push({
            date: release.published_at.split('T')[0],
            title,
            description: description.slice(0, 200),
            type: 'release',
            link: release.html_url,
          });
        }
      } catch {
        /* ignore individual repo errors */
      }
    }
  }

  return items;
}

/**
 * Detect new publications by comparing current publications.json
 * with the previous snapshot.
 */
function detectNewPublications() {
  if (!existsSync(PUBS_PATH)) return [];
  const current = JSON.parse(readFileSync(PUBS_PATH, 'utf-8'));

  let prevIds = new Set();
  if (existsSync(PREV_PUBS_PATH)) {
    const prev = JSON.parse(readFileSync(PREV_PUBS_PATH, 'utf-8'));
    prevIds = new Set(prev.map((p) => p.paperId));
  }

  // Save current as prev for next run
  writeFileSync(PREV_PUBS_PATH, JSON.stringify(current.map((p) => ({ paperId: p.paperId }))));

  const newPubs = current.filter((p) => !prevIds.has(p.paperId));
  return newPubs.map((pub) => ({
    date: pub.publicationDate || `${pub.year}-01-01`,
    title: `New paper: ${pub.title}`,
    description: pub.venue ? `Published in ${pub.venue}.` : 'New publication from the lab.',
    type: 'publication',
    link: pub.doi ? `https://doi.org/${pub.doi}` : pub.semanticScholarUrl,
  }));
}

/**
 * Load manual news entries.
 */
function loadManualNews() {
  if (!existsSync(MANUAL_PATH)) return [];
  return JSON.parse(readFileSync(MANUAL_PATH, 'utf-8'));
}

async function main() {
  console.log('Fetching GitHub releases...');
  const githubNews = await fetchGitHubNews();
  console.log(`  Found ${githubNews.length} newsworthy releases`);

  console.log('Detecting new publications...');
  const pubNews = detectNewPublications();
  console.log(`  Found ${pubNews.length} new publications`);

  console.log('Loading manual news...');
  const manualNews = loadManualNews();
  console.log(`  Found ${manualNews.length} manual entries`);

  // Merge, deduplicate by title, sort by date descending, cap at MAX
  const seen = new Set();
  const all = [...manualNews, ...githubNews, ...pubNews]
    .filter((item) => {
      if (seen.has(item.title)) return false;
      seen.add(item.title);
      return true;
    })
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, MAX_NEWS_ITEMS);

  writeFileSync(OUTPUT_PATH, JSON.stringify(all, null, 2) + '\n');
  console.log(`\nWrote ${all.length} news items to ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
