---
name: djk-zar-plan-task
description: Executes exactly one DJK-ZAR feature task from plan/, including implementation, automated checks, and SEO verification.
compatibility: Requires Node.js 22+.
---

# DJK-ZAR plan task

Complete one task fully. Never begin the next task in the same invocation.

## 1. Select and claim one task

1. Read `AGENTS.md`, `plan/README.md`, and the selected task completely.
2. If no task was named, select the first ready task by filename order.
3. Read dependency tasks and the files involved in the real code path.
4. Inspect git status and preserve unrelated work.
5. Change the task status to `in progress` and record the agent or session. Stop if another agent owns it unless takeover is authorized.
6. Stay within the selected task's scope.

## 2. Understand before editing

- Inspect existing shared helpers, patterns, callers, routes, and checks before adding code.
- Use current production as evidence, not as a reason to copy legacy markup or defects.

## 3. Implement minimally

- Prefer semantic static HTML, shared CSS, and minimal progressive-enhancement JavaScript.
- Reuse local assets and existing patterns. Do not add dependencies without a demonstrated need.
- Keep Dutch and English counterparts structurally and factually aligned.
- Preserve accessibility, keyboard use, visible focus, and reduced-motion behavior.
- Add the smallest durable automated check for non-trivial behavior.

### Pages and SEO

For every new or changed indexable page:

- provide one descriptive `<h1>`, unique title and description, canonical, and correct language alternates
- verify shared Open Graph, Twitter, and JSON-LD output
- use crawlable primary content, useful internal links, and meaningful image alt text
- confirm the canonical page is generated into `sitemap.xml`
- add a direct permanent redirect for renamed public URLs
- verify robots behavior and ensure unknown URLs still return a real 404

SEO failures block task completion.

## 4. Verify

1. Run `npm run check`.
2. Check headings, links, alt text, title, description, canonical, `hreflang`, social metadata, JSON-LD, sitemap membership, redirects, and HTTP status behavior affected by the task.
3. For substantial page work, validate generated HTML with the W3C Nu validator when network access permits.

## 5. Finish

- Record concise verification evidence in the task file.
- Mark the task `complete` only when all acceptance criteria pass. Otherwise mark it `blocked` and record the blocker.
- Add only reusable lessons to this skill.
- Summarize changed files and checks, then stop.
