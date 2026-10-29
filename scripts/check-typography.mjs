import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import postcss from "postcss";

const root = fileURLToPath(new URL("../", import.meta.url));
const tokenFile = "src/site/typography.css";
const tokens = new Set();
postcss.parse(await readFile(join(root, tokenFile), "utf8")).walkDecls(decl => {
  if (decl.prop.startsWith("--type-")) tokens.add(decl.prop);
});

// These are lettering or proportional numbers within an illustration, not UI
// text. New exceptions require a named selector and a documented visual role.
const artwork = new Map([
  ["src/index.css", new Set([".site-brand, .footer-brand", ".site-brand", ".footer-brand"])],
  ["src/site/visuals/demonstrations.css", new Set([
    ".dx-demo-measure", ".dx-demo-measure small", ".dx-range-measure",
    ".dx-range-measure > span", ".dx-source-phrase sup",
  ])],
]);

async function cssFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(entry => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? cssFiles(path) : path.endsWith(".css") ? [path] : [];
  }));
  return files.flat();
}

const errors = [];
for (const path of await cssFiles(join(root, "src"))) {
  const file = relative(root, path);
  if (file === tokenFile) continue;
  postcss.parse(await readFile(path, "utf8"), { from: path }).walkDecls(decl => {
    const fail = message => errors.push(`${file}:${decl.source.start.line}: ${message}`);
    if (decl.prop.startsWith("--type-")) fail("Define type roles only in typography.css.");
    if (decl.prop === "font" && decl.value !== "inherit") fail("Use type roles instead of a font shorthand.");
    if (decl.prop !== "font-size" || artwork.get(file)?.has(decl.parent.selector)) return;
    const role = decl.value.match(/^var\((--type-[\w-]+)\)$/)?.[1];
    if (!role || !tokens.has(role)) fail(`${decl.parent.selector}: use a defined --type-* role, found ${decl.value}.`);
  });
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log("Typography contract passed: page and component sizes use shared roles.");
}
