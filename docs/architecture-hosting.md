# Architecture and hosting contract

## Decision

The production site is plain generated HTML, CSS, JavaScript, images, fonts, and documents. It has no WordPress, PHP, database, frontend framework, package dependency, analytics, tracking, consent banner, or live third-party integration.

A small Node.js build step avoids duplicating document structure and shared layout. Node is needed only while building or previewing. The hosting account serves the generated files directly.

## Repository contract

- `src/pages/*.mjs`: one owned content module per public page
- `src/layout.mjs`: shared document, header, navigation, main, and footer rendering
- `src/static/`: files copied unchanged to the output root
- `scripts/build.mjs`: discovers page modules and performs a clean build
- `scripts/serve.mjs`: local production-output preview with redirects and real 404 responses
- `scripts/check.mjs`: minimum structural build checks
- `dist/`: disposable generated output, never hand-edited or committed

Page agents add only a file in `src/pages/` unless their task explicitly owns a shared file. Discovery is automatic, so parallel page tasks do not edit a central registry.

Each page exports one object:

```js
export default {
  route: "/example/",
  lang: "nl-NL",
  title: "Required title",
  description: "Required description",
  canonical: "https://www.djk-zar.nl/example/",
  alternates: [{ lang: "en", href: "https://www.djk-zar.nl/en/example/" }],
  head: "optional trusted metadata HTML",
  main: "required semantic main-content HTML",
  script: "/optional-page-script.js"
};
```

`canonical: false` is reserved for non-indexable utility documents such as the 404 page. `head`, `alternates`, and `script` are optional. Values that enter attributes through the layout are escaped. `main` and `head` are trusted repository HTML, not visitor input. Primary content and navigation must remain usable without JavaScript.

## Canonical route policy

All canonical pages use HTTPS, `www.djk-zar.nl`, lowercase paths, and trailing slashes. Files keep their filename extension. These are the approved final page routes:

```text
/
/speel-met-ons-mee/
/waterpolo/
/extra-informatie/
/contributie/
/sponsors/
/bestuur/
/contact/
/gedragsregels/
/teams/
/en/water-polo-amsterdam/
/en/join-us/
/en/waterpolo-rules/
/en/extra-information/
/en/costs/
/en/sponsors/
/en/djk-zar/
/en/contact-us/
/en/code-of-conduct/
```

Renamed aliases redirect once to an absolute final canonical URL:

| Public alias | Final URL | Status |
| --- | --- | --- |
| `/en/` | `/en/water-polo-amsterdam/` | 301 |
| `/elementor-802/` | `/gedragsregels/` | 301 |
| `/en/sponsors-2/` | `/en/sponsors/` | 301 |

The Dutch and English homepages are translation equivalents. Every other language switch must point to the corresponding page rather than a language root.

The Apache rules normalize HTTP and non-`www` requests to `https://www.djk-zar.nl`, and add trailing slashes to extensionless paths. The three renamed aliases run first and therefore redirect directly to the final host and path. Query strings are preserved by redirects. On static resources they do not select alternate content, and canonical metadata omits them.

Unknown paths return 404 and are never redirected to the homepage. WordPress feeds, REST routes, admin paths, attachment pages, and other WordPress-only endpoints return 404 unless a plan task adds a specific evidence-based redirect. Existing download URLs must remain available or receive one direct redirect to their local replacement. Historical aliases may be added only from crawl evidence, server logs, analytics, or Search Console.

## Apache deployment contract

Build on a workstation or CI runner, then upload the contents of `dist/` to the hosting document root. The checked-in `src/static/.htaccess` provides:

- `DirectoryIndex index.html index.php` and disabled directory listings, allowing the archived WordPress site under `/old/` to use its PHP entry point
- `ErrorDocument 404 /404.html`
- direct permanent route redirects
- HTTPS, canonical-host, and trailing-slash normalization
- conservative cache headers
- `X-Content-Type-Options`, `Referrer-Policy`, and `X-Frame-Options`

The account must permit `.htaccess` overrides for `Options`, `DirectoryIndex`, `ErrorDocument`, `FileInfo`, and response headers. Apache-compatible `mod_rewrite` is required. `mod_headers` is optional in the file but required in production so all planned headers are present.

Before deploying, verify canonical pages, redirects, real 404 responses, cache policy, and security headers on staging. Forms use the approved localized Tally embeds, maps use Google Maps embeds, and any new third-party integration requires a dedicated plan task with privacy and performance review.
