// Refresh the catalogue's public GitHub snapshot. Run before publishing when
// current counts are wanted; visitors never depend on a third-party API call.
import { readFile, writeFile } from 'node:fs/promises';
const path = new URL('../src/content/tool-stars.json', import.meta.url);
const snapshot = JSON.parse(await readFile(path, 'utf8'));
const repositories = await Promise.all(Object.entries(snapshot.repositories).map(async ([slug, entry]) => {
  const repo = new URL(entry.repository);
  if (repo.hostname !== 'github.com') throw new Error(`Invalid repository for ${slug}`);
  const response = await fetch(`https://api.github.com/repos${repo.pathname}`, {
    headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'DIGITX-site' },
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`${slug}: GitHub returned ${response.status}. Existing snapshot retained.`);
  const data = await response.json();
  if (!Number.isInteger(data.stargazers_count) || data.stargazers_count < 0) throw new Error(`Invalid star count for ${slug}`);
  return [slug, { repository: entry.repository, stars: data.stargazers_count }];
}));
await writeFile(path, JSON.stringify({ checkedAt: new Date().toISOString().slice(0, 10), repositories: Object.fromEntries(repositories) }, null, 2) + '\n');
console.log(`Updated ${repositories.length} repository star counts.`);
