import { renderSectionHeading } from "../layout.mjs";

export default {
  route: "/reference.html",
  lang: "nl-NL",
  title: "Gedeelde componenten | DJK-ZAR",
  description: "Referentie voor gedeelde DJK-ZAR paginaonderdelen.",
  canonical: false,
  alternates: [{ lang: "en", href: "https://www.djk-zar.nl/en/water-polo-amsterdam/" }],
  head: '  <meta name="robots" content="noindex, nofollow">\n',
  main: `    <section class="hero">
      <div class="hero-content"><p class="eyebrow">DJK-ZAR Amsterdam</p><h1>Gedeelde componenten</h1><p>Een responsive referentie voor pagina-opbouw, typografie en bediening.</p><a class="button button-light" href="#voorbeelden">Bekijk voorbeelden</a></div>
    </section>
    <section class="section constrained" id="voorbeelden">
      ${renderSectionHeading({ kicker: "Tekstblok", title: "Waterpolo Amsterdam" })}<p>DJK-ZAR is een Amsterdamse waterpoloclub met een rijke historie. Deze referentie gebruikt dezelfde beperkte set patronen als de publieke pagina’s.</p>
    </section>
    <section class="section section-soft">
      <div class="card-grid">
        <article class="card"><img src="/assets/images/womens-team-amsterdam.jpg" width="716" height="716" alt="Waterpoloteam"><div class="card-body"><h3>Teamuitjes</h3><p>Kaart met afbeelding, kop en korte tekst.</p></div></article>
        <article class="card"><img src="/assets/images/mens-team-3.jpg" width="1024" height="614" alt="Waterpoloteam met clubvlag"><div class="card-body"><h3>Wedstrijden</h3><p>Dezelfde kaart schaalt naar twee en één kolom.</p></div></article>
        <article class="card"><img src="/assets/images/womens-team-and-mario.jpg" width="716" height="716" alt="Waterpolospelers"><div class="card-body"><h3>Onze leden</h3><p>Lokale afbeeldingen behouden hun vaste uitsnede.</p></div></article>
      </div>
    </section>
    <section class="section image-text">
      <div><p class="eyebrow">Afbeelding en tekst</p><h2>Onze teams</h2><p>Een eenvoudige tweekolomsrij wordt op smalle schermen één kolom.</p><a class="button button-primary" href="/speel-met-ons-mee/">Speel met ons mee</a></div>
      <img src="/assets/images/water-polo-team-2026.jpeg" width="1197" height="797" alt="DJK-ZAR waterpoloteam">
    </section>
    <section class="section team-list">
      <article class="team-row"><div><p class="eyebrow">Bond 3e klasse</p><h3>Dames</h3><p>Teamrij met label, kop, tekst en een beeld in een vaste responsive volgorde.</p></div><img src="/assets/images/womens-team.webp" width="1984" height="1488" alt="Dames waterpoloteam"></article>
      <article class="team-row"><div><p class="eyebrow">Reserve 1e klasse</p><h3>Heren 1</h3><p>Afwisselende rijen gebruiken hetzelfde patroon zonder paginaspecifieke layoutcode.</p></div><img src="/assets/images/mens-team-1.webp" width="1600" height="1200" alt="Heren waterpoloteam"></article>
    </section>
    <section class="section">
      <div class="people-grid">
        <article class="person"><img src="/assets/images/board-jochem.jpeg" width="801" height="931" alt="Jochem Lindelauf"><h3>Jochem Lindelauf</h3><p>Voorzitter</p></article>
        <article class="person"><img src="/assets/images/board-member.jpeg" width="3024" height="4032" alt="Bestuurslid"><h3>Bestuurslid</h3><p>Functie</p></article>
        <article class="person"><img src="/assets/images/board-thijs.png" width="300" height="300" alt="Thijs Bogerd"><h3>Thijs Bogerd</h3><p>Penningmeester</p></article>
      </div>
    </section>
    <section class="section section-soft">${renderSectionHeading({ title: "Sponsors" })}<div class="sponsor-grid"><img src="/assets/images/pong-footer.webp" width="1668" height="1728" alt="Pong House of Ping"><img src="/assets/images/djk-zar-logo.png" width="800" height="300" alt="DJK-ZAR"><img src="/assets/images/pong-footer.webp" width="1668" height="1728" alt="Pong House of Ping"></div></section>
    <section class="section"><div class="callout"><div><h2>Klaar om mee te trainen?</h2><p>Call-to-action met één duidelijke vervolgstap.</p></div><a class="button button-light" href="/contact/">Contact</a></div></section>`
};
