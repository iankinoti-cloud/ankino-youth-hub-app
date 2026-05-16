#!/usr/bin/env bash
# Finishes Azure wiring: gets tokens, sets GitHub secrets, sets SWA app settings, commits + pushes
set -euo pipefail
cd "$(dirname "$0")/.."

GREEN='\033[0;32m'; CYAN='\033[0;36m'; YELLOW='\033[1;33m'; NC='\033[0m'
ok()   { echo -e "${GREEN}[✓]${NC} $*"; }
info() { echo -e "${CYAN}[→]${NC} $*"; }
warn() { echo -e "${YELLOW}[!]${NC} $*"; }

RG="ankino-youth-hub-rg"
SWA="ankino-youth-hub"
AI="ankino-youth-hub-insights"
REPO="iankinoti-cloud/ankino-youth-hub"

# ── 1. Fetch values ──────────────────────────────────────────────────────────
info "Fetching SWA URL..."
SWA_URL=$(az staticwebapp show --name "$SWA" --resource-group "$RG" \
  --query defaultHostname -o tsv 2>&1)
ok "SWA URL: https://$SWA_URL"

info "Fetching SWA deployment token..."
SWA_TOKEN=$(az staticwebapp secrets list --name "$SWA" --resource-group "$RG" \
  --query "properties.apiKey" -o tsv 2>&1)
ok "SWA token retrieved (${#SWA_TOKEN} chars)"

info "Fetching App Insights connection string..."
AI_CONN=$(az monitor app-insights component show --app "$AI" --resource-group "$RG" \
  --query connectionString -o tsv 2>&1)
ok "App Insights connection string retrieved"

SUB_ID=$(az account show --query id -o tsv 2>&1)

# ── 2. Set GitHub Secrets ────────────────────────────────────────────────────
info "Setting GitHub Secrets on $REPO ..."

printf '%s' "$SWA_TOKEN" | gh secret set AZURE_STATIC_WEB_APPS_API_TOKEN --repo "$REPO"
ok "AZURE_STATIC_WEB_APPS_API_TOKEN set"

printf '%s' "https://$SWA_URL" | gh secret set AZURE_SWA_URL --repo "$REPO"
ok "AZURE_SWA_URL set"

printf '%s' "$AI_CONN" | gh secret set AZURE_APPINSIGHTS_CONNECTION_STRING --repo "$REPO"
ok "AZURE_APPINSIGHTS_CONNECTION_STRING set"

printf '%s' "$SUB_ID" | gh secret set AZURE_SUBSCRIPTION_ID --repo "$REPO"
ok "AZURE_SUBSCRIPTION_ID set"

# ── 3. SWA App Settings (server-side env for Azure Functions) ────────────────
info "Configuring SWA Application Settings..."
# Defaults — secrets (ANTHROPIC_API_KEY, DARAJA_CONSUMER_KEY/SECRET) must be set
# separately AFTER you rotate them. See scripts/ROTATE_SECRETS.md
az staticwebapp appsettings set \
  --name "$SWA" --resource-group "$RG" \
  --setting-names \
    "DARAJA_ENV=sandbox" \
    "DARAJA_SHORTCODE=174379" \
    "DARAJA_PASSKEY=bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919" \
    "DARAJA_CALLBACK_URL=https://$SWA_URL/api/mpesa/callback" \
    "DARAJA_B2C_RESULT_URL=https://$SWA_URL/api/mpesa/b2c/result" \
    "DARAJA_B2C_TIMEOUT_URL=https://$SWA_URL/api/mpesa/b2c/timeout" \
    "APPINSIGHTS_CONNECTION_STRING=$AI_CONN" \
  --output none
ok "SWA app settings configured (still need: rotated ANTHROPIC_API_KEY, DARAJA_CONSUMER_KEY, DARAJA_CONSUMER_SECRET)"


# ── 4. Write .env with real values ───────────────────────────────────────────
info "Writing .env from .env.example + Azure values..."
[ -f .env ] || cp .env.example .env
sed -i "s|AZURE_SUBSCRIPTION_ID=.*|AZURE_SUBSCRIPTION_ID=$SUB_ID|" .env
sed -i "s|AZURE_RESOURCE_GROUP=.*|AZURE_RESOURCE_GROUP=$RG|" .env
sed -i "s|AZURE_SWA_NAME=.*|AZURE_SWA_NAME=$SWA|" .env
sed -i "s|AZURE_SWA_URL=.*|AZURE_SWA_URL=https://$SWA_URL|" .env
sed -i "s|AZURE_APPINSIGHTS_CONNECTION_STRING=.*|AZURE_APPINSIGHTS_CONNECTION_STRING=$AI_CONN|" .env
sed -i "s|VITE_APPINSIGHTS_CONNECTION_STRING=.*|VITE_APPINSIGHTS_CONNECTION_STRING=$AI_CONN|" .env
sed -i "s|DARAJA_CALLBACK_URL=.*|DARAJA_CALLBACK_URL=https://$SWA_URL/api/mpesa/callback|" .env
sed -i "s|DARAJA_B2C_RESULT_URL=.*|DARAJA_B2C_RESULT_URL=https://$SWA_URL/api/mpesa/b2c/result|" .env
sed -i "s|DARAJA_B2C_TIMEOUT_URL=.*|DARAJA_B2C_TIMEOUT_URL=https://$SWA_URL/api/mpesa/b2c/timeout|" .env
ok ".env populated with Azure values"

# ── 5. Ensure .gitignore is correct ─────────────────────────────────────────
info "Checking .gitignore..."
if [ -f .gitignore ]; then
  grep -q "^\.env$" .gitignore || echo ".env" >> .gitignore
  grep -q "coverage/" .gitignore    || echo "coverage/" >> .gitignore
  grep -q "dist/" .gitignore        || echo "dist/" >> .gitignore
else
  cat > .gitignore << 'GITIGNORE'
.env
node_modules/
dist/
coverage/
*.local
.DS_Store
GITIGNORE
fi
ok ".gitignore verified"

# ── 6. Git commit + push ─────────────────────────────────────────────────────
info "Staging all scaffold files..."
git add \
  api/ \
  scripts/ \
  staticwebapp.config.json \
  .github/workflows/deploy-azure.yml \
  .env.example \
  CLAUDE.md \
  .gitignore

git status --short

info "Committing Azure scaffold..."
git commit -m "feat: Azure scaffold — SWA + Functions + App Insights + CI/CD

- api/: Azure Functions v4 (mpesa-callback, ai-proxy)
- staticwebapp.config.json: SPA routing, CSP headers
- .github/workflows/deploy-azure.yml: lint→test→build→Azure SWA deploy
- scripts/azure-setup.sh: one-shot provisioning script
- .env.example: updated with Azure resource variables
- CLAUDE.md: full Azure runbook + architecture docs

Azure resources provisioned:
  Resource Group:   ankino-youth-hub-rg (southafricanorth)
  Static Web App:   ankino-youth-hub (Free tier, eastus2)
  App Insights:     ankino-youth-hub-insights
  Log Analytics:    ankino-youth-hub-insights-law

GitHub Secrets set: AZURE_STATIC_WEB_APPS_API_TOKEN, AZURE_SWA_URL,
  AZURE_APPINSIGHTS_CONNECTION_STRING, AZURE_SUBSCRIPTION_ID" 2>&1

info "Pushing to origin main..."
git push origin main 2>&1
ok "Pushed! GitHub Actions will now run deploy-azure.yml"

# ── 7. Summary ───────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   🚀  Ankino Youth Hub — Azure Setup COMPLETE            ║${NC}"
echo -e "${GREEN}╠══════════════════════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║  SWA URL:     ${CYAN}https://$SWA_URL${GREEN}"
echo -e "${GREEN}║  API Health:  ${CYAN}https://$SWA_URL/api/ai/health${GREEN}"
echo -e "${GREEN}║  App Insights:${CYAN} Azure Portal → ankino-youth-hub-insights${GREEN}"
echo -e "${GREEN}║  GitHub CI:   ${CYAN}https://github.com/$REPO/actions${GREEN}"
echo -e "${GREEN}╠══════════════════════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║  Remaining manual steps:                                 ║${NC}"
echo -e "${GREEN}║  1. Set ANTHROPIC_API_KEY in Azure Portal → SWA          ║${NC}"
echo -e "${GREEN}║     → Configuration → Application Settings               ║${NC}"
echo -e "${GREEN}║  2. Set GEMINI_API_KEY (same location)                   ║${NC}"
echo -e "${GREEN}║  3. Set DARAJA_CONSUMER_KEY + SECRET (sandbox)           ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════╝${NC}"
