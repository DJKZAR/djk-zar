import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";

const root = new URL("../dist/assets/", import.meta.url);
const manifest = JSON.parse(await readFile(new URL("asset-manifest.json", root), "utf8"));
const declared = new Set(["/assets/asset-manifest.json"]);

for (const asset of manifest.assets) {
  assert.match(asset.path, /^\/assets\//);
  for (const file of asset.files) {
    assert(!declared.has(file.path), `duplicate asset path: ${file.path}`);
    declared.add(file.path);
    const local = new URL(file.path.replace("/assets/", ""), root);
    assert.equal((await stat(local)).size, file.bytes, `${file.path}: unexpected size`);
    if (file.format === "svg") {
      const svg = await readFile(local, "utf8");
      assert.doesNotMatch(svg, /<script|<foreignObject|<metadata|\son[a-z]+\s*=|(?:href|src)=["'](?:https?:|\/\/|data:|javascript:)/i, `${file.path}: unsafe or unsanitized SVG`);
    }
  }
}

const walk = async (directory, prefix = "/assets/") => {
  const paths = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = `${prefix}${entry.name}`;
    if (entry.isDirectory()) paths.push(...await walk(new URL(`${entry.name}/`, directory), `${path}/`));
    else paths.push(path);
  }
  return paths;
};

assert.deepEqual((await walk(root)).sort(), [...declared].sort(), "manifest must account for every deployed asset");
console.log(`Asset checks passed (${manifest.assets.length} entries, ${declared.size} files)`);
