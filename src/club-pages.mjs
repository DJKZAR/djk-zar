const origin = "https://www.djk-zar.nl";

const styles = `<style>
.club-page{font-style:italic}.club-page h1,.club-page h2,.club-page h3{font-style:normal}.club-heading{font-size:48px;text-align:center}.club-heading::after{content:'';display:block;width:58px;height:2px;margin:18px auto 0;background:var(--green-dark)}.club-intro{max-width:760px;margin:32px auto 0;color:#666a6e;font-family:"Inter var",system-ui,sans-serif;font-style:normal;line-height:1.65}.club-intro a{color:var(--red)}.board{max-width:1140px;margin:auto;padding:65px 25px 190px}.board .club-heading::after{display:none}.board .club-intro{text-align:center}.board-list{display:grid;grid-template-columns:repeat(3,1fr);gap:120px 14px;padding-top:150px}.board-member{position:relative;min-height:390px;padding:145px 20px 30px;border:1px solid #e1e1e1;text-align:center}.board-member img{position:absolute;top:-66px;left:50%;width:190px;height:190px;border-radius:50%;object-fit:cover;transform:translateX(-50%)}.board-member h2{font-size:23px}.board-member p{color:#666a6e;font-size:14px}.board-member a{font-family:Poppins,sans-serif;font-size:14px}.sponsors{padding:65px 0 110px}.sponsors .club-heading{max-width:1140px;margin:0 auto;padding:0 25px;text-align:left}.sponsors .club-heading::after{margin-left:0}.sponsors .club-intro{max-width:1140px;padding:0 25px}.sponsor-list{display:grid;gap:140px;margin-top:150px}.sponsor{display:grid;grid-template-columns:1fr 1fr;align-items:center;max-width:1140px;width:100%;margin:auto}.sponsor-link{display:grid;place-items:center;min-height:270px;padding:10px;background:#f3f3f3}.sponsor-link img{width:250px;height:250px;object-fit:contain}.sponsor-link img.wide{width:540px;height:230px}.sponsor-details{padding:25px 12px;color:var(--ink)}.sponsor-details h2{font-size:19px;font-weight:400}.sponsor-url{display:inline-flex;align-items:center;min-height:34px;padding:7px 14px;color:#fff;background:#007a53;font:500 11px Poppins,sans-serif}.sponsor-url::before{content:'↗';margin-right:12px;font-style:normal}.imho-logo{color:#24538b;font:500 40px/1 Roboto,sans-serif;text-align:center}.history{font-style:normal}.history-hero{padding:80px 25px 70px;color:#fff;background:var(--green-dark)}.history-hero .club-heading{max-width:900px;margin:auto;color:#fff}.history-hero .club-heading::after{background:#fff}.history-hero .club-intro{color:#fff;text-align:center}.history-facts{display:grid;grid-template-columns:repeat(3,1fr);max-width:1000px;margin:-30px auto 0;padding:0 25px;gap:18px}.history-fact{padding:26px 20px;background:#fff;border:1px solid var(--line);box-shadow:var(--shadow);text-align:center}.history-fact strong{display:block;color:var(--green-dark);font:700 34px Roboto,sans-serif}.history-fact span{font-size:13px}.history-body{max-width:900px;margin:auto;padding:85px 25px}.history-body>h2{font-size:38px}.history-timeline{margin:45px 0 80px;border-left:3px solid var(--green-dark)}.history-event{position:relative;padding:0 0 42px 40px}.history-event:last-child{padding-bottom:0}.history-event::before{content:'×';position:absolute;top:-4px;left:-14px;width:25px;height:25px;color:var(--red);background:#fff;font:900 28px/25px Roboto,sans-serif;text-align:center}.history-year{margin:0 0 5px;color:var(--green-dark);font:700 17px Roboto,sans-serif}.history-event h3{font-size:24px}.history-titles{margin:0 -25px 75px;padding:50px 25px;color:#fff;background:var(--green-dark);text-align:center}.history-titles h2{color:#fff;font-size:35px}.history-seasons{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;max-width:720px;margin:25px auto}.history-seasons li{list-style:none;padding:9px 13px;border:1px solid rgb(255 255 255 / 45%);font:600 13px Poppins,sans-serif}.history-sources{padding-top:35px}.history-sources h2{font-size:25px}.history-sources li{margin-bottom:10px;font-size:14px}
@media(min-width:601px) and (max-width:1024px){.board{padding-top:70px}.board-list{gap:55px 14px;padding-top:130px}.board-member{min-height:430px;padding-inline:25px}.board-member img{width:100px;height:100px;top:-50px}.board-member h2{overflow-wrap:anywhere}.board-member a{overflow-wrap:anywhere}.sponsors .club-heading{text-align:center}.sponsors .club-heading::after{margin-inline:auto}.sponsors .club-intro{text-align:center}.sponsor-list{gap:110px;margin-top:120px}.sponsor-link{min-height:270px}.sponsor-link img{width:240px;height:240px}.sponsor-link img.wide{width:360px;height:220px}}
@media(max-width:600px){.club-heading{font-size:29px}.history-hero{padding:50px 18px 55px}.history-facts{grid-template-columns:1fr;margin-top:-22px;padding-inline:18px}.history-fact{padding:18px}.history-body{padding:60px 18px}.history-body>h2{font-size:30px}.history-timeline{margin:35px 0 60px}.history-event{padding-left:27px}.history-event h3{font-size:21px}.history-titles{margin-inline:-18px;padding-inline:18px}.history-titles h2{font-size:28px}.history-seasons{padding:0}.club-intro{margin-top:24px;font-size:14px}.board{padding:35px 9px 70px}.board-list{grid-template-columns:1fr;gap:78px;padding-top:75px}.board-member{min-height:305px;padding-top:105px}.board-member img{top:-43px;width:112px;height:112px}.board-member h2{font-size:20px}.board-member p,.board-member a{font-size:12px}.sponsors{padding:25px 0 0}.sponsors .club-heading{text-align:center}.sponsors .club-heading::after{margin-inline:auto}.sponsors .club-intro{text-align:center}.sponsor-list{gap:0;margin-top:75px}.sponsor{grid-template-columns:1fr}.sponsor-link{min-height:245px}.sponsor-link img{width:230px;height:230px}.sponsor-link img.wide{width:calc(100% - 18px);height:220px}.sponsor-details{padding:6px 5px 50px}.sponsor-details h2{margin-bottom:8px;font-size:14px}.sponsor-url{min-height:30px;font-size:8px}.imho-logo{font-size:27px}}
</style>`;

const alternates = (nl, en) => [
  { lang: "en", href: `${origin}${en}` },
  { lang: "nl", href: `${origin}${nl}` }
];

const boardMembers = [
  { name: "Jochem Lindelauf", image: "board-jochem", email: "voorzitter@djk-zar.nl", nl: "Voorzitter | Speler H4", en: "Chairman | Men 4 player" },
  { name: "Jelmer van der Jagt", image: "board-group", email: "secretaris@djk-zar.nl", nl: "Secretaris & ledenadministratie | H5", en: "Secretary and member administration | Men 5 player" },
  { name: "Thijs Bogerd", image: "board-thijs", email: "penningmeester@djk-zar.nl", nl: "Penningmeester | Speler H3", en: "Treasurer | Men 3 player" },
  { name: "Maud Eriks", image: "board-maud", email: "waterpolo@djk-zar.nl", nl: "Waterpolocommissaris | Speler D1", en: "Head of water polo | Women’s 1 player" },
  { name: "Mark Groenhuijzen", image: "board-mark", email: "scheidsrechterszaken@djk-zar.nl", nl: "Scheidsrechterszaken | Speler H3", en: "Referee and jury business | Men 3 player" },
  { name: "Jelle Dikker", image: "board-member", nl: "Algemeen Bestuurslid | Speler H2", en: "General board member | Men 2 player" }
];

export function boardPage(locale) {
  const en = locale === "en";
  const route = en ? "/en/djk-zar/" : "/bestuur/";
  return {
    route, lang: en ? "en-GB" : "nl-NL",
    title: en ? "DJK-ZAR board members | Water polo Amsterdam" : "Bestuur Waterpolo Amsterdam - DJK-ZAR",
    description: en ? "Meet the DJK-ZAR board members and find contact details for the Amsterdam water polo club’s leadership team." : "Maak kennis met het bestuur van waterpoloclub DJK-ZAR en vind de contactgegevens van de bestuursleden.",
    canonical: `${origin}${route}`, alternates: alternates("/bestuur/", "/en/djk-zar/"), head: styles,
    main: `<article class="club-page board"><h1 class="club-heading">${en ? "Board members" : "Bestuursleden"}</h1><div class="club-intro"><p>${en ? "The board is responsible for the day-to-day organization of DJK-ZAR and supports the club’s teams, members and volunteers. Below you can find each board member, their role and contact details." : "Het bestuur is verantwoordelijk voor de dagelijkse organisatie van DJK-ZAR en ondersteunt de teams, leden en vrijwilligers binnen de vereniging. Hieronder vind je de bestuursleden, hun functies en hun contactgegevens."}</p><p>${en ? 'Do you have a question about membership, fees, water polo or refereeing? Please contact the board member responsible for that subject. For general enquiries, you can also use our <a href="/en/contact-us/">contact page</a>.' : 'Heb je een vraag over je lidmaatschap, contributie, waterpolozaken of arbitrage? Neem dan rechtstreeks contact op met het bestuurslid dat bij jouw vraag past. Voor algemene vragen kun je ook gebruikmaken van onze <a href="/contact/">contactpagina</a>.'}</p></div><div class="board-list">${boardMembers.map((member, index) => `<section class="board-member"><img src="/assets/images/${member.image}-380.webp" srcset="/assets/images/${member.image}-224.webp 224w, /assets/images/${member.image}-380.webp 380w" sizes="(max-width: 600px) 112px, (max-width: 1024px) 100px, 190px" width="190" height="190" alt="${member.name}"${index ? ' loading="lazy" fetchpriority="low"' : ' fetchpriority="high"'}><h2>${member.name}</h2><p>${member[locale]}</p>${member.email ? `<a href="mailto:${member.email}">${member.email}</a>` : ""}</section>`).join("")}</div></article>`
  };
}

const historyCopy = {
  nl: {
    title: "Geschiedenis van DJK-ZAR | Waterpolo Amsterdam",
    description: "Lees de geschiedenis van DJK-ZAR: van D.J.K. en zeven landstitels tot de fusie met ZAR in 1985 en de huidige waterpoloclub in Amsterdam.",
    heading: "De geschiedenis van DJK-ZAR",
    intro: "Twee Amsterdamse zwemverenigingen, een verdwenen zwembad en zeven landstitels vormen de basis van DJK-ZAR. De vereniging van nu ontstond op 18 maart 1985 uit een fusie tussen D.J.K. en ZAR.",
    facts: [["1892", "oprichting D.J.K."], ["7×", "Nederlands landskampioen"], ["1985", "fusie tot D.J.K.-ZAR"]],
    timelineHeading: "Van Heiligewegbad tot Mercatorbad",
    events: [
      ["1892", "De Jonge Kampioen", "D.J.K., voluit De Jonge Kampioen, wordt opgericht in Amsterdam. De vereniging heeft haar thuisbasis in het Heiligewegbad in de binnenstad, op de plek waar nu winkelcentrum Kalvertoren staat."],
      ["1901–1908", "Zeven keer op rij de beste van Nederland", "De heren van D.J.K. winnen zeven opeenvolgende landstitels: vanaf seizoen 1901–1902 tot en met 1907–1908. Daarmee hoort D.J.K. bij de pioniers van het Nederlandse waterpolo."],
      ["1938", "Oprichting ZAR", "Zwemvereniging Admiraal de Ruijter, afgekort ZAR, wordt opgericht. Bijna een halve eeuw later zullen de twee Amsterdamse verenigingen samen verdergaan."],
      ["18 maart 1985", "D.J.K. en ZAR fuseren", "Wanneer het Heiligewegbad moet sluiten, zoekt D.J.K. een vereniging die een fusie kan dragen. Die partner wordt ZAR. Samen vormen zij de nieuwe vereniging D.J.K.-ZAR."],
      ["2018", "Volledige focus op waterpolo", "D.J.K.-ZAR was jarenlang actief in waterpolo, diplomazwemmen en wedstrijdzwemmen. In 2018 stopt de afdeling wedstrijdzwemmen, waarna de club zich volledig op waterpolo richt."],
      ["Vandaag", "Waterpolo in Amsterdam-West", "DJK-ZAR speelt en traint tegenwoordig in het Mercatorbad. De historische naam leeft voort in een actieve vereniging met heren-, dames- en trainingsteams op verschillende niveaus."]
    ],
    titlesHeading: "De zeven landstitels van D.J.K.",
    titlesText: "D.J.K. domineerde de beginjaren van het Nederlandse landskampioenschap. De zeven titels werden zonder onderbreking gewonnen.",
    seasons: ["1901–02", "1902–03", "1903–04", "1904–05", "1905–06", "1906–07", "1907–08"],
    sourcesHeading: "Bronnen",
    sources: [
      ["Gearchiveerde clubgeschiedenis van D.J.K.-ZAR", "https://web.archive.org/web/20121203055527/http://www.djk-zar.nl/over-de-club-/-contributie/over-djk-zar"],
      ["Overzicht Nederlandse landskampioenen waterpolo heren", "https://nl.wikipedia.org/wiki/Nederlands_kampioenschap_waterpolo_heren"],
      ["Gearchiveerd bestuursbericht over de wijzigingen in 2018", "https://web.archive.org/web/20180831071409/http://www.djk-zar.nl/nieuws/waterpolo/bericht-van-het-bestuur"]
    ]
  },
  en: {
    title: "History of DJK-ZAR | Amsterdam water polo club",
    description: "Discover DJK-ZAR's history, from D.J.K. and seven Dutch titles to the merger with ZAR in 1985 and today's Amsterdam water polo club.",
    heading: "The history of DJK-ZAR",
    intro: "Two Amsterdam swimming clubs, a lost city-centre pool and seven national titles form the foundations of DJK-ZAR. Today's club was created on 18 March 1985 through the merger of D.J.K. and ZAR.",
    facts: [["1892", "D.J.K. founded"], ["7×", "Dutch national champion"], ["1985", "merger into D.J.K.-ZAR"]],
    timelineHeading: "From Heiligewegbad to Mercatorbad",
    events: [
      ["1892", "De Jonge Kampioen", "D.J.K., short for De Jonge Kampioen, is founded in Amsterdam. The club is based at the Heiligewegbad swimming pool in the city centre, on the site now occupied by the Kalvertoren shopping centre."],
      ["1901–1908", "The Netherlands' best seven times in a row", "D.J.K.'s men win seven consecutive national titles, from the 1901–02 season through 1907–08. This places D.J.K. among the pioneers of Dutch water polo."],
      ["1938", "ZAR is founded", "Zwemvereniging Admiraal de Ruijter, known as ZAR, is founded. Nearly half a century later, the two Amsterdam clubs will continue together."],
      ["18 March 1985", "D.J.K. and ZAR merge", "When the Heiligewegbad is due to close, D.J.K. looks for a club capable of supporting a merger. ZAR becomes that partner, and together they form D.J.K.-ZAR."],
      ["2018", "A complete focus on water polo", "For many years, D.J.K.-ZAR offers water polo, swimming lessons and competitive swimming. The competitive swimming section closes in 2018, after which the club focuses entirely on water polo."],
      ["Today", "Water polo in Amsterdam West", "DJK-ZAR now plays and trains at Mercatorbad. Its historic name lives on in an active club with men's, women's and training teams at different levels."]
    ],
    titlesHeading: "D.J.K.'s seven national titles",
    titlesText: "D.J.K. dominated the early years of the Dutch national championship, winning all seven titles without interruption.",
    seasons: ["1901–02", "1902–03", "1903–04", "1904–05", "1905–06", "1906–07", "1907–08"],
    sourcesHeading: "Sources",
    sources: [
      ["Archived D.J.K.-ZAR club history (Dutch)", "https://web.archive.org/web/20121203055527/http://www.djk-zar.nl/over-de-club-/-contributie/over-djk-zar"],
      ["List of Dutch men's water polo champions (Dutch)", "https://nl.wikipedia.org/wiki/Nederlands_kampioenschap_waterpolo_heren"],
      ["Archived board update about the 2018 changes (Dutch)", "https://web.archive.org/web/20180831071409/http://www.djk-zar.nl/nieuws/waterpolo/bericht-van-het-bestuur"]
    ]
  }
};

export function historyPage(locale) {
  const en = locale === "en";
  const c = historyCopy[locale];
  const route = en ? "/en/history/" : "/geschiedenis/";
  return {
    route, lang: en ? "en-GB" : "nl-NL", title: c.title, description: c.description,
    canonical: `${origin}${route}`, alternates: alternates("/geschiedenis/", "/en/history/"), head: styles,
    main: `<article class="club-page history"><header class="history-hero"><h1 class="club-heading">${c.heading}</h1><p class="club-intro">${c.intro}</p></header><div class="history-facts">${c.facts.map(([number, label]) => `<div class="history-fact"><strong>${number}</strong><span>${label}</span></div>`).join("")}</div><div class="history-body"><h2>${c.timelineHeading}</h2><div class="history-timeline">${c.events.map(([year, heading, text]) => `<section class="history-event"><p class="history-year">${year}</p><h3>${heading}</h3><p>${text}</p></section>`).join("")}</div><section class="history-titles"><h2>${c.titlesHeading}</h2><p>${c.titlesText}</p><ol class="history-seasons">${c.seasons.map((season) => `<li>${season}</li>`).join("")}</ol></section><section class="history-sources"><h2>${c.sourcesHeading}</h2><ul>${c.sources.map(([label, href]) => `<li><a href="${href}" target="_blank" rel="noopener noreferrer">${label}</a></li>`).join("")}</ul></section></div></article>`
  };
}

const sponsors = [
  { nl: "PONG – HOUSE OF PING!", en: "PONG – HOUSE OF PING!", image: "sponsor-pong.webp", alt: "PONG House of Ping", href: "https://ponghouseofping.nl/" },
  { nl: "Maverick Advocaten", en: "Maverick Lawyers", image: "sponsor-maverick.png", alt: "Maverick", href: "https://www.maverick-law.com/" },
  { nl: "Huisartsenpraktijk Heemstede", en: "Huisartsenpraktijk Heemstede", image: "sponsor-heemstede.svg", alt: "Huisartsenpraktijk Heemstede", href: "http://www.huisartsheemstede.nl/" },
  { nl: "Ambiance Zonwering Tetteroo", en: "Ambiance Zonwering Tetteroo", image: "sponsor-ambiance-tetteroo.svg", alt: "Ambiance Zonwering Tetteroo", href: "https://www.ambiance-zonwering.nl/tetteroo-zoetermeer/" },
  { nl: "Jouw Groenteman", en: "Jouw Groenteman", image: "sponsor-jouw-groenteman.png", alt: "Jouw Groenteman", href: "https://jouwgroenteman.nl/" },
  { nl: "Pindakaas Media", en: "Pindakaas Media", image: "sponsor-pindakaas-media.jpg", alt: "Pindakaas Media", href: "http://www.pindakaasmedia.nl/", wide: true },
  { nl: "IMHO Consulting", en: "IMHO Consulting", alt: "IMHO Consulting", href: "http://www.imho-consulting.com/" }
];

export function sponsorsPage(locale) {
  const en = locale === "en";
  const route = en ? "/en/sponsors/" : "/sponsors/";
  return {
    route, lang: en ? "en-GB" : "nl-NL", title: en ? "Sponsors | Water polo Amsterdam | DJK-ZAR" : "Sponsors - Waterpolo Amsterdam - DJK-ZAR",
    description: en ? "Meet the businesses that sponsor DJK-ZAR and support our water polo club, teams and activities in Amsterdam." : "Maak kennis met de bedrijven die DJK-ZAR sponsoren en onze waterpoloteams en clubactiviteiten in Amsterdam ondersteunen.",
    canonical: `${origin}${route}`, alternates: alternates("/sponsors/", "/en/sponsors/"), head: styles,
    main: `<article class="club-page sponsors"><h1 class="club-heading">Sponsors</h1><div class="club-intro"><p>${en ? "Our sponsors help DJK-ZAR keep water polo in Amsterdam accessible, competitive and sociable. Their support allows us to invest in our teams, training sessions and club activities." : "Onze sponsoren helpen DJK-ZAR om waterpolo in Amsterdam toegankelijk, sportief en gezellig te houden. Dankzij hun steun kunnen we investeren in onze teams, trainingen en clubactiviteiten."}</p><p>${en ? "Would your organization like to support an active water polo club in Amsterdam? We would be happy to discuss a form of sponsorship that suits your organization." : "Wil je met jouw organisatie bijdragen aan een actieve waterpolovereniging in Amsterdam? We bespreken graag welke vorm van sponsoring bij jouw organisatie past."}</p><p><a href="${en ? "/en/contact-us/" : "/contact/"}">${en ? "Ask about sponsorship opportunities" : "Vraag naar de mogelijkheden voor sponsoring"}</a></p></div><div class="sponsor-list">${sponsors.map((sponsor) => `<section class="sponsor"><a class="sponsor-link" href="${sponsor.href}" target="_blank" rel="noopener noreferrer" aria-label="${sponsor.alt} (${en ? "opens in a new tab" : "opent in een nieuw tabblad"})">${sponsor.image ? `<img class="${sponsor.wide ? "wide" : ""}" src="/assets/images/${sponsor.image}" alt="${sponsor.alt}">` : `<span class="imho-logo" aria-hidden="true">IMHO<br>CONSULTING</span>`}</a><div class="sponsor-details"><h2>${sponsor[locale]}</h2><span class="sponsor-url" aria-hidden="true">${sponsor.href}</span></div></section>`).join("")}</div></article>`
  };
}
