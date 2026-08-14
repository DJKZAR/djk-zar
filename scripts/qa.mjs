import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";

const port = Number(process.env.QA_PORT || 4280);
const base = `http://127.0.0.1:${port}`;
const production = "https://www.djk-zar.nl";
const reportPath = process.env.QA_REPORT;
const dist = new URL("../dist/", import.meta.url);
const read = (path) => readFile(new URL(path, dist), "utf8");
const attr = (html, name) => [...html.matchAll(new RegExp(`\\b${name}=(?:"([^"]*)"|'([^']*)')`, "gi"))].map((match) => match[1] ?? match[2]);
const routeFromCanonical = (url) => new URL(url).pathname;

const sitemap = await read("sitemap.xml");
const routes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => routeFromCanonical(match[1]));
const generatedRoutes = [];
for (const file of (await readdir(dist, { recursive: true })).filter((file) => file.endsWith(".html"))) {
  const canonical = (await read(file)).match(/<link rel="canonical" href="([^"]+)">/i)?.[1];
  if (canonical) generatedRoutes.push(routeFromCanonical(canonical));
}
assert.deepEqual([...routes].sort(), generatedRoutes.sort(), "sitemap must contain every generated canonical page exactly once");

const server = spawn(process.execPath, [new URL("serve.mjs", import.meta.url).pathname], {
  env: { ...process.env, PORT: String(port) }, stdio: ["ignore", "pipe", "pipe"]
});
let serverError = "";
server.stderr.on("data", (chunk) => { serverError += chunk; });

try {
  for (let attempt = 0; attempt < 50; attempt++) {
    try { if ((await fetch(base)).ok) break; } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
    if (attempt === 49) throw new Error(`Preview did not start: ${serverError}`);
  }

  const report = { routes: [], resources: [], redirects: [], errors: [] };
  const pages = new Map();
  for (const route of routes) {
    const response = await fetch(`${base}${route}`);
    assert.equal(response.status, 200, `${route} returned ${response.status}`);
    const html = await response.text();
    pages.set(route, html);

    const ids = attr(html, "id");
    assert.equal(ids.length, new Set(ids).size, `${route} has duplicate IDs`);
    assert.equal((html.match(/<h1\b/gi) || []).length, 1, `${route} must have one h1`);
    assert.doesNotMatch(html, /(?:src|style)=(?:"[^"]*|'[^']*)http:\/\//i, `${route} has mixed active content`);
    assert.doesNotMatch(html, /(?:wp-content|wordpress|elementor|localhost)/i, `${route} contains a forbidden production reference`);

    const canonical = html.match(/<link rel="canonical" href="([^"]+)">/i)?.[1];
    assert.equal(canonical, `${production}${route}`, `${route} has an invalid canonical`);
    const schemas = [...html.matchAll(/<script type="application\/ld\+json">([^<]+)<\/script>/gi)].map((match) => JSON.parse(match[1]));
    assert.equal(schemas.length, 1, `${route} must have one valid JSON-LD block`);

    report.routes.push({ route, status: response.status, canonical, ids: ids.length, schemas: schemas.length });
  }

  const targets = new Map();
  for (const [route, html] of pages) {
    for (const value of [...attr(html, "href"), ...attr(html, "src")]) {
      if (!value || /^(?:mailto:|tel:|data:|javascript:)/i.test(value)) continue;
      const url = new URL(value, `${base}${route}`);
      if (url.origin !== base) continue;
      const key = `${url.pathname}${url.search}`;
      if (!targets.has(key)) targets.set(key, new Set());
      targets.get(key).add(route);

      if (url.hash) {
        const targetRoute = url.pathname.endsWith("/") ? url.pathname : route;
        const targetHtml = pages.get(targetRoute) || (await (await fetch(`${base}${targetRoute}`)).text());
        const id = decodeURIComponent(url.hash.slice(1));
        assert.ok(attr(targetHtml, "id").includes(id), `${route} links to missing fragment ${url.pathname}${url.hash}`);
      }
    }
  }
  for (const [target, sources] of targets) {
    const response = await fetch(`${base}${target}`, { redirect: "manual" });
    assert.ok(response.status >= 200 && response.status < 400, `${target} returned ${response.status}`);
    report.resources.push({ target, status: response.status, sources: [...sources] });
  }

  const aliases = [
    ["/en/", "/en/water-polo-amsterdam/"],
    ["/elementor-802/", "/gedragsregels/"],
    ["/en/sponsors-2/", "/en/sponsors/"],
    ["/wp-content/uploads/2021/06/Gedragsregels-en-vertrouwenspersoon-DJK-ZAR-20210620.pdf", "/assets/documents/gedragsregels-en-vertrouwenspersoon.pdf"],
    ["/wp-content/uploads/2023/05/Machtiging-D.J.K.pdf", "/assets/documents/machtiging-djk.pdf"]
  ];
  for (const [from, to] of aliases) {
    const first = await fetch(`${base}${from}`, { redirect: "manual" });
    assert.equal(first.status, 301, `${from} must return 301`);
    assert.equal(new URL(first.headers.get("location"), base).pathname, to, `${from} has the wrong destination`);
    const final = await fetch(`${base}${from}`);
    assert.equal(final.status, 200, `${from} does not end at 200`);
    assert.equal(final.url, `${base}${to}`, `${from} has a redirect chain or wrong final URL`);
    report.redirects.push({ from, status: first.status, to, hops: 1, finalStatus: final.status });
  }

  const missing = await fetch(`${base}/definitely-not-a-page/`);
  const missingHtml = await missing.text();
  assert.equal(missing.status, 404, "unknown URL must return 404");
  assert.match(missingHtml, /name="robots" content="noindex, follow"/, "404 must be noindex");
  assert.match(missingHtml, /<nav\b|class="desktop-menu"/, "404 must contain useful navigation");

  report.summary = { canonicalPages: routes.length, internalTargets: targets.size, redirects: aliases.length, errors: 0 };
  if (reportPath) {
    await mkdir(new URL(".", new URL(reportPath, `file://${process.cwd()}/`)), { recursive: true });
    await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  }
  console.log(`QA crawl passed (${routes.length} pages, ${targets.size} internal targets, ${aliases.length} redirects)`);
} finally {
  server.kill("SIGTERM");
}
