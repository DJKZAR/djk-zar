import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";

function deploy(t, { tournament = false, failUpload = false } = {}) {
  const root = mkdtempSync(join(tmpdir(), "djk-deploy-test-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const script = join(root, ".agents/skills/deploy-ftp/scripts/deploy.sh");
  mkdirSync(dirname(script), { recursive: true });
  copyFileSync(new URL("../.agents/skills/deploy-ftp/scripts/deploy.sh", import.meta.url), script);
  mkdirSync(join(root, "bin"));
  mkdirSync(join(root, "dist"));
  writeFileSync(join(root, "dist/index.html"), "test page");
  writeFileSync(join(root, ".env.deploy"), [
    "DEPLOY_FTP_URL=ftp://example.invalid/",
    "DEPLOY_FTP_USER=placeholder",
    "DEPLOY_FTP_PASSWORD=placeholder",
    "DEPLOY_PUBLIC_URL=https://example.invalid"
  ].join("\n"));
  if (tournament) {
    mkdirSync(join(root, "tournament"));
    writeFileSync(join(root, "tournament/index.html"), "test tournament");
  }
  writeFileSync(join(root, "bin/npm"), '#!/usr/bin/env bash\nprintf "npm %s\\n" "$*" >> "$TEST_LOG"\n', { mode: 0o700 });
  writeFileSync(join(root, "bin/curl"), `#!/usr/bin/env bash
printf 'curl %s\\n' "$*" >> "$TEST_LOG"
if [[ "$*" == *--upload-file* ]]; then
  [[ "$*" == *--ssl-reqd* ]] || exit 98
  [[ "$TEST_FAIL_UPLOAD" != 1 ]] || exit 22
fi
`, { mode: 0o700 });
  const log = join(root, "commands.log");
  const result = spawnSync("bash", [script], {
    encoding: "utf8",
    env: { ...process.env, PATH: `${join(root, "bin")}:${process.env.PATH}`, TEST_LOG: log, TEST_FAIL_UPLOAD: failUpload ? "1" : "0" }
  });
  return { ...result, commands: readFileSync(log, "utf8") };
}

test("missing tournament skips only tournament upload and still verifies the site", t => {
  const result = deploy(t);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /skipping tournament upload/);
  assert.match(result.stdout, /Deployment verified/);
  assert.match(result.commands, /^npm run check\n/);
  assert.match(result.commands, /--upload-file dist\/index.html/);
  assert.doesNotMatch(result.commands, /--upload-file tournament\//);
  for (const path of ["/", "/styles.css", "/navigation.js"]) {
    assert.ok(result.commands.includes(`https://example.invalid${path}\n`));
  }
});

test("present tournament files are uploaded", t => {
  const result = deploy(t, { tournament: true });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.commands, /--upload-file tournament\/index.html ftp:\/\/example.invalid\/tournament\/index.html/);
  assert.match(result.stdout, /1 site files and 1 tournament files/);
});

test("upload failures remain fatal and do not claim verification", t => {
  const result = deploy(t, { failUpload: true });
  assert.equal(result.status, 22);
  assert.doesNotMatch(result.stdout, /Deployment verified/);
  assert.doesNotMatch(result.commands, /https:\/\/example.invalid/);
});
