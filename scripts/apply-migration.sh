#!/usr/bin/env bash
# Застосовує SQL-файл до D1 neuronix-leads через REST (binding недоступний — сайт на Vercel).
set -euo pipefail
FILE="${1:?вкажи шлях до .sql}"
VAULT_KEY="$(sed -n 's/^VAULT_API_KEY=//p' /etc/default/vault-cache)"
TOKEN="$(curl -s -H "X-API-Key: $VAULT_KEY" \
  http://127.0.0.1:8400/api/secrets/abertime/cloudflare_api_token \
  | python3 -c 'import json,sys;print(json.load(sys.stdin)["value"])')"
ACC=2c4c514716008ce7795e40ac9e0cd04c
DB=75d3b6c1-0559-4d80-a0cf-38ad0e25065a
python3 - "$FILE" <<'PY' | while read -r stmt; do
import sys
sql = open(sys.argv[1], encoding='utf-8').read()
# D1 REST виконує один стейтмент за виклик — ріжемо по ";" і чистимо переноси.
for s in filter(None, (x.strip() for x in sql.split(';'))):
    print(' '.join(s.split()))
PY
  echo "→ ${stmt:0:60}..."
  curl -s -X POST "https://api.cloudflare.com/client/v4/accounts/$ACC/d1/database/$DB/query" \
    -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
    -d "$(python3 -c 'import json,sys;print(json.dumps({"sql":sys.argv[1]}))' "$stmt")" \
    | python3 -c 'import json,sys;d=json.load(sys.stdin);print("  ok" if d.get("success") else "  ПОМИЛКА: "+json.dumps(d.get("errors"),ensure_ascii=False))'
done
