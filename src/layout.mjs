const escape = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll('"', "&quot;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;");

const navigation = {
  nl: {
    home: ["Home", "/"], join: ["Speel mee", "/speel-met-ons-mee/"],
    joinLinks: [["Speel mee", "/speel-met-ons-mee/"], ["Contributie", "/contributie/"], ["Keertje meetrainen?", "/contact/"], ["Inschrijfformulier", "/speel-met-ons-mee/#signup"], ["Beginnen met waterpolo", "/waterpolo/"]],
    club: "Club", clubLinks: [["Geschiedenis", "/geschiedenis/"], ["Bestuur", "/bestuur/"], ["Gedragsregels", "/gedragsregels/"], ["Sponsors", "/sponsors/"]],
    visitors: ["Bezoekende teams", "/extra-informatie/"], language: "🇬🇧 English", contact: ["Contact", "/contact/"]
  },
  en: {
    home: ["Home", "/en/water-polo-amsterdam/"], join: ["Join us", "/en/join-us/"],
    joinLinks: [["Join us", "/en/join-us/"], ["Costs", "/en/costs/"], ["Join a training?", "/en/contact-us/"], ["Sign up form", "/en/join-us/#signup"], ["New to waterpolo?", "/en/waterpolo-rules/"]],
    club: "Club", clubLinks: [["History", "/en/history/"], ["Board", "/en/djk-zar/"], ["Code of conduct", "/en/code-of-conduct/"], ["Sponsors", "/en/sponsors/"]],
    visitors: ["Visiting teams", "/en/extra-information/"], language: "🇳🇱 Nederlands", contact: ["Contact", "/en/contact-us/"]
  }
};

export const trainingSchedule = {
  nl: [["Maandag", "21:00 – 22:00 – Heren 4, 5"], ["Dinsdag", "20:00 – 21:00 – Dames & trainingsteam<br>21:00 – 22:00 – Heren 1, 2"], ["Woensdag", "21:00 – 22:00 – Heren 3, 4, 5"], ["Donderdag", "20:30 – 22:00 – Heren 1, 2, 3"]],
  en: [["Monday", "21:00 – 22:00 – Men 4, 5"], ["Tuesday", "20:00 – 21:00 – Women & Training team<br>21:00 – 22:00 – Men 1, 2"], ["Wednesday", "21:00 – 22:00 – Men 3, 4, 5"], ["Thursday", "20:30 – 22:00 – Men 1, 2, 3"]]
};

const link = ([label, href], route, className = "") => `<a${className ? ` class="${className}"` : ""} href="${href}"${route === href ? ' aria-current="page"' : ""}>${label}</a>`;

export function renderTopHero({ image, title, text, href, label, heading = true }) {
  const titleHtml = heading ? `<h1 class="top-hero-title">${title}</h1>` : `<p class="top-hero-title">${title}</p>`;
  return `<section class="top-hero" style="--top-hero-image:url(&quot;${escape(image)}&quot;)"><div>${titleHtml}<p>${text}</p><a class="button button-primary" href="${href}">${label}</a></div></section>`;
}

export function renderSectionHeading({ kicker, title, level = 2 }) {
  return `<div class="section-heading">${kicker ? `<p class="section-heading-kicker">${kicker}</p>` : ""}<h${level} class="section-heading-title">${title}</h${level}><span class="section-heading-line" aria-hidden="true"></span></div>`;
}

const submenu = (label, links, route) => `<details class="nav-group">
              <summary>${label}</summary>
              <div class="subnav">${links.map((item) => link(item, route)).join("")}</div>
            </details>`;

function renderNavigation(page, mobile = false) {
  const locale = page.lang.startsWith("en") ? "en" : "nl";
  const nav = navigation[locale];
  const other = (page.alternates || []).find(({ lang }) => locale === "en" ? lang.startsWith("nl") : lang.startsWith("en"));
  const languageHref = other?.href?.replace("https://www.djk-zar.nl", "") || (locale === "en" ? "/" : "/en/water-polo-amsterdam/");
  return `<nav${mobile ? ' id="mobile-menu"' : ""} class="${mobile ? "mobile-menu" : "desktop-menu"}" aria-label="${mobile ? (locale === "en" ? "Mobile navigation" : "Mobiele navigatie") : (locale === "en" ? "Main navigation" : "Hoofdnavigatie")}">
            ${link(nav.home, page.route)}
            ${submenu(nav.join[0], nav.joinLinks, page.route)}
            ${submenu(nav.club, nav.clubLinks, page.route)}
            ${link(nav.visitors, page.route)}
            <a class="language-link" href="${escape(languageHref)}">${nav.language}</a>
            ${mobile ? link(nav.contact, page.route, "mobile-contact") : ""}
          </nav>`;
}

function renderFooter(page) {
  const en = page.lang.startsWith("en");
  return `<footer class="site-footer">
    <section class="footer-cta">
      <div class="footer-cta-inner">
        <div><h2>${en ? "Amsterdam's water polo club for everyone" : "Klaar om mee te trainen?"}</h2>
        <p>${en ? "Whether you’re a seasoned player or picking up a ball for the first time, DJK-ZAR is Amsterdam’s welcoming water polo club for all levels. Join a community that loves the sport, and loves to have fun." : "DJK-ZAR is een gezellige waterpolovereniging in Amsterdam. Of je nu een ervaren speler bent of nog nooit een bal hebt gegooid, bij ons is iedereen welkom."}</p></div>
        <div class="footer-actions">${link(["Contact", en ? "/en/contact-us/" : "/contact/"], page.route, "button button-light")}${link([en ? "Sign up" : "Inschrijven", en ? "/en/join-us/#signup" : "/speel-met-ons-mee/#signup"], page.route, "button button-light")}</div>
      </div>
    </section>
    <div class="footer-info${en ? " footer-info-en" : ""}">
      <section><h2>${en ? "Training times" : "Trainingstijden"}</h2>
        ${trainingSchedule[en ? "en" : "nl"].map(([day, time]) => `<p><strong>${day}</strong><br>${time}</p>`).join("\n        ")}
      </section>
      <section class="footer-location"><h2>${en ? "Location" : "Locatie"}</h2><p>Mercatorbad<br>Jan van Galenstraat 315<br>1056 CB Amsterdam</p><iframe src="https://www.google.com/maps?q=Mercatorbad%2C%20Jan%20van%20Galenstraat%20315%2C%20Amsterdam&amp;output=embed" title="${en ? "Map showing Mercatorbad" : "Kaart met Mercatorbad"}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></section>
      <section class="footer-links"><h2>Privacy</h2><a class="privacy-link" href="/assets/documents/privacy-verklaring-djkzar.pdf">${en ? "Privacy statement" : "Privacyverklaring"}</a><h2>Sponsor</h2><a href="https://ponghouseofping.nl/"><img src="/assets/images/pong-footer.webp" width="120" height="124" alt="Pong House of Ping"></a></section>
    </div>
  </footer>`;
}

const origin = "https://www.djk-zar.nl";
const socialImage = `${origin}/assets/images/djk-zar-social.png`;

function renderSeo(page) {
  if (!page.canonical) return page.head || "";
  const en = page.lang.startsWith("en");
  const organization = {
    "@type": ["SportsClub", "Organization"], "@id": `${origin}/#organization`, name: "DJK-ZAR", url: `${origin}/`,
    logo: { "@type": "ImageObject", url: `${origin}/assets/images/djk-zar-logo.png`, width: 800, height: 300 },
    image: socialImage, sameAs: ["https://www.facebook.com/DJKZAR.Amsterdam/", "https://www.instagram.com/djkzaramsterdam/"],
    address: { "@type": "PostalAddress", streetAddress: "Jan van Galenstraat 315", postalCode: "1056 CB", addressLocality: "Amsterdam", addressCountry: "NL" },
    location: { "@type": "Place", name: "Mercatorbad", address: { "@type": "PostalAddress", streetAddress: "Jan van Galenstraat 315", postalCode: "1056 CB", addressLocality: "Amsterdam", addressCountry: "NL" } }
  };
  const graph = [
    organization,
    { "@type": "WebSite", "@id": `${origin}/#website`, url: `${origin}/`, name: "DJK-ZAR", publisher: { "@id": `${origin}/#organization` }, inLanguage: ["nl-NL", "en-GB"] },
    { "@type": "WebPage", "@id": `${page.canonical}#webpage`, url: page.canonical, name: page.title, description: page.description, isPartOf: { "@id": `${origin}/#website` }, about: { "@id": `${origin}/#organization` }, inLanguage: page.lang }
  ];
  const schema = JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replaceAll("<", "\\u003c");
  return `${page.head || ""}  <meta name="robots" content="index, follow, max-snippet:-1, max-video-preview:-1, max-image-preview:large">\n  <meta property="og:locale" content="${en ? "en_GB" : "nl_NL"}">\n  <meta property="og:type" content="${page.route === "/" || page.route === "/en/water-polo-amsterdam/" ? "website" : "article"}">\n  <meta property="og:title" content="${escape(page.title)}">\n  <meta property="og:description" content="${escape(page.description)}">\n  <meta property="og:url" content="${escape(page.canonical)}">\n  <meta property="og:site_name" content="DJK-ZAR">\n  <meta property="og:image" content="${socialImage}">\n  <meta property="og:image:width" content="1200">\n  <meta property="og:image:height" content="630">\n  <meta property="og:image:alt" content="DJK-ZAR water polo Amsterdam">\n  <meta name="twitter:card" content="summary_large_image">\n  <meta name="twitter:title" content="${escape(page.title)}">\n  <meta name="twitter:description" content="${escape(page.description)}">\n  <meta name="twitter:image" content="${socialImage}">\n  <script type="application/ld+json">${schema}</script>\n`;
}

export function renderPage(page) {
  const required = ["route", "lang", "title", "description", "main"];
  for (const key of required) if (!page[key]) throw new Error(`${page.route || "Page"}: missing ${key}`);
  if (!("canonical" in page)) throw new Error(`${page.route}: missing canonical`);

  const alternates = (page.alternates || [])
    .map(({ lang, href }) => `  <link rel="alternate" hreflang="${escape(lang)}" href="${escape(href)}">`)
    .join("\n");
  const en = page.lang.startsWith("en");
  const nav = navigation[en ? "en" : "nl"];

  return `<!doctype html>
<html lang="${escape(page.lang)}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#175541">
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-YNLVDLE9C0"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-YNLVDLE9C0');
  </script>
  <link rel="icon" href="/assets/images/favicon-32.png" sizes="32x32">
  <link rel="apple-touch-icon" href="/assets/images/apple-touch-icon.png">
  <title>${escape(page.title)}</title>
  <meta name="description" content="${escape(page.description)}">
${page.canonical ? `  <link rel="canonical" href="${escape(page.canonical)}">\n` : ""}${alternates}${alternates ? "\n" : ""}  <link rel="stylesheet" href="/styles.css?v=13">
${renderSeo(page)}</head>
<body>
  <a class="skip-link" href="#main">${en ? "Skip to the content" : "Ga naar de inhoud"}</a>
  <header class="site-header">
    <div class="header-inner">
      <a class="site-logo" href="${nav.home[1]}" aria-label="DJK-ZAR home"><img src="/assets/images/djk-zar-logo.png" width="800" height="300" alt=""></a>
      ${renderNavigation(page)}
      ${link(nav.contact, page.route, "button contact-button")}
      <div class="mobile-nav">
        <button class="menu-toggle" type="button" data-open-label="${en ? "Open menu" : "Menu openen"}" data-close-label="${en ? "Close menu" : "Menu sluiten"}" aria-label="${en ? "Open menu" : "Menu openen"}" aria-controls="mobile-menu" aria-expanded="false"><span aria-hidden="true">☰</span></button>
        ${renderNavigation(page, true)}
      </div>
    </div>
  </header>
  <main class="site-main" id="main">
${page.main}
  </main>
  ${renderFooter(page)}
  <script src="/navigation.js?v=9" defer></script>
${page.script ? `  <script src="${escape(page.script)}" defer></script>\n` : ""}</body>
</html>
`;
}
