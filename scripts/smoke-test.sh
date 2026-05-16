#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════
#  ANKINO YOUTH HUB — Post-deploy smoke test
#
#  Usage:
#    ./scripts/smoke-test.sh                          # uses AZURE_SWA_URL from .env
#    ./scripts/smoke-test.sh https://abc.azurestaticapps.net
#    PHONE=254712345678 AMOUNT=1 ./scripts/smoke-test.sh  # also test STK push
#
#  Tests:
#    1. /                  → 200 (frontend loads)
#    2. /api/ai/health     → 200 + JSON with provider flags
#    3. /api/ai/chat       → 200 + Claude reply  (sends a tiny prompt)
#    4. /api/mpesa/stk-push → 200  (only if PHONE + AMOUNT set)
# ═══════════════════════════════════════════════════════════════════════════
set -euo pipefail

GREEN='\033[0;32m'; RED='\033[0;31m'; CYAN='\033[0;36m'; YELLOW='\033[1;33m'; NC='\033[0m'
ok()   { echo -e "${GREEN}[✓]${NC} $*"; }
fail() { echo -e "${RED}[✗]${NC} $*"; FAILED=1; }
info() { echo -e "${CYAN}[→]${NC} $*"; }
warn() { echo -e "${YELLOW}[!]${NC} $*"; }

FAILED=0

# ── Resolve URL ─────────────────────────────────────────────────────────────
URL="${1:-}"
if [ -z "$URL" ] && [ -f ".env" ]; then
  URL=$(grep -E "^AZURE_SWA_URL=" .env | cut -d'=' -f2- || true)
fi
[ -z "$URL" ] && { echo "Usage: $0 <https://your-swa.azurestaticapps.net>"; exit 2; }
URL="${URL%/}"   # trim trailing slash

info "Target: $URL"
echo ""

# ── 1. Frontend ─────────────────────────────────────────────────────────────
info "Test 1/4 — Frontend root"
STATUS=$(curl -sS -o /dev/null -w "%{http_code}" "$URL/")
[ "$STATUS" = "200" ] && ok "Frontend returned 200" || fail "Frontend returned $STATUS"

# ── 2. AI health ────────────────────────────────────────────────────────────
info "Test 2/4 — /api/ai/health"
HEALTH=$(curl -sS "$URL/api/ai/health" || echo '{}')
if echo "$HEALTH" | grep -q '"status":"ok"'; then
  ok "AI health responded ok"
  echo "       $HEALTH"
else
  fail "AI health did not return ok — response: $HEALTH"
fi

# ── 3. AI chat (Claude) ─────────────────────────────────────────────────────
info "Test 3/4 — /api/ai/chat (Claude, tiny prompt)"
CHAT=$(curl -sS -X POST "$URL/api/ai/chat" \
  -H "Content-Type: application/json" \
  -d '{"provider":"claude","messages":[{"role":"user","content":"Reply with the single word: poa"}]}' || echo '{}')
if echo "$CHAT" | grep -qi '"content"'; then
  REPLY=$(echo "$CHAT" | sed -n 's/.*"content":"\([^"]*\)".*/\1/p' | head -c 80)
  ok "Claude replied: \"$REPLY\""
else
  fail "Claude did not reply — response: $(echo "$CHAT" | head -c 200)"
fi

# ── 4. STK push (optional) ──────────────────────────────────────────────────
if [ -n "${PHONE:-}" ] && [ -n "${AMOUNT:-}" ]; then
  info "Test 4/4 — /api/mpesa/stk-push (PHONE=$PHONE, AMOUNT=$AMOUNT)"
  warn "Your phone will receive an M-PESA prompt — DO NOT enter PIN unless this is intentional"
  STK=$(curl -sS -X POST "$URL/api/mpesa/stk-push" \
    -H "Content-Type: application/json" \
    -d "{\"phone\":\"$PHONE\",\"amount\":$AMOUNT,\"accountReference\":\"SmokeTest\",\"description\":\"SmokeTest\"}" || echo '{}')
  if echo "$STK" | grep -q '"ok":true'; then
    ok "STK push accepted by Daraja"
    echo "       $STK"
  else
    fail "STK push failed — response: $STK"
  fi
else
  warn "Test 4/4 — STK push SKIPPED (set PHONE=254XXXXXXXXX AMOUNT=1 to test)"
fi

echo ""
if [ "$FAILED" = "0" ]; then
  echo -e "${GREEN}╔══════════════════════════════════════════════╗${NC}"
  echo -e "${GREEN}║  ✅  All smoke tests passed                  ║${NC}"
  echo -e "${GREEN}╚══════════════════════════════════════════════╝${NC}"
  exit 0
else
  echo -e "${RED}╔══════════════════════════════════════════════╗${NC}"
  echo -e "${RED}║  ❌  Smoke tests failed — check logs above   ║${NC}"
  echo -e "${RED}╚══════════════════════════════════════════════╝${NC}"
  exit 1
fi
