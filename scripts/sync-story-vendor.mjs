import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const source = resolve(root, 'node_modules/thinking-orbs/dist');
const target = resolve(root, 'public/previews/vendor/thinking-orbs');
const packageInfo = JSON.parse(await readFile(resolve(source, '../package.json'), 'utf8'));
await mkdir(target, { recursive: true });
const copied = new Set();
async function copyModule(file) {
  if (copied.has(file)) return;
  copied.add(file);
  const code = await readFile(file, 'utf8');
  await copyFile(file, resolve(target, basename(file)));
  for (const match of code.matchAll(/from\s+["'](\.\/[^"']+)["']/g)) {
    await copyModule(resolve(dirname(file), match[1]));
  }
}
await copyModule(resolve(source, 'engine.es.js'));
await copyFile(resolve(source, '../LICENSE'), resolve(target, 'LICENSE'));
await writeFile(resolve(target, 'NOTICE.txt'), `Thinking Orbs ${packageInfo.version}\nCopyright (c) 2026 Jakub Antalik\nMIT licence, see LICENSE. Unmodified geometry engine vendored from the npm package.\nhttps://libraries.dev/orbs\nhttps://github.com/Jakubantalik/Libraries.dev/tree/main/packages/thinking-orbs\n\nRegenerate with: npm run sync:story-vendor\n`);
console.log(`Synced Thinking Orbs ${packageInfo.version}: ${copied.size} engine modules and licence.`);
