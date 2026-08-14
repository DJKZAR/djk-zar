import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { renderPage } from "../src/layout.mjs";

const read = (path) => readFile(new URL(`../dist/${path}`, import.meta.url), "utf8");
const [home, englishHome, notFound, reference, apache, navigation, sharedStyles, dutchHistory, englishHistory, ...pages] = await Promise.all([
  read("index.html"),
  read("en/water-polo-amsterdam/index.html"),
  read("404.html"),
  read("reference.html"),
  read(".htaccess"),
  read("navigation.js"),
  read("styles.css"),
  read("geschiedenis/index.html"),
  read("en/history/index.html"),
  ...["waterpolo", "en/waterpolo-rules", "extra-informatie", "en/extra-information", "contributie", "en/costs", "bestuur", "en/djk-zar", "sponsors", "en/sponsors"].map((path) => read(`${path}/index.html`))
]);
const informationPages = pages.slice(0, 6);
const clubPages = pages.slice(6);
const historyPages = [dutchHistory, englishHistory];
const entryPages = await Promise.all(["speel-met-ons-mee", "en/join-us", "contact", "en/contact-us", "gedragsregels", "en/code-of-conduct"].map((path) => read(`${path}/index.html`)));

for (const page of [home, englishHome, notFound, reference, ...historyPages, ...pages, ...entryPages]) {
  assert.equal(page.match(/googletagmanager\.com\/gtag\/js\?id=G-YNLVDLE9C0/g)?.length, 1);
  assert.equal(page.match(/gtag\('config', 'G-YNLVDLE9C0'\)/g)?.length, 1);
}
const priorityMetadata = [
  [informationPages[0], "Waterpoloregels en beginnen met waterpolo | DJK-ZAR", "Beginnen met waterpolo? Lees hoe zwaar waterpolo is, hoe lang een wedstrijd duurt, waarom spelers een cap dragen en welke spieren je traint."],
  [informationPages[1], "Water polo rules for beginners | DJK-ZAR", "New to water polo? Learn how demanding it is, how long a match lasts, why players wear caps and which muscles you train."],
  [informationPages[2], "Parkeren en informatie voor bezoekende teams | DJK-ZAR", "Praktische informatie voor bezoekende teams van DJK-ZAR over parkeren bij het Mercatorbad en een drankje bij PONG."],
  [informationPages[3], "Parking and visitor information | DJK-ZAR", "Practical information for visiting teams, including parking near Mercatorbad and where to have a drink after the match."],
  [clubPages[1], "DJK-ZAR board members | Water polo Amsterdam", "Meet the DJK-ZAR board members and find contact details for the Amsterdam water polo club’s leadership team."],
  [englishHome, "Water polo club in Amsterdam West | DJK-ZAR", "Play water polo in Amsterdam West with DJK-ZAR. We have five men’s teams, one women’s team and training sessions for beginners."]
];
for (const [page, title, description] of priorityMetadata) {
  for (const tag of [`<title>${title}</title>`, `<meta name="description" content="${description}">`, `<meta property="og:title" content="${title}">`, `<meta property="og:description" content="${description}">`, `<meta name="twitter:title" content="${title}">`, `<meta name="twitter:description" content="${description}">`]) assert.ok(page.includes(tag));
  const webPage = JSON.parse(page.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)[1])["@graph"].find((item) => item["@type"] === "WebPage");
  assert.deepEqual([webPage.name, webPage.description], [title, description]);
}
assert.equal(new Set(priorityMetadata.map(([, title]) => title)).size, priorityMetadata.length);
assert.equal(new Set(priorityMetadata.map(([, , description]) => description)).size, priorityMetadata.length);
assert.equal(entryPages[0].match(/<strong>Donderdag<\/strong><br>20:30 – 22:00 – Heren 1, 2, 3/g)?.length, 2);
assert.equal(entryPages[1].match(/<strong>Thursday<\/strong><br>20:30 – 22:00 – Men 1, 2, 3/g)?.length, 2);
for (const page of [home, englishHome, entryPages[0], entryPages[1]]) assert.doesNotMatch(page, /(?:Donderdag|Thursday)<\/strong><br>21:00 – 22:00/);

assert.match(home, /^<!doctype html>/);
assert.match(home, /<html lang="nl-NL">/);
assert.match(home, /<main[^>]*id="main">/);
assert.match(home, /<h1[^>]*>Waterpolo Amsterdam<\/h1>/);
assert.equal(home.match(/<h1\b/g)?.length, 1);
assert.match(home, /rel="canonical" href="https:\/\/www\.djk-zar\.nl\/"/);
assert.match(englishHome, /<html lang="en-GB">/);
assert.match(englishHome, /<h1[^>]*>Water Polo Amsterdam<\/h1>/);
assert.equal(englishHome.match(/<h1\b/g)?.length, 1);
assert.match(englishHome, /rel="canonical" href="https:\/\/www\.djk-zar\.nl\/en\/water-polo-amsterdam\/"/);
assert.match(englishHome, /href="\/"[^>]*>🇳🇱 Nederlands<\/a>/);
for (const page of [home, englishHome]) {
  assert.match(page, /class="footer-location"/);
  assert.match(page, /href="\/assets\/documents\/privacy-verklaring-djkzar\.pdf"/);
  assert.match(page, /<iframe src="https:\/\/www\.google\.com\/maps\?q=[^"]+&amp;output=embed"/);
  assert.doesNotMatch(page, /Open in Google Maps|google\.com\/maps\/search/);
  assert.doesNotMatch(page, /assets\/images\/instagram-(?:game|results|schedule|comeback)\./);
  assert.match(page, /class="instagram-logo"/);
  assert.match(page, /instagram-water-polo\.avif/);
  assert.match(page, /instagram-water-polo\.png/);
  assert.match(page, /DJK-ZAR[\s\S]*Trainings? ?[Tt]eam[\s\S]*assets\/images\/water-polo-tournament\.jpg|assets\/images\/water-polo-tournament\.jpg[\s\S]*DJK-ZAR[\s\S]*Trainings? ?[Tt]eam/);
  assert.doesNotMatch(page, /class="(?:home-review|review-link)"|Laat een review achter|Beatriz|Steve Jonk|Robert Mulder|jaar geleden|year ago/);
}
assert.doesNotMatch(home, /wordpress|wp-content|elementor/i);
assert.match(home, /href=["']\/geschiedenis\/["']/);
assert.match(englishHome, /href=["']\/en\/history\/["']/);
for (const page of historyPages) assert.match(page, /href="https:\/\/nl\.wikipedia\.org\/wiki\/Nederlands_kampioenschap_waterpolo_heren"/);
for (const page of informationPages) {
  assert.equal(page.match(/<h1\b/g)?.length, 1);
  assert.doesNotMatch(page, /(?:src|href)="https:\/\/www\.djk-zar\.nl\/wp-content\//);
}
for (const price of ["555 euro", "472 euro", "225 euro"]) {
  assert.match(informationPages[4], new RegExp(price));
  assert.match(informationPages[5], new RegExp(price));
}
for (const page of informationPages.slice(4, 6)) {
  assert.equal(page.match(/class="costs-plan"/g)?.length, 3);
  assert.equal(page.match(/class="costs-terms"[\s\S]*?<\/ul>/)?.[0].match(/<li>/g)?.length, 7);
}
assert.match(informationPages[4], /class="costs-cta"[\s\S]*?href="\/speel-met-ons-mee\/#signup"/);
assert.match(informationPages[5], /class="costs-cta"[\s\S]*?href="\/en\/join-us\/#signup"/);
assert.match(informationPages[0], /href="https:\/\/www\.youtube\.com\/watch\?v=FMjl6rwJSLg"/);
for (const [page, href, label] of [[home, "/speel-met-ons-mee/", "Doe mee aan een waterpolotraining"], [home, "/waterpolo/", "Beginnen met waterpolo"], [englishHome, "/en/join-us/", "Join a water polo training session"], [englishHome, "/en/waterpolo-rules/", "Start playing water polo"], [informationPages[0], "/contact/", "Doe mee aan een waterpolotraining"], [informationPages[1], "/en/contact-us/", "Join a water polo training session"]]) {
  assert.ok(page.includes(`href="${href}">${label}</a>`));
  assert.doesNotMatch(page, />\s*(?:Meer informatie|More information)\s*<\/a>/i);
}
for (const [page, questions] of [[informationPages[0], ["Wat heb je nodig om te kunnen spelen?", "Kan ik een keertje meetrainen?", "Is waterpolo de zwaarste sport ter wereld?", "Hoe lang duurt een waterpolowedstrijd?", "Hoe verloopt een waterpolowedstrijd?", "Waarom draag je een cap bij waterpolo?", "Welke spieren train je met waterpolo?"]], [informationPages[1], ["What do you need to start playing?", "Can I join a training session?", "Is water polo the hardest sport in the world?", "How long is a water polo match?", "How does a water polo match work?", "Why do water polo players wear caps?", "Which muscles does water polo train?"]]]) {
  assert.equal(page.match(/class="water-faq-list"/g)?.length, 1);
  for (const question of questions) assert.ok(page.includes(`<h3>${question}</h3>`));
}
for (const page of clubPages) {
  assert.equal(page.match(/<h1\b/g)?.length, 1);
  assert.doesNotMatch(page, /(?:src|href)="https:\/\/www\.djk-zar\.nl\/wp-content\//);
}
for (const page of clubPages.slice(0, 2)) {
  for (const name of ["Jochem Lindelauf", "Jelmer van der Jagt", "Thijs Bogerd", "Maud Eriks", "Mark Groenhuijzen", "Jelle Dikker"]) assert.match(page, new RegExp(name));
  for (const image of ["board-jochem", "board-group", "board-thijs", "board-maud", "board-mark", "board-member"]) {
    assert.match(page, new RegExp(`src="/assets/images/${image}-380\\.webp"`));
    assert.match(page, new RegExp(`srcset="/assets/images/${image}-224\\.webp 224w, /assets/images/${image}-380\\.webp 380w"`));
  }
  assert.equal(page.match(/sizes="\(max-width: 600px\) 112px, \(max-width: 1024px\) 100px, 190px"/g)?.length, 6);
  assert.equal(page.match(/class="board-member"/g)?.length, 6);
}
for (const page of clubPages.slice(2)) {
  assert.equal(page.match(/class="sponsor"/g)?.length, 7);
  assert.equal(page.match(/rel="noopener noreferrer"/g)?.length, 7);
  for (const sponsor of ["PONG", "Maverick", "Huisartsenpraktijk Heemstede", "Ambiance Zonwering Tetteroo", "Jouw Groenteman", "Pindakaas Media", "IMHO Consulting"]) assert.match(page, new RegExp(sponsor));
  for (const destination of ["ponghouseofping.nl", "maverick-law.com", "huisartsheemstede.nl", "ambiance-zonwering.nl", "jouwgroenteman.nl", "pindakaasmedia.nl", "imho-consulting.com"]) assert.equal(page.match(new RegExp(`class="sponsor-link" href="[^"]*${destination.replaceAll(".", "\\.")}`, "g"))?.length, 1);
}
assert.match(clubPages[3], /rel="canonical" href="https:\/\/www\.djk-zar\.nl\/en\/sponsors\/"/);
const englishDescriptions = [
  [entryPages[5], "Read the DJK-ZAR code of conduct and learn how we keep our Amsterdam water polo club safe, welcoming and free from inappropriate behaviour."],
  [entryPages[3], "Contact DJK-ZAR to ask about water polo training, membership or the club. Find us at Mercatorbad in Amsterdam West."],
  [informationPages[5], "View DJK-ZAR membership fees for men, women and training members, including payment terms and cancellation details for each water polo season."],
  [clubPages[3], "Meet the businesses that sponsor DJK-ZAR and support our water polo club, teams and activities in Amsterdam."]
];
for (const [page, description] of englishDescriptions) {
  assert.ok(page.includes(`<meta name="description" content="${description}">`));
  assert.ok(page.includes(`<meta property="og:description" content="${description}">`));
  assert.ok(page.includes(`<meta name="twitter:description" content="${description}">`));
  const graph = JSON.parse(page.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)[1])["@graph"];
  assert.equal(graph.find((item) => item["@type"] === "WebPage").description, description);
}
const entryRoutes = ["/speel-met-ons-mee/", "/en/join-us/", "/contact/", "/en/contact-us/", "/gedragsregels/", "/en/code-of-conduct/"];
const registrationForms = [
  "https://tally.so/embed/eqOYlo?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1",
  "https://tally.so/embed/680ppB?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
];
const contactForms = [
  "https://tally.so/embed/680py5?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1",
  "https://tally.so/embed/obNkx1?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1&formEventsForwarding=1"
];
const entryCounterparts = [entryRoutes[1], entryRoutes[0], entryRoutes[3], entryRoutes[2], entryRoutes[5], entryRoutes[4]];
entryPages.forEach((page, index) => {
  assert.equal(page.match(/<h1\b/g)?.length, 1);
  assert.match(page, new RegExp(`rel="canonical" href="https:\\/\\/www\\.djk-zar\\.nl${entryRoutes[index].replaceAll("/", "\\/")}"`));
  assert.match(page, new RegExp(`rel="alternate" hreflang="${index % 2 ? "nl" : "en"}" href="https:\\/\\/www\\.djk-zar\\.nl${entryCounterparts[index].replaceAll("/", "\\/")}"`));
  assert.doesNotMatch(page, /<form\b|<input\b|<textarea\b|wp-content|elementor|recaptcha/i);
});
entryPages.slice(0, 2).forEach((page, index) => {
  assert.equal(page.match(/<details>/g)?.length, 6);
  assert.match(page, /assets\/documents\/machtiging-djk\.pdf/);
  assert.ok(page.indexOf("assets/documents/machtiging-djk.pdf") < page.indexOf('<iframe class="registration-frame"'));
  assert.match(page, /assets\/images\/join-womens-team\.jpg/);
  assert.ok(page.includes(`data-tally-src="${registrationForms[index]}"`));
  assert.match(page, new RegExp(`<iframe class="registration-frame"[^>]+title="${index ? "Registration form" : "Inschrijfformulier NL"}"></iframe>`));
  assert.equal(page.match(/<iframe class="registration-frame"/g)?.length, 1);
  assert.match(page, /https:\/\/tally\.so\/widgets\/embed\.js/);
  assert.doesNotMatch(page, /registration-fallback|rechtstreeks op Tally|directly on Tally|docs\.google\.com/);
});
entryPages.slice(2, 4).forEach((page, index) => {
  assert.match(page, /Jan van Galenstraat 315/);
  assert.match(page, /<iframe class="contact-map" src="https:\/\/www\.google\.com\/maps\?q=/);
  assert.doesNotMatch(page, /Open in Google Maps|google\.com\/maps\/search/);
  assert.ok(page.includes(`data-tally-src="${contactForms[index]}"`));
  assert.match(page, new RegExp(`<iframe class="contact-frame"[^>]+title="${index ? "Contact" : "Contact NL"}"></iframe>`));
  assert.match(page, /https:\/\/tally\.so\/widgets\/embed\.js/);
  assert.equal(page.match(/<iframe class="contact-frame"/g)?.length, 1);
});
for (const page of entryPages.slice(4)) {
  assert.match(page, /assets\/documents\/gedragsregels-en-vertrouwenspersoon\.pdf/);
  assert.match(page, /mailto:vertrouwenspersoon@djk-zar\.nl/);
  assert.match(page, /Alicia Izeboud/);
}
assert.match(entryPages[4], /rel="canonical" href="https:\/\/www\.djk-zar\.nl\/gedragsregels\/"/);
assert.match(home, /<link rel="stylesheet" href="\/styles\.css\?v=13">/);
assert.match(home, /<script src="\/navigation\.js\?v=9" defer><\/script>/);
assert.match(home, /<meta name="theme-color" content="#175541">/);
assert.match(home, /class="menu-toggle"[^>]+><span aria-hidden="true">☰<\/span><\/button>/);
assert.match(home, /class="mobile-contact" href="\/contact\/"/);
assert.match(home, /data-open-label="Menu openen" data-close-label="Menu sluiten"/);
for (const page of [home, englishHome, ...entryPages.slice(0, 2)]) {
  assert.equal(page.match(/<section class="top-hero"/g)?.length, 1);
  assert.match(page, /class="button button-primary"/);
}
assert.match(home, /<link rel="preload" as="image" href="\/assets\/images\/water-polo-hero\.avif" fetchpriority="high">/);
assert.match(englishHome, /water-polo-hero\.avif/);
assert.equal(home.match(/loading="lazy" fetchpriority="low"/g)?.length, 11);
for (const page of [home, englishHome]) assert.doesNotMatch(page, /reviewRating|ratingValue|bestRating|5 out of 5 stars|★★★★★/);
assert.match(home, /<p class="top-hero-title">Spelers gezocht!<\/p>/);
assert.match(englishHome, /<p class="top-hero-title">New players wanted!<\/p>/);
assert.match(entryPages[0], /join-womens-team-background\.jpg/);
assert.match(entryPages[1], /join-womens-team-background\.jpg/);
assert.match(entryPages[0], /<h1 class="top-hero-title">Waterpolo Amsterdam<\/h1>/);
assert.match(entryPages[1], /<h1 class="top-hero-title">Water polo Amsterdam<\/h1>/);
assert.match(sharedStyles, /\.site-logo \{[^}]*flex: 0 0 301px/);
assert.match(sharedStyles, /html \{[^}]*background: #175541/);
assert.match(sharedStyles, /body \{[^}]*background: #175541/);
assert.match(sharedStyles, /\.site-main \{[^}]*background: var\(--paper\)/);
assert.match(sharedStyles, /\.site-header \{[^}]*height: 88px/);
assert.match(sharedStyles, /\.site-logo \{[^}]*flex-basis: 250px/);
assert.match(sharedStyles, /\.menu-toggle \{[^}]*place-items: center/);
assert.match(sharedStyles, /\.menu-toggle span \{[^}]*2\.6rem/);
assert.match(sharedStyles, /\.mobile-menu \{[^}]*inset: 88px 0 0/);
assert.match(sharedStyles, /\.site-main \{[^}]*padding-top: 88px/);
assert.match(sharedStyles, /\.top-hero::after[^}]*clip-path: ellipse/);
assert.match(sharedStyles, /\.top-hero-title[^}]*58px/);
assert.match(sharedStyles, /\.section-heading-line[^}]*background: var\(--green-dark\)/);
assert.match(sharedStyles, /\.privacy-link \{[^}]*font-size: \.9rem/);
assert.equal(home.match(/class="section-heading"/g)?.length, 3);
assert.equal(englishHome.match(/class="section-heading"/g)?.length, 3);
assert.equal(entryPages[0].match(/class="section-heading"/g)?.length, 4);
assert.equal(entryPages[1].match(/class="section-heading"/g)?.length, 4);
assert.equal(entryPages[4].match(/class="section-heading"/g)?.length, 1);
assert.equal(entryPages[5].match(/class="section-heading"/g)?.length, 1);
for (const [page, count] of informationPages.map((page, index) => [page, [2, 2, 2, 2, 1, 1][index]])) {
  assert.equal(page.match(/class="section-heading"/g)?.length, count);
}
for (const [page, heading, canonical, alternate] of [[dutchHistory, "De geschiedenis van DJK-ZAR", "https://www.djk-zar.nl/geschiedenis/", "https://www.djk-zar.nl/en/history/"], [englishHistory, "The history of DJK-ZAR", "https://www.djk-zar.nl/en/history/", "https://www.djk-zar.nl/geschiedenis/"]]) {
  assert.equal(page.match(/<h1\b/g)?.length, 1);
  assert.match(page, new RegExp(`<h1[^>]*>${heading}<\\/h1>`));
  assert.ok(page.includes(`rel="canonical" href="${canonical}"`));
  assert.ok(page.includes(`rel="alternate" hreflang="${page === dutchHistory ? "en" : "nl"}" href="${alternate}"`));
  assert.equal(page.match(/class="history-event"/g)?.length, 6);
  assert.equal(page.match(/class="history-seasons"[\s\S]*?<\/ol>/)?.[0].match(/<li>/g)?.length, 7);
  for (const claim of ["1892", "1938", "1985", "1901–02", "1907–08", "Mercatorbad"]) assert.match(page, new RegExp(claim));
}
assert.match(dutchHistory, /18 maart 1985/);
assert.match(englishHistory, /18 March 1985/);
assert.doesNotMatch(dutchHistory, /Een naam met twee verhalen/);
assert.doesNotMatch(englishHistory, /One name, two stories/);

const builtPages = [home, englishHome, reference, ...historyPages, ...pages, ...entryPages].join("");
assert.doesNotMatch(builtPages, /speelde we|heren teams|dames team|oud studenten|Ik speel als sinds|jaarlijk team uitje|competieteams|iedereen die wilt|Als is het maar|Jury cursus|wateprolovereniging|Bijlages|incasso formulier|parkeer app|untill|parking is for free|How many teams and levels you have|5 men teams|beginning waterpolo players|Anyways|SPELER HEREN/i);
assert.doesNotMatch(builtPages, /DJK-Zar/);
assert.doesNotMatch(informationPages[0], /team sport/);
assert.doesNotMatch(informationPages[3], /PARKEREN/);
for (const team of ["Women’s team", "Men’s 1", "Men’s 2", "Men’s 3", "Men’s 4", "Men’s 5", "Training team"]) assert.match(englishHome, new RegExp(`<h3>${team}<\\/h3>`));
assert.doesNotMatch(englishHome, /<h3>Heren [1-5]<\/h3>|SPELER (?:HEREN|DAMES)/);
assert.doesNotMatch(builtPages, /#32bf38|home-(?:kicker|title-line)|entry-(?:kicker|title)|info-title/i);
assert.match(navigation, /event\.key !== "Escape"/);
assert.match(navigation, /menuToggle\?\.setAttribute\("aria-label"/);
assert.equal(home.match(/<details class="nav-group">/g)?.length, 4);
for (const path of ["/speel-met-ons-mee/", "/waterpolo/", "/geschiedenis/", "/bestuur/", "/gedragsregels/", "/sponsors/", "/extra-informatie/", "/en/water-polo-amsterdam/"]) assert.match(home, new RegExp(`href="${path.replaceAll("/", "\\/")}`));
assert.match(reference, /class="card-grid"/);
assert.match(reference, /class="people-grid"/);
assert.match(reference, /name="robots" content="noindex, nofollow"/);
const englishLayout = renderPage({ route: "/en/example/", lang: "en-GB", title: "Example", description: "Example", canonical: false, alternates: [{ lang: "nl", href: "https://www.djk-zar.nl/" }], main: "<h1>Example</h1>" });
for (const path of ["/en/join-us/", "/en/waterpolo-rules/", "/en/history/", "/en/djk-zar/", "/en/code-of-conduct/", "/en/sponsors/", "/en/extra-information/", "/en/contact-us/"]) assert.match(englishLayout, new RegExp(`href="${path.replaceAll("/", "\\/")}`));
assert.match(notFound, /name="robots" content="noindex, follow"/);
assert.doesNotMatch(notFound, /rel="canonical"/);
for (const target of [
  "https://www.djk-zar.nl/en/water-polo-amsterdam/",
  "https://www.djk-zar.nl/gedragsregels/",
  "https://www.djk-zar.nl/en/sponsors/",
  "https://www.djk-zar.nl/assets/documents/gedragsregels-en-vertrouwenspersoon.pdf",
  "https://www.djk-zar.nl/assets/documents/machtiging-djk.pdf"
]) assert.match(apache, new RegExp(target.replaceAll("/", "\\/")));
assert.match(apache, /RewriteCond %\{THE_REQUEST\} \\s\/\+index\\\.html\[\?\\s\] \[NC\]\nRewriteRule \^index\\\.html\$ https:\/\/www\.djk-zar\.nl\/ \[R=301,L,NE\]/);
assert.match(apache, /RewriteRule \^\(\.\+\)\$ https:\/\/www\.djk-zar\.nl\/\$1\/ \[R=301,L,NE\]/);
assert.ok(apache.indexOf("^index\\.html$") < apache.indexOf("^(.+)$"));
assert.match(apache, /ErrorDocument 404 \/404\.html/);
assert.match(apache, /\(\?:www\|static\)\\\.djk-zar/);
assert.match(apache, /HTTP:X-Forwarded-Proto/);
assert.match(apache, /Content-Security-Policy "frame-src https:\/\/tally\.so https:\/\/www\.google\.com"/);

const canonicalPages = [home, englishHome, ...historyPages, ...informationPages, ...clubPages, ...entryPages];
const canonicalTitles = canonicalPages.map((page) => page.match(/<title>([^<]+)<\/title>/)[1]);
const canonicalDescriptions = canonicalPages.map((page) => page.match(/<meta name="description" content="([^"]+)">/)[1]);
assert.equal(new Set(canonicalTitles).size, canonicalPages.length);
assert.equal(new Set(canonicalDescriptions).size, canonicalPages.length);
for (const page of canonicalPages) {
  assert.equal(page.match(/<meta name="robots"/g)?.length, 1);
  assert.equal(page.match(/<meta property="og:title"/g)?.length, 1);
  assert.equal(page.match(/<meta name="twitter:card"/g)?.length, 1);
  assert.match(page, /<meta property="og:image" content="https:\/\/www\.djk-zar\.nl\/assets\/images\/djk-zar-social\.png">/);
  const jsonLd = page.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)?.[1];
  assert.ok(jsonLd);
  const graph = JSON.parse(jsonLd)["@graph"];
  assert.ok(graph.some((item) => item["@type"] === "WebPage"));
  assert.ok(graph.some((item) => Array.isArray(item["@type"]) && item["@type"].includes("SportsClub")));
  assert.doesNotMatch(jsonLd, /wp-content|wordpress|admin/i);
}

const pagesByCanonical = new Map(canonicalPages.map((page) => [page.match(/<link rel="canonical" href="([^"]+)">/)?.[1], page]));
for (const [canonical, page] of pagesByCanonical) {
  for (const alternate of page.matchAll(/<link rel="alternate" hreflang="[^"]+" href="([^"]+)">/g)) {
    const target = pagesByCanonical.get(alternate[1]);
    assert.ok(target, `${canonical}: missing alternate target ${alternate[1]}`);
    assert.match(target, new RegExp(`rel="alternate" hreflang="[^"]+" href="${canonical.replaceAll("/", "\\/")}"`));
  }
}

for (const page of [home, englishHome]) {
  const organization = JSON.parse(page.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)[1])["@graph"].find((item) => Array.isArray(item["@type"]));
  assert.ok(!("review" in organization));
}

const [sitemap, robots] = await Promise.all([read("sitemap.xml"), read("robots.txt")]);
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
assert.equal(sitemapUrls.length, 20);
assert.equal(new Set(sitemapUrls).size, 20);
assert.ok(!sitemapUrls.includes("https://www.djk-zar.nl/teams/"));
for (const page of canonicalPages) {
  const canonical = page.match(/<link rel="canonical" href="([^"]+)">/)?.[1];
  assert.ok(sitemapUrls.includes(canonical));
}
for (const alias of ["/en/", "/elementor-802/", "/en/sponsors-2/", "/404.html", "/reference.html"]) {
  assert.ok(!sitemapUrls.includes(`https://www.djk-zar.nl${alias}`));
}
assert.match(robots, /^User-agent: \*\nAllow: \/\n/m);
assert.match(robots, /Sitemap: https:\/\/www\.djk-zar\.nl\/sitemap\.xml/);

console.log("Static build checks passed");
