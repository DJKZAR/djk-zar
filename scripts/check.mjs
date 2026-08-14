import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";

const dist = new URL("../dist/", import.meta.url);
const origin = "https://www.djk-zar.nl";
const read = (path) => readFile(new URL(path, dist), "utf8");
const count = (text, pattern) => text.match(pattern)?.length || 0;
const attr = (html, name) => [...html.matchAll(new RegExp(`\\b${name}=(?:"([^"]*)"|'([^']*)')`, "gi"))].map((match) => match[1] ?? match[2]);
const routeFromFile = (file) => file === "index.html" ? "/" : `/${file.replace(/index\.html$/, "")}`;
const matchValue = (html, pattern, message) => {
  const value = html.match(pattern)?.[1];
  assert.ok(value, message);
  return value;
};

const files = (await readdir(dist, { recursive: true })).filter((file) => file.endsWith(".html")).sort();
const pages = new Map(await Promise.all(files.map(async (file) => [routeFromFile(file), await read(file)])));
const canonicalPages = new Map();

// Every generated document keeps the shared structural and accessibility contract.
for (const [route, html] of pages) {
  assert.match(html, /^<!doctype html>/, `${route}: missing doctype`);
  assert.match(html, /<html lang="(?:nl-NL|en-GB)">/, `${route}: invalid language`);
  assert.match(html, /<main[^>]*id="main">/, `${route}: missing main landmark`);
  assert.equal(count(html, /<h1\b/g), 1, `${route}: expected one h1`);
  const ids = attr(html, "id");
  assert.equal(new Set(ids).size, ids.length, `${route}: duplicate IDs`);
  for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) assert.match(tag, /\salt="[^"]*"/, `${route}: image missing alt text`);
  for (const [tag] of html.matchAll(/<iframe\b[^>]*>/g)) assert.match(tag, /\stitle="[^"]+"/, `${route}: iframe missing title`);
  for (const source of attr(html, "data-tally-src")) assert.match(source, /^https:\/\/tally\.so\/embed\//, `${route}: invalid Tally form URL`);
  assert.doesNotMatch(html, /(?:src|style)=(?:"[^"]*|'[^']*')http:\/\//i, `${route}: mixed active content`);
  assert.equal(count(html, /googletagmanager\.com\/gtag\/js\?id=G-YNLVDLE9C0/g), 1, `${route}: invalid analytics script`);
  assert.equal(count(html, /gtag\('config', 'G-YNLVDLE9C0'\)/g), 1, `${route}: invalid analytics config`);
  assert.doesNotMatch(html, /(?:src|href)="https:\/\/www\.djk-zar\.nl\/wp-content\/|wordpress|elementor/i, `${route}: legacy WordPress reference`);

  const canonical = html.match(/<link rel="canonical" href="([^"]+)">/)?.[1];
  if (!canonical) {
    assert.match(html, /<meta name="robots" content="noindex, (?:follow|nofollow)">/, `${route}: non-indexable page must be noindex`);
    continue;
  }

  assert.equal(canonical, `${origin}${route}`, `${route}: canonical must match its public route`);
  assert.equal(count(html, /<meta name="robots"/g), 1, `${route}: expected one robots tag`);
  assert.equal(count(html, /<meta property="og:title"/g), 1, `${route}: expected one Open Graph title`);
  assert.equal(count(html, /<meta name="twitter:card"/g), 1, `${route}: expected one Twitter card`);
  assert.match(html, /<meta property="og:image" content="https:\/\/www\.djk-zar\.nl\/assets\/images\/djk-zar-social\.png">/, `${route}: invalid social image`);

  const title = matchValue(html, /<title>([^<]+)<\/title>/, `${route}: missing title`);
  const description = matchValue(html, /<meta name="description" content="([^"]+)">/, `${route}: missing description`);
  assert.deepEqual([
    matchValue(html, /<meta property="og:title" content="([^"]+)">/, `${route}: missing Open Graph title`),
    matchValue(html, /<meta name="twitter:title" content="([^"]+)">/, `${route}: missing Twitter title`)
  ], [title, title], `${route}: social titles differ from page title`);
  assert.deepEqual([
    matchValue(html, /<meta property="og:description" content="([^"]+)">/, `${route}: missing Open Graph description`),
    matchValue(html, /<meta name="twitter:description" content="([^"]+)">/, `${route}: missing Twitter description`)
  ], [description, description], `${route}: social descriptions differ from page description`);
  assert.match(html, new RegExp(`<meta property="og:url" content="${canonical.replaceAll("/", "\\/")}">`), `${route}: invalid Open Graph URL`);

  const jsonLd = matchValue(html, /<script type="application\/ld\+json">([^<]+)<\/script>/, `${route}: missing JSON-LD`);
  const graph = JSON.parse(jsonLd)["@graph"];
  const webPage = graph.find((item) => item["@type"] === "WebPage");
  assert.deepEqual([webPage?.url, webPage?.name, webPage?.description], [canonical, title, description], `${route}: JSON-LD metadata differs from page metadata`);
  assert.ok(graph.some((item) => Array.isArray(item["@type"]) && item["@type"].includes("SportsClub")), `${route}: missing SportsClub schema`);

  canonicalPages.set(canonical, { route, html, title, description });
}

// Indexable metadata must be unique, and language alternates must point back.
const titles = [...canonicalPages.values()].map(({ title }) => title);
const descriptions = [...canonicalPages.values()].map(({ description }) => description);
assert.equal(new Set(titles).size, titles.length, "canonical page titles must be unique");
assert.equal(new Set(descriptions).size, descriptions.length, "canonical page descriptions must be unique");

for (const [canonical, { html }] of canonicalPages) {
  const alternates = [...html.matchAll(/<link rel="alternate" hreflang="[^"]+" href="([^"]+)">/g)].map((match) => match[1]);
  assert.ok(alternates.length, `${canonical}: missing language alternate`);
  for (const alternate of alternates) {
    const target = canonicalPages.get(alternate);
    assert.ok(target, `${canonical}: missing alternate target ${alternate}`);
    assert.ok([...target.html.matchAll(/<link rel="alternate" hreflang="[^"]+" href="([^"]+)">/g)].some((match) => match[1] === canonical), `${alternate}: missing reciprocal alternate ${canonical}`);
  }
}

// Sitemap and robots output are derived contracts, not hardcoded page snapshots.
const [sitemap, robots, apache, home] = await Promise.all([read("sitemap.xml"), read("robots.txt"), read(".htaccess"), read("index.html")]);
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
assert.deepEqual([...sitemapUrls].sort(), [...canonicalPages.keys()].sort(), "sitemap must contain every canonical page exactly once");
assert.equal(new Set(sitemapUrls).size, sitemapUrls.length, "sitemap contains duplicate URLs");
assert.match(robots, /^User-agent: \*\nAllow: \/\n/m);
assert.match(robots, /Sitemap: https:\/\/www\.djk-zar\.nl\/sitemap\.xml/);

// Keep local preview and Apache behavior aligned with the public hosting contract.
for (const target of [
  `${origin}/en/water-polo-amsterdam/`,
  `${origin}/gedragsregels/`,
  `${origin}/en/sponsors/`,
  `${origin}/assets/documents/gedragsregels-en-vertrouwenspersoon.pdf`,
  `${origin}/assets/documents/machtiging-djk.pdf`
]) assert.ok(apache.includes(target), `.htaccess: missing redirect target ${target}`);
assert.match(apache, /ErrorDocument 404 \/404\.html/);
assert.match(apache, /RewriteRule \^\(\.\+\)\$ https:\/\/www\.djk-zar\.nl\/\$1\/ \[R=301,L,NE\]/);
assert.match(apache, /\(\?:www\|static\)\\\.djk-zar/);
assert.match(apache, /HTTP:X-Forwarded-Proto/);
assert.match(apache, /Content-Security-Policy "frame-src https:\/\/tally\.so https:\/\/www\.google\.com"/);
assert.match(home, /<link rel="stylesheet" href="\/styles\.css\?v=13">/);
assert.match(home, /<script src="\/navigation\.js\?v=9" defer><\/script>/);

console.log(`Static build checks passed (${canonicalPages.size} canonical pages, ${pages.size} generated documents)`);
