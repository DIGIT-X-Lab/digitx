import { build } from "esbuild";
import { copyFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
await build({
  absWorkingDir: root,
  entryPoints: ["vendor/lumos-workflow/browser.tsx"],
  outfile: "public/previews/lumos/workflow.js",
  bundle: true, minify: true, format: "esm", target: "es2022",
  define: { "process.env.NODE_ENV": '"production"' },
  legalComments: "linked", logLevel: "info",
});
for (const [packageName, name] of [["remotion", "REMOTION-LICENSE.md"], ["@phosphor-icons/react", "PHOSPHOR-LICENSE.txt"], ["react", "REACT-LICENSE.txt"], ["react-dom", "REACT-DOM-LICENSE.txt"], ["thinking-orbs", "ORB-LICENSE.txt"]]) {
  await copyFile(resolve(root, `node_modules/${packageName}/LICENSE${packageName === "remotion" ? ".md" : ""}`), resolve(root, `public/previews/lumos/${name}`));
}
