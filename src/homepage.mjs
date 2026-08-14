import { renderSectionHeading, renderTopHero } from "./layout.mjs";

const teams = [
  ["Dames", "3E KLASSE B", "Women’s team", "3RD CLASS B", "/assets/images/womens-team.webp"],
  ["Heren 1", "BOND 3E KLASSE", "Men’s 1", "NATIONAL 3RD CLASS", "/assets/images/mens-team-1.webp"],
  ["Heren 2", "RESERVE 1E KLASSE A", "Men’s 2", "RESERVE 1ST CLASS A", "/assets/images/mens-team-2.jpeg"],
  ["Heren 3", "2E KLASSE B", "Men’s 3", "2ND CLASS B", "/assets/images/mens-team-3.jpg"],
  ["Heren 4", "3E KLASSE B", "Men’s 4", "3RD CLASS B", "/assets/images/mens-team-4.jpeg"],
  ["Heren 5", "4E KLASSE B", "Men’s 5", "4TH CLASS B", "/assets/images/mens-team-5.jpeg"],
  ["Trainingsteam", "DJK-ZAR", "Training team", "DJK-ZAR", "/assets/images/water-polo-tournament.jpg"]
];

const copy = {
  nl: {
    route: "/", lang: "nl-NL", title: "Waterpolo Amsterdam West - DJK-ZAR",
    description: "DJK-ZAR Waterpolo Amsterdam is een waterpoloclub in Amsterdam West met een rijke historie. Onze club draait naast het waterpolo ook veel om de gezelligheid.",
    hero: ["Spelers gezocht!", "Kom jij spelen bij de leukste club van Amsterdam?", "Doe mee aan een waterpolotraining"],
    intro: ["ONZE CLUB", "Waterpolo Amsterdam", "DJK-ZAR is een Amsterdamse waterpoloclub met een rijke historie. Zo werd voorloper D.J.K. <a href='/geschiedenis/'>zevenmaal op rij landskampioen</a> en speelden we vroeger in het Heiligewegbad, nu beter bekend als de Kalvertoren. Sinds 2018 richt onze club zich volledig op waterpolo. We hebben vijf herenteams verspreid over vier niveaus en één damesteam. Naast de sport draait onze club ook om gezelligheid."],
    features: [
      ["Teamuitjes", "Naast de gezellige clubuitjes organiseren veel teams ook verschillende (internationale) uitjes.", "/assets/images/womens-team-amsterdam.avif"],
      ["Wedstrijden", "Waterpolo Amsterdam, train doordeweek en speel in het weekend in het Mercatorbad in Amsterdam West.", "/assets/images/womens-team-and-mario.avif"],
      ["Onze leden", "DJK-ZAR kent veel leden tussen de 25 en 45 jaar, waaronder veel oud-studenten.", "/assets/images/water-polo-champions.avif"]
    ],
    testimonials: [
      ["Ik speel nu sinds 1 jaar bij DJK (hiervoor heb ik altijd bij het Y gespeeld) en het is een superleuk en jong team!", "Maud", "Dames 1"],
      ["Ik speel al sinds 1999 bij DJK en heb veel vrienden gemaakt binnen de club. Ik kijk altijd weer uit naar ons jaarlijkse teamuitje!", "Wessel", "Heren 4"],
      ["In 2014 besloot ik na jarenlang basketbal te hebben gespeeld eens mee te doen met een waterpolotraining. Sindsdien speel ik met veel plezier bij DJK!", "Jelmer", "Heren 5"],
      ["Naast de trainingen en wedstrijden staat DJK-ZAR Amsterdam bekend om zijn gezelligheid. Heb het hier erg naar mijn zin met alle (internationale) tripjes, pubquizzen en andere events!", "Tim", "Heren 3"]
    ],
    teamsTitle: "Onze<br>Teams", teamsText: "DJK-ZAR heeft zowel heren als dames waterpoloteams op meerdere niveaus. Naast de sport draait het binnen veel teams ook om de gezelligheid, en worden er vanuit de teams vaak activiteiten en uitjes georganiseerd.", join: "Speel met ons mee",
    descriptions: [
      "Samen met onze enthousiaste trainer/coach Nils gaan we elke training vol gas. We trainen hard, lachen harder, en hebben één doel: meer wedstrijden winnen. Een hecht team van vrouwen die net zo serieus zijn over waterpolo als over de borrel erna.",
      "Een internationaal team van oude en nieuwe vrienden, met spelers uit de top van het waterpolo. Dit team weet wat waterpolo is en laat dat elke wedstrijd zien.",
      "Een heerlijke mix van jonge veteranen en frisse adonissen. Heren 2 speelt voor de lol, maar vergis je niet: op het veld zijn ze niet te stoppen. En na de training? Dan staan de fietsen klaar.",
      "Van Australië tot Hongarije, van Italië tot de Jordaan. Een bonte mix van nationaliteiten, stijlen en accenten, maar op het veld spreekt iedereen dezelfde taal: goed waterpolo met een grote glimlach.",
      "Heren 4 is hét promotieteam van de club. Een gedreven groep spelers met een mix van trouwe DJK-veteranen en nieuwere gezichten.",
      "Heren 5 is het bewijs dat waterpolo op elk niveau geweldig is. Een vrolijke mix van doorgewinterde spelers en enthousiaste nieuwkomers. Zoek jij een team waar je meteen thuisvoelt? Kom ons versterken, we hebben jou nodig!",
      "Nog nooit waterpolo gespeeld, of net terug na een lange pauze?<br><br>Het trainingsteam is jouw startpunt. Een mix van dames en heren die het spelletje leren kennen in een veilige, ontspannen omgeving.<br><br>Ervaren trainers uit de hogere teams begeleiden je stap voor stap richting je eerste wedstrijd."
    ],
    beginnerLink: ["/waterpolo/", "Beginnen met waterpolo"],
    instagram: ["VOLG ONS OP INSTAGRAM", "INSTAGRAM", "MEER LADEN...", "Volg op Instagram"]
  },
  en: {
    route: "/en/water-polo-amsterdam/", lang: "en-GB", title: "Water polo club in Amsterdam West | DJK-ZAR",
    description: "Play water polo in Amsterdam West with DJK-ZAR. We have five men’s teams, one women’s team and training sessions for beginners.",
    hero: ["New players wanted!", "Join DJK-ZAR", "Join a water polo training session"],
    intro: ["OUR CLUB", "Water Polo Amsterdam", "DJK-ZAR is a water polo club in Amsterdam West with a rich history, including <a href='/en/history/'>seven consecutive Dutch national championships</a> won by predecessor D.J.K. We play at multiple levels with five men’s teams and one women’s team. Our home pool is one of the newest swimming pools in Amsterdam. It is well-equipped and easily accessible by bike, car, metro & tram.<br><br>We are always looking for new members to make our teams stronger! If you are interested in coaching or any other way to help our organization out you are more than welcome!"],
    features: [
      ["Team outings", "Weekend away with your team. And at least 5 club events through the year!", "/assets/images/womens-team-amsterdam.avif"],
      ["Competitions", "Water polo Amsterdam, train during the week & play at the weekends", "/assets/images/womens-team-and-mario.avif"],
      ["Our members", "25 – 45 years, university background, working and living in Amsterdam", "/assets/images/water-polo-champions.avif"]
    ],
    testimonials: [
      ["DJK has always been my place to meet my friends and do fun stuff with them. But of course playing the game is also important...", "Wessel", "MEN’S 4 PLAYER"],
      ["Wanted to try a new sport after playing basketball all my life. Found an amazing team and made a lot of new friends!", "Jelmer", "MEN’S 5 PLAYER"],
      ["Playing with the girls and having a fun time after the match with them is the perfect way to relax after a hard weeks work. If you need our nice DJK swimwear contact me!", "Milou", "WOMEN’S 1 PLAYER"],
      ["DJK-ZAR is the best! We have a great group of international players. Next to playing water polo in Amsterdam we have pub quizzes, international trips, beerpong tournaments and more!", "Tim", "MEN’S 3 PLAYER"]
    ],
    teamsTitle: "Our<br>Teams", teamsText: "DJK-ZAR is a water polo club in Amsterdam West with five men’s teams and one women’s team playing at multiple levels.", join: "Join us!",
    descriptions: [
      "Every Tuesday, the women’s team trains hard under the guidance of coach Nils, with one shared goal: winning more matches. A close-knit group of players who take their water polo seriously, and their post-training socials even more so.",
      "An international team of old and new friends, with players from the top of the sport. This team knows what water polo is all about, and proves it every single match.",
      "A brilliant mix of young veterans and fresh faces. Men’s 2 plays for the love of the game &mdash; but don’t be fooled, they’re fierce in the water. Off the pitch, they’re equally passionate about cycling.",
      "From Australia to Hungary, Italy to the Jordaan. Men’s 3 might just be Amsterdam’s most international water polo team. A colourful mix of nationalities, playing styles and accents, but in the water they speak one language: great polo and even better team spirit.",
      "Men’s 4 is the club’s promotion team, and they mean business. A driven mix of loyal DJK veterans and newer players, united by one goal: going up. The hunger is there, the squad is ready.",
      "Men’s 5 is living proof that water polo is great at every level. A lively blend of experienced players and enthusiastic newcomers. Looking for a team where you’ll feel at home straight away? Come join us, we’d love to have you.",
      "Never played water polo before, or just getting back into it after a break?<br><br>The Training Team is your starting point. A mixed group of men and women learning the ropes in a relaxed, supportive environment.<br><br>Experienced coaches from the higher teams guide you step by step toward your first competitive match."
    ],
    beginnerLink: ["/en/waterpolo-rules/", "Start playing water polo"],
    instagram: ["FOLLOW US ON INSTAGRAM", "INSTAGRAM", "LOAD MORE…", "Follow on Instagram"]
  }
};

const styles = `<style>
.home-intro,.home-teams-intro{display:grid;grid-template-columns:1fr 1.5fr;align-items:center;gap:80px;max-width:1000px;margin:auto;padding:110px 30px}.home-intro-copy{font-size:1.1em}.home-features{display:grid;grid-template-columns:repeat(3,1fr);max-width:1100px;margin:auto;padding:20px 25px 100px}.home-feature{display:contents;text-align:center}.home-feature img{width:100%;aspect-ratio:1;object-fit:cover}.home-feature div{display:grid;place-content:center;padding:25px}.home-feature h2{font-size:25px}.home-feature:nth-child(1) img{grid-area:1/1}.home-feature:nth-child(1) div{grid-area:1/2}.home-feature:nth-child(2) img{grid-area:1/3}.home-feature:nth-child(2) div{grid-area:2/1}.home-feature:nth-child(3) img{grid-area:2/2}.home-feature:nth-child(3) div{grid-area:2/3}.home-testimonials{display:grid;grid-template-columns:repeat(4,1fr);gap:35px;max-width:1100px;margin:auto;padding:65px 25px 120px}.home-quote{margin:0;font-size:14px;font-style:italic}.home-quote::before{content:'“';display:block;color:#bbb;font:60px Roboto;line-height:.7}.home-quote strong,.home-quote small{display:block;margin-top:12px}.home-quote small,.home-team .eyebrow{font-size:10px;letter-spacing:.15em;text-transform:uppercase}.home-teams-intro{padding-bottom:80px}.home-teams-intro .button{justify-self:start;text-transform:none}.home-team{display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:90px;min-height:500px;padding:70px max(30px,calc((100% - 1100px)/2))}.home-team:nth-child(even){background:#f7f7f7}.home-team:nth-child(odd) img{order:-1}.home-team img{width:100%;height:330px;object-fit:cover}.home-team h3{font-size:36px}.home-instagram{display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:70px;max-width:850px;margin:auto;padding:110px 30px}.instagram-logo{display:grid;place-items:center}.instagram-logo img{width:min(220px,55vw)}
@media(min-width:601px) and (max-width:1024px){.home-testimonials{grid-template-columns:repeat(2,1fr)}}
@media(max-width:600px){.home-intro,.home-teams-intro{grid-template-columns:1fr;gap:35px;padding:65px 20px}.home-intro-copy{grid-template-columns:1fr;gap:20px}.home-features{display:block;padding:0 20px 50px}.home-feature{display:block}.home-feature img{height:auto;aspect-ratio:1}.home-testimonials{grid-template-columns:1fr;padding:45px 25px 70px}.home-team,.home-team:nth-child(n){grid-template-columns:1fr;gap:25px;min-height:0;padding:55px 20px}.home-team:nth-child(n) img{order:initial;height:auto}.home-team h3{font-size:30px}.home-instagram{grid-template-columns:1fr;gap:30px;padding:65px 20px}}
</style>`;

function render(c) {
  return `    ${renderTopHero({ image: "/assets/images/water-polo-hero.avif", title: c.hero[0], text: c.hero[1], href: c.lang === "nl-NL" ? "/speel-met-ons-mee/" : "/en/join-us/", label: c.hero[2], heading: false })}
    <section class="home-intro">${renderSectionHeading({ kicker: c.intro[0], title: c.intro[1], level: 1 })}<div class="home-intro-copy"><p>${c.intro[2]}</p></div></section>
    <section class="home-features">${c.features.map(([title, text, image]) => `<article class="home-feature"><img src="${image}" alt="" loading="lazy" fetchpriority="low"><div><h2>${title}</h2><p>${text}</p></div></article>`).join("")}</section>
    <section class="home-testimonials" aria-label="${c.lang === "nl-NL" ? "Ervaringen van leden" : "Member experiences"}">${c.testimonials.map(([text, name, role]) => `<blockquote class="home-quote"><p>${text}</p><strong>${name}</strong><small>${role}</small></blockquote>`).join("")}</section>
    <section class="home-teams-intro">${renderSectionHeading({ kicker: "TEAMS", title: c.teamsTitle })}<div><p>${c.teamsText}</p><a class="button button-primary" href="${c.lang === "nl-NL" ? "/speel-met-ons-mee/" : "/en/join-us/"}">${c.join}</a></div></section>
    <div class="home-team-list">${teams.map(([name, level, enName, enLevel, image], index) => { const english = c.lang === "en-GB"; return `<article class="home-team"><div><p class="eyebrow">${english ? enLevel : level}</p><h3>${english ? enName : name}</h3><p>${c.descriptions[index]}</p>${index === teams.length - 1 ? `<a class="button button-primary" href="${c.beginnerLink[0]}">${c.beginnerLink[1]}</a>` : ""}</div><img src="${image}" alt="${english ? enName : name}" loading="lazy" fetchpriority="low"></article>`; }).join("")}</div>
    <section class="home-instagram">${renderSectionHeading({ kicker: c.instagram[0], title: c.instagram[1] })}<a class="instagram-logo" href="https://www.instagram.com/djkzaramsterdam/" rel="nofollow noopener" aria-label="${c.instagram[3]}"><picture><source srcset="/assets/images/instagram-water-polo.avif" type="image/avif"><img src="/assets/images/instagram-water-polo.png" width="440" height="440" alt="" loading="lazy" fetchpriority="low"></picture></a></section>`;
}

export function homepage(locale) {
  const c = copy[locale];
  const en = locale === "en";
  return {
    route: c.route,
    lang: c.lang,
    title: c.title,
    description: c.description,
    canonical: `https://www.djk-zar.nl${c.route}`,
    alternates: [
      { lang: "nl", href: "https://www.djk-zar.nl/" },
      { lang: "en", href: "https://www.djk-zar.nl/en/water-polo-amsterdam/" }
    ],
    head: `${styles}  <link rel="preload" as="image" href="/assets/images/water-polo-hero.avif" fetchpriority="high">\n`,
    main: render(c)
  };
}
