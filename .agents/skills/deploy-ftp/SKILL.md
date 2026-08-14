---
name: deploy-ftp
description: Builds, checks, and uploads the DJK-ZAR static site to its configured FTP staging host. Use only when the user explicitly asks to deploy, publish, or upload the new static site.
compatibility: Requires Node.js 22+, npm, curl, and local .env.deploy credentials.
---

# Deploy DJK-ZAR via FTP

Deploy only after an explicit request in the current conversation. The destination is configured in the gitignored repository-root `.env.deploy` file. Never print, commit, or paste its values into chat or command output.

## First-time setup

If `.env.deploy` is missing, tell the user to configure it locally. Do not ask them to paste credentials into chat:

```bash
cp .env.deploy.example .env.deploy
chmod 600 .env.deploy
```

Required values:

- `DEPLOY_FTP_URL`: FTP URL including the remote document-root path and trailing slash
- `DEPLOY_FTP_USER`
- `DEPLOY_FTP_PASSWORD`
- `DEPLOY_PUBLIC_URL`: public HTTPS URL used after deployment

FTP is upgraded to TLS with curl's `--ssl-reqd`. Do not weaken this requirement.

## Deploy

From the repository root, run:

```bash
.agents/skills/deploy-ftp/scripts/deploy.sh
```

The script runs `npm run check`, uploads the freshly generated contents of `dist/` including `.htaccess`, and verifies the public homepage, stylesheet, and navigation script.

If checks, upload, or verification fail, stop and report the failing stage. Do not claim success and do not retry with weaker TLS or skipped checks. The uploader intentionally does not delete remote files.
