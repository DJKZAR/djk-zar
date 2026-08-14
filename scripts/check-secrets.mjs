import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";

const files = execFileSync("git", ["ls-files", "-z"]).toString().split("\0").filter(Boolean);
const patterns = [
  /-----BEGIN (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/,
  /\bAKIA[0-9A-Z]{16}\b/,
  /\bAIza[0-9A-Za-z_-]{30,}\b/,
  /\bgh[pousr]_[0-9A-Za-z]{20,}\b/,
  /\bgithub_pat_[0-9A-Za-z_]{20,}\b/,
  /(?:password|passwd|secret|token|api[_-]?key)\s*[:=]\s*["'][^"'\s]{8,}["']/i,
  /(?:ftp|sftp):\/\/[^\s/:]+:[^\s/@]+@/i
];
const excluded = [".env.deploy.example", "scripts/check-secrets.mjs"];

for (const file of files) {
  if (excluded.includes(file) || file.startsWith(".agents/skills/playwright-cli/")) continue;
  let content;
  try { content = await readFile(file, "utf8"); } catch { continue; }
  for (const pattern of patterns) assert.doesNotMatch(content, pattern, `${file}: possible credential detected`);
}

console.log(`Secret scan passed (${files.length} tracked files)`);
