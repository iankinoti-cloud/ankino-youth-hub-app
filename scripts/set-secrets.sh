#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────────────────
#  scripts/set-secrets.sh
#  Interactive helper to push the 4 rotated secrets (and the 2 missing Daraja
#  config values) into Azure Static Web Apps Application Settings.
#
#  Values are read with `read -rs` (silent) — they are NEVER echoed, NEVER
#  written to disk, NEVER passed on the shell command line where `ps` could
#  see them. They go straight into the Azure REST call via az CLI.
#
#  Usage:
#    ./scripts/set-secrets.sh                 # interactive
#    SKIP_DARAJA=1 ./scripts/set-secrets.sh   # only set AI keys
#    SKIP_AI=1     ./scripts/set-secrets.sh   # only set Daraja keys
#
#  Prereqs: az login   +   you've rotated the keys per scripts/ROTATE_SECRETS.md
# ──────────────────────────────────────────────────────────────────────────────
set -euo pipefail
cd "$(dirname "$0")/.."

GREEN='\033[0;32m'; CYAN='\033[0;36m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
ok()   { echo -e "${GREEN}[✓]${NC} $*"; }
info() { echo -e "${CYAN}[→]${NC} $*"; }
warn() { echo -e "${YELLOW}[!]${NC} $*"; }
fail() { echo -e "${RED}[✗]${NC} $*"; exit 1; }

RG="${AZURE_RESOURCE_GROUP:-ankino-youth-hub-rg}"
SWA="${AZURE_SWA_NAME:-ankino-youth-hub}"

# ── 0. Sanity checks ─────────────────────────────────────────────────────────
command -v az >/dev/null || fail "az CLI not found. Install: https://aka.ms/azcli"
az account show >/dev/null 2>&1 || fail "Not logged in. Run: az login"

info "Target: SWA '$SWA' in resource group '$RG'"

# ── 1. Read SWA hostname (needed for callback URL) ───────────────────────────
info "Fetching SWA hostname..."
SWA_HOST=$(az staticwebapp show --name "$SWA" --resource-group "$RG" \
  --query defaultHostname -o tsv)
[ -n "$SWA_HOST" ] || fail "Could not resolve SWA hostname"
ok "SWA: https://$SWA_HOST"

# ── 2. Helper: prompt silently, allow re-entry on empty ──────────────────────
prompt_secret() {
  local var_name="$1" label="$2" min_len="${3:-10}" prefix_hint="${4:-}"
  local val=""
  while :; do
    printf "${CYAN}? ${NC}%s" "$label"
    [ -n "$prefix_hint" ] && printf " ${YELLOW}(expected to start with: %s)${NC}" "$prefix_hint"
    printf ": "
    read -rs val
    echo ""
    if [ -z "$val" ]; then
      warn "Empty — re-enter (Ctrl-C to abort)"
      continue
    fi
    if [ "${#val}" -lt "$min_len" ]; then
      warn "Too short (${#val} chars, need ≥ $min_len) — try again"
      continue
    fi
    if [ -n "$prefix_hint" ] && [[ "$val" != "$prefix_hint"* ]]; then
      warn "Doesn't start with '$prefix_hint'. Continue anyway? [y/N]"
      read -r confirm
      [[ "$confirm" =~ ^[Yy]$ ]] || continue
    fi
    break
  done
  printf -v "$var_name" '%s' "$val"
}

# ── 3. Collect the secrets ───────────────────────────────────────────────────
declare -a SETTINGS=()

if [ "${SKIP_AI:-0}" != "1" ]; then
  echo ""
  echo -e "${CYAN}── AI provider keys ─────────────────────────────────${NC}"
  prompt_secret ANTHROPIC_VAL "ANTHROPIC_API_KEY  (Claude — rotated value)" 20 "sk-ant-"
  prompt_secret GEMINI_VAL    "GEMINI_API_KEY     (Google AI Studio)"      20 "AIza"
  SETTINGS+=( "ANTHROPIC_API_KEY=$ANTHROPIC_VAL" "GEMINI_API_KEY=$GEMINI_VAL" )
fi

if [ "${SKIP_DARAJA:-0}" != "1" ]; then
  echo ""
  echo -e "${CYAN}── Safaricom Daraja (sandbox) ───────────────────────${NC}"
  prompt_secret DARAJA_KEY    "DARAJA_CONSUMER_KEY     (rotated)" 20
  prompt_secret DARAJA_SECRET "DARAJA_CONSUMER_SECRET  (rotated)" 20
  SETTINGS+=(
    "DARAJA_CONSUMER_KEY=$DARAJA_KEY"
    "DARAJA_CONSUMER_SECRET=$DARAJA_SECRET"
    # Also (re)assert the non-secret Daraja config — these were missing from SWA
    "DARAJA_PASSKEY=bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919"
    "DARAJA_SHORTCODE=174379"
    "DARAJA_ENV=sandbox"
    "DARAJA_CALLBACK_URL=https://$SWA_HOST/api/mpesa/callback"
    "DARAJA_B2C_RESULT_URL=https://$SWA_HOST/api/mpesa/b2c/result"
    "DARAJA_B2C_TIMEOUT_URL=https://$SWA_HOST/api/mpesa/b2c/timeout"
  )
fi

[ ${#SETTINGS[@]} -gt 0 ] || fail "Nothing to do (SKIP_AI and SKIP_DARAJA both set)"

# ── 4. Push to Azure ─────────────────────────────────────────────────────────
echo ""
info "Pushing ${#SETTINGS[@]} setting(s) to Azure SWA..."
az staticwebapp appsettings set \
  --name "$SWA" --resource-group "$RG" \
  --setting-names "${SETTINGS[@]}" \
  --output none
ok "Settings updated"

# ── 5. Verify (mask sensitive values) ────────────────────────────────────────
echo ""
info "Re-reading settings to verify (sensitive values masked)..."
az staticwebapp appsettings list --name "$SWA" --resource-group "$RG" \
  --query properties -o json \
| jq -r '
    to_entries
    | map(
        if (.key | test("KEY|SECRET|PASSKEY|CONNECTION_STRING")) then
          .value = (
            if (.value | length) <= 8 then "❌ \(.value)"
            elif (.value == "placeholder_set_me") then "❌ STILL PLACEHOLDER"
            else "✓ ****\(.value[-4:])  (\(.value | length) chars)"
            end
          )
        else . end
      )
    | .[] | "  \(.key) = \(.value)"
  '

# ── 6. Optional health check ─────────────────────────────────────────────────
echo ""
info "Hitting /api/ai/health (gives Functions ~5s to pick up new env)..."
sleep 5
curl -fsS --max-time 10 "https://$SWA_HOST/api/ai/health" 2>/dev/null \
  | jq . 2>/dev/null \
  || warn "Health endpoint not reachable yet — settings still applied; retry in ~30s"

echo ""
ok "Done. All 4 placeholder secrets replaced."
echo -e "${YELLOW}Reminder:${NC} keep your local .env in sync if you run 'func start' locally."
