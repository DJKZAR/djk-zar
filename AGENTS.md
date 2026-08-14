# Agent instructions

This repository is designed for agent-first development. Keep changes small, reviewable, and verified.

## Plan workflow

For implementation work from `plan/`, read and follow `.agents/skills/djk-zar-plan-task/SKILL.md`.

- Work on exactly one plan task at a time.
- Inspect the current git status first and preserve unrelated work.
- Claim the task before implementation and complete every acceptance criterion before marking it complete.
- Create new tasks from `plan/TEMPLATE.md`. Keep completed task files as concise decision and verification records.
- Update the project skill only with generally reusable workflow improvements.

Small, explicitly requested copy or style adjustments do not require a plan. New pages, routes, integrations, shared behavior, and multi-file features do.

## SEO is a release requirement

SEO is critical. Never treat metadata, crawlability, or URL behavior as optional follow-up.

Every new or changed indexable page must have:

- one descriptive `<h1>` and semantic heading order
- a unique title and meta description
- an absolute canonical URL matching its public route
- correct Dutch and English `hreflang` counterparts where applicable
- accurate Open Graph, Twitter, and JSON-LD output through the shared layout
- useful internal links and descriptive link text
- crawlable primary content without requiring JavaScript
- optimized local images with meaningful `alt` text, dimensions, and appropriate lazy loading
- an entry in `sitemap.xml` (generated automatically from page modules with a canonical URL)
- a direct permanent redirect when replacing or renaming a public URL

Update structural checks whenever routes or SEO behavior change. Verify the generated sitemap, canonical, alternates, metadata, structured data, redirects, robots behavior, and real 404 response before completion. Never redirect unknown URLs to the homepage.

## Public repository safety

- Never commit credentials, cookies, access tokens, private keys, deployment values, or populated environment files.
- Keep deployment credentials only in the gitignored `.env.deploy`; examples must contain placeholders only.
- Do not commit QA reports, generated `dist/`, or migration baselines.
- Run `npm run check` before finishing. It includes a tracked-file secret scan.
- If a secret is exposed, stop, revoke or rotate it, and remove it from Git history before publishing.

## Site invariants

- Keep Dutch and English counterpart pages structurally and factually aligned.
- Use local assets and existing shared patterns before adding code or dependencies.
- Always bump the shared layout's cache-busting query version when changing referenced CSS or JavaScript, and update its structural check.
- Preserve accessibility basics, keyboard behavior, reduced-motion support, and progressive enhancement.
- Add the smallest durable automated check for non-trivial behavior.
