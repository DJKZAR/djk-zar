# Development plans

Use this directory for substantial future work: new pages, routes, integrations, shared behavior, or multi-file features. Small copy and style fixes can be implemented directly.

## Workflow

1. Copy `TEMPLATE.md` to the next zero-padded number and a short slug, for example `002-news-page.md`.
2. Define scope, dependencies, SEO impact, acceptance criteria, and verification before implementation.
3. An agent claims exactly one ready task by setting its status to `in progress` and recording its identity.
4. Follow `.agents/skills/djk-zar-plan-task/SKILL.md`.
5. Mark the task complete only after every acceptance criterion and required check passes.

Completed plans remain as concise decision and verification records. Migration-only baselines and bulky QA artifacts are intentionally not retained.

## Rules

- Preserve unrelated work and do not claim a task owned by another agent.
- Keep tasks independently reviewable. Split work when acceptance criteria cannot be completed and verified together.
- SEO is mandatory for page and route work. Include titles, descriptions, canonical URLs, language alternates, sitemap membership, structured data, redirects, internal links, and robots behavior in scope.
- Never put credentials, cookies, tokens, private data, or captured production network logs in plans or QA evidence.
- Prefer reproducible commands and concise findings over committed screenshots or generated reports.
