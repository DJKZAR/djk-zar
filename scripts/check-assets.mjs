import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import { createHash } from "node:crypto";

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
const imageFiles = new Map(manifest.assets.filter(asset => asset.kind === "image").flatMap(asset => asset.files.map(file => [file.path, file])));
const optimizedSources = new Set();
for (const asset of manifest.assets.filter(asset => asset.optimization)) {
  const source = imageFiles.get(asset.path);
  const bytes = await readFile(new URL(asset.path.replace("/assets/", ""), root));
  assert.equal(createHash("sha256").update(bytes).digest("hex"), asset.optimization.sourceSha256, `${asset.path}: stale derivatives; run the optimize-images skill`);
  optimizedSources.add(asset.path);
  assert.ok(asset.optimization.files.length, `${asset.path}: no optimized candidates`);
  let previousWidth = 0;
  for (const path of asset.optimization.files) {
    const file = imageFiles.get(path);
    assert.ok(file && asset.variants.includes(path), `${path}: missing optimized variant`);
    assert.ok(file.width > previousWidth && file.width <= source.width, `${path}: invalid candidate width or upscaling`);
    assert.ok(Math.abs(file.height - source.height * file.width / source.width) <= 1, `${path}: aspect ratio changed`);
    assert.ok(file.bytes < source.bytes && file.bytes <= 200_000, `${path}: optimized image exceeds byte budget`);
    assert.match(file.format, /^(?:webp|avif)$/);
    previousWidth = file.width;
  }
}

// Cover every generated document, srcset candidate and CSS/inline background, not just img.src.
const dist = new URL("../", root);
for (const path of (await readdir(dist, { recursive: true })).filter(path => /\.(?:html|css)$/.test(path))) {
  const text = await readFile(new URL(path, dist), "utf8");
  for (const [url] of text.matchAll(/\/assets\/images\/[a-zA-Z0-9_.-]+/g)) {
    const file = imageFiles.get(url);
    assert.ok(file, `${path}: undeclared image ${url}`);
    assert.ok(!optimizedSources.has(url), `${path}: original image used instead of optimized derivative: ${url}`);
    assert.ok(file.bytes <= 200_000, `${path}: image exceeds 200 KB budget: ${url}`);
    assert.doesNotMatch(url, /\.jpe?g$/i, `${path}: use a modern delivery format: ${url}`);
  }
}
console.log(`Asset checks passed (${manifest.assets.length} entries, ${declared.size} files, ${optimizedSources.size} optimized sources; all HTML/CSS images checked)`);
