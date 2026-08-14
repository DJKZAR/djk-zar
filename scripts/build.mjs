import { cp, mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { renderPage } from "../src/layout.mjs";

const root = new URL("../", import.meta.url);
const out = new URL("../dist/", import.meta.url);
const pagesDir = new URL("../src/pages/", import.meta.url);

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await cp(new URL("../src/static/", import.meta.url), out, { recursive: true });

const routes = new Set();
const canonicals = [];
for (const file of (await readdir(pagesDir)).filter((name) => name.endsWith(".mjs")).sort()) {
  const { default: page } = await import(new URL(file, pagesDir));
  if (routes.has(page.route)) throw new Error(`Duplicate route: ${page.route}`);
  if (!page.route.startsWith("/") || (!page.route.endsWith("/") && !page.route.endsWith(".html"))) {
    throw new Error(`${file}: route must start with / and end with / or .html`);
  }
  routes.add(page.route);
  if (page.canonical) canonicals.push(page.canonical);

  const relative = page.route === "/" ? "index.html" : page.route.endsWith("/")
    ? `${page.route.slice(1)}index.html`
    : page.route.slice(1);
  const destination = join(out.pathname, relative);
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, renderPage(page));
}

await writeFile(new URL("sitemap.xml", out), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${canonicals.map((url) => `  <url><loc>${url}</loc></url>`).join("\n")}\n</urlset>\n`);

console.log(`Built ${routes.size} pages in ${out.pathname.replace(root.pathname, "")}`);
