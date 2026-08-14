#!/usr/bin/env bash
set -euo pipefail

root=$(cd "$(dirname "$0")/../../../.." && pwd)
cd "$root"

env_file="$root/.env.deploy"
if [[ ! -f "$env_file" ]]; then
  echo "Missing .env.deploy. Copy .env.deploy.example, fill it locally, and chmod 600 it." >&2
  exit 1
fi

set -a
# shellcheck disable=SC1090
source "$env_file"
set +a

for name in DEPLOY_FTP_URL DEPLOY_FTP_USER DEPLOY_FTP_PASSWORD DEPLOY_PUBLIC_URL; do
  [[ -n "${!name:-}" ]] || { echo "Missing $name in .env.deploy" >&2; exit 1; }
done
[[ "$DEPLOY_FTP_URL" == ftp://*/ ]] || { echo "DEPLOY_FTP_URL must start with ftp:// and end with /" >&2; exit 1; }
[[ "$DEPLOY_PUBLIC_URL" == https://* ]] || { echo "DEPLOY_PUBLIC_URL must start with https://" >&2; exit 1; }

npm run check

escape_config() { local value=${1//\\/\\\\}; printf '%s' "${value//\"/\\\"}"; }
auth=$(mktemp)
trap 'rm -f "$auth"' EXIT
chmod 600 "$auth"
printf 'user = "%s:%s"\n' "$(escape_config "$DEPLOY_FTP_USER")" "$(escape_config "$DEPLOY_FTP_PASSWORD")" > "$auth"

count=0
while IFS= read -r -d '' file; do
  relative=${file#dist/}
  [[ "$relative" =~ ^[A-Za-z0-9._/-]+$ ]] || { echo "Unsupported filename: $relative" >&2; exit 1; }
  curl --config "$auth" --fail --silent --show-error --ssl-reqd --ftp-create-dirs \
    --upload-file "$file" "${DEPLOY_FTP_URL}${relative}"
  ((count += 1))
done < <(find dist -type f -print0)

echo "Uploaded $count files. Verifying ${DEPLOY_PUBLIC_URL%/}/"
curl --fail --silent --show-error "${DEPLOY_PUBLIC_URL%/}/" >/dev/null
curl --fail --silent --show-error "${DEPLOY_PUBLIC_URL%/}/styles.css" >/dev/null
curl --fail --silent --show-error "${DEPLOY_PUBLIC_URL%/}/navigation.js" >/dev/null
echo "Deployment verified."
