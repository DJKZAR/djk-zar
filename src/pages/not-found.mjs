export default {
  route: "/404.html",
  lang: "nl-NL",
  title: "Pagina niet gevonden | DJK-ZAR",
  description: "De opgevraagde pagina bestaat niet. Zwem terug naar een werkende pagina van DJK-ZAR.",
  canonical: false,
  head: `  <meta name="robots" content="noindex, follow">
  <style>
    .not-found{display:grid;place-items:center;min-height:560px;padding:4rem 1.25rem;background:var(--soft)}
    .not-found-card{width:min(620px,100%);padding:clamp(2rem,5vw,3.25rem);border-radius:8px;color:#fff;background:var(--green-dark);box-shadow:var(--shadow);text-align:center}
    .not-found-code{margin-bottom:1rem;color:#80e4c4;font:700 .78rem/1.4 Poppins,sans-serif;letter-spacing:.18em;text-transform:uppercase}
    .not-found h1{margin-inline:auto;color:#fff;font-size:clamp(2.5rem,6vw,4rem)}
    .not-found-copy{max-width:530px;margin:0 auto 2rem;color:rgb(255 255 255/.88)}
    .not-found-actions{display:flex;flex-wrap:wrap;justify-content:center;gap:.75rem}
    .not-found .button-secondary{border:1px solid rgb(255 255 255/.65);color:#fff}
    .not-found .button:hover{text-decoration:none;transform:translateY(-2px)}
    @media(max-width:600px){.not-found{min-height:500px;padding:2.5rem 1rem}.not-found-card{padding:2.5rem 1.25rem}.not-found-actions{display:grid}.not-found .button{width:100%}}
  </style>
`,
  main: `    <section class="not-found">
      <div class="not-found-card">
        <p class="not-found-code">Fout 404 · Bal over de achterlijn</p>
        <h1>Pagina niet gevonden</h1>
        <p class="not-found-copy">Hier is niets te vinden. Geen zorgen, je hoeft niet lang op de kant te blijven.</p>
        <div class="not-found-actions">
          <a class="button button-primary" href="/">Terug naar de homepage</a>
          <a class="button button-secondary" href="/contact/">Neem contact op</a>
        </div>
      </div>
    </section>`
};
