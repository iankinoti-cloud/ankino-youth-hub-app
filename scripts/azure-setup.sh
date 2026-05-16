#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════
#  ANKINO YOUTH HUB — Azure Infrastructure Setup Script
#  Run once to provision all Azure resources needed for development.
#
#  Prerequisites:
#    - Azure CLI installed  (curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash)
#    - Logged in           (az login)
#    - GitHub CLI          (gh auth login)
#
#  Usage:
#    chmod +x scripts/azure-setup.sh
#    ./scripts/azure-setup.sh
# ═══════════════════════════════════════════════════════════════════════════

set -euo pipefail

# ── Colours ──────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'; CYAN='\033[0;36m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
info()    { echo -e "${CYAN}[INFO]${NC}  $*"; }
success() { echo -e "${GREEN}[OK]${NC}    $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC}  $*"; }
error()   { echo -e "${RED}[ERROR]${NC} $*"; exit 1; }

# ── Configuration ─────────────────────────────────────────────────────────────
RESOURCE_GROUP="${AZURE_RESOURCE_GROUP:-ankino-youth-hub-rg}"
LOCATION="${AZURE_LOCATION:-southafricanorth}"
SWA_NAME="${AZURE_SWA_NAME:-ankino-youth-hub}"
APPINSIGHTS_NAME="${AZURE_APPINSIGHTS_NAME:-ankino-youth-hub-insights}"
GITHUB_REPO="${GITHUB_REPO:-iankinoti-cloud/ankino-youth-hub}"   # owner/repo
GITHUB_BRANCH="${GITHUB_BRANCH:-main}"

# ── Banner ────────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║        ANKINO YOUTH HUB — Azure Setup                ║${NC}"
echo -e "${GREEN}║   Resource Group : ${CYAN}${RESOURCE_GROUP}${GREEN}          ║${NC}"
echo -e "${GREEN}║   Location       : ${CYAN}${LOCATION}${GREEN}                ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════╝${NC}"
echo ""

# ── 1. Check prerequisites ────────────────────────────────────────────────────
info "Checking prerequisites..."
command -v az  &>/dev/null || error "Azure CLI not found. Install: curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash"
command -v gh  &>/dev/null || warn  "GitHub CLI not found — you'll need to add the SWA token to GitHub Secrets manually"
command -v jq  &>/dev/null || warn  "jq not found — output parsing may be limited"

# Verify Azure login
ACCOUNT=$(az account show --query "{sub:id,name:name}" -o json 2>/dev/null) || error "Not logged in. Run: az login"
SUBSCRIPTION_ID=$(echo "$ACCOUNT" | jq -r '.sub')
SUBSCRIPTION_NAME=$(echo "$ACCOUNT" | jq -r '.name')
success "Logged in — Subscription: ${SUBSCRIPTION_NAME} (${SUBSCRIPTION_ID})"

# ── 2. Register providers ─────────────────────────────────────────────────────
info "Registering required Azure resource providers..."
az provider register --namespace Microsoft.Web               --wait 2>/dev/null || true
az provider register --namespace Microsoft.Insights          --wait 2>/dev/null || true
az provider register --namespace microsoft.insights          --wait 2>/dev/null || true
success "Resource providers registered"

# ── 3. Resource Group ─────────────────────────────────────────────────────────
info "Creating resource group: ${RESOURCE_GROUP} in ${LOCATION}..."
az group create \
  --name     "$RESOURCE_GROUP" \
  --location "$LOCATION" \
  --tags     project=ankino-youth-hub environment=development owner=IanKinoti \
  --output   none
success "Resource group ready: ${RESOURCE_GROUP}"

# ── 4. Application Insights ───────────────────────────────────────────────────
info "Creating Application Insights workspace: ${APPINSIGHTS_NAME}..."

# Create Log Analytics Workspace first (required for workspace-based App Insights)
LAW_NAME="${APPINSIGHTS_NAME}-law"
az monitor log-analytics workspace create \
  --resource-group "$RESOURCE_GROUP" \
  --workspace-name "$LAW_NAME" \
  --location       "$LOCATION" \
  --sku            PerGB2018 \
  --output         none 2>/dev/null || true

LAW_ID=$(az monitor log-analytics workspace show \
  --resource-group "$RESOURCE_GROUP" \
  --workspace-name "$LAW_NAME" \
  --query id -o tsv)

az monitor app-insights component create \
  --app            "$APPINSIGHTS_NAME" \
  --location       "$LOCATION" \
  --resource-group "$RESOURCE_GROUP" \
  --application-type web \
  --workspace       "$LAW_ID" \
  --tags           project=ankino-youth-hub \
  --output         none 2>/dev/null || info "App Insights already exists — skipping"

APPINSIGHTS_CONN=$(az monitor app-insights component show \
  --app            "$APPINSIGHTS_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --query          connectionString -o tsv 2>/dev/null || echo "")

if [ -n "$APPINSIGHTS_CONN" ]; then
  success "Application Insights ready. Connection string retrieved."
else
  warn "Could not retrieve App Insights connection string — set manually later"
fi

# ── 5. Azure Static Web App ───────────────────────────────────────────────────
info "Creating Azure Static Web App: ${SWA_NAME}..."

az staticwebapp create \
  --name           "$SWA_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --location       "eastus2" \
  --source         "https://github.com/${GITHUB_REPO}" \
  --branch         "$GITHUB_BRANCH" \
  --app-location   "/" \
  --api-location   "api" \
  --output-location "dist" \
  --login-with-github \
  --sku            Free \
  --tags           project=ankino-youth-hub environment=production \
  2>/dev/null || warn "SWA may already exist — retrieving details..."

# Get SWA details
SWA_URL=$(az staticwebapp show \
  --name           "$SWA_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --query          defaultHostname -o tsv 2>/dev/null || echo "")

SWA_TOKEN=$(az staticwebapp secrets list \
  --name           "$SWA_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --query          "properties.apiKey" -o tsv 2>/dev/null || echo "")

if [ -n "$SWA_URL" ]; then
  success "Static Web App URL: https://${SWA_URL}"
else
  warn "Could not determine SWA URL — check Azure portal"
fi

# ── 6. App Settings (secrets → SWA environment) ───────────────────────────────
if [ -n "$SWA_NAME" ] && [ -n "$RESOURCE_GROUP" ]; then
  info "Configuring Azure SWA app settings (server-side secrets)..."

  # Read from local .env if present
  ANTHROPIC_KEY="${ANTHROPIC_API_KEY:-placeholder_set_me}"
  GEMINI_KEY="${GEMINI_API_KEY:-placeholder_set_me}"
  DARAJA_KEY="${DARAJA_CONSUMER_KEY:-placeholder_set_me}"
  DARAJA_SECRET="${DARAJA_CONSUMER_SECRET:-placeholder_set_me}"

  az staticwebapp appsettings set \
    --name           "$SWA_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --setting-names \
      "ANTHROPIC_API_KEY=${ANTHROPIC_KEY}" \
      "GEMINI_API_KEY=${GEMINI_KEY}" \
      "DARAJA_CONSUMER_KEY=${DARAJA_KEY}" \
      "DARAJA_CONSUMER_SECRET=${DARAJA_SECRET}" \
      "DARAJA_ENV=sandbox" \
      "DARAJA_SHORTCODE=174379" \
      "APPINSIGHTS_CONNECTION_STRING=${APPINSIGHTS_CONN}" \
    --output none 2>/dev/null || warn "Could not set app settings — configure manually in Azure Portal"

  success "App settings configured"
fi

# ── 7. Add deployment token to GitHub Secrets ─────────────────────────────────
if [ -n "$SWA_TOKEN" ] && command -v gh &>/dev/null; then
  info "Adding AZURE_STATIC_WEB_APPS_API_TOKEN to GitHub Secrets..."
  echo "$SWA_TOKEN" | gh secret set AZURE_STATIC_WEB_APPS_API_TOKEN \
    --repo "$GITHUB_REPO" \
    --body - 2>/dev/null || warn "Could not set GitHub secret — add manually"

  SWA_URL_FULL="https://${SWA_URL}"
  echo "$SWA_URL_FULL" | gh secret set AZURE_SWA_URL \
    --repo "$GITHUB_REPO" \
    --body - 2>/dev/null || true

  if [ -n "$APPINSIGHTS_CONN" ]; then
    echo "$APPINSIGHTS_CONN" | gh secret set AZURE_APPINSIGHTS_CONNECTION_STRING \
      --repo "$GITHUB_REPO" \
      --body - 2>/dev/null || true
  fi

  success "GitHub Secrets set"
else
  warn "GitHub CLI not available or SWA token empty."
  warn "Manually add these GitHub Secrets (Settings → Secrets → Actions):"
  echo "  AZURE_STATIC_WEB_APPS_API_TOKEN = ${SWA_TOKEN:-<get from Azure Portal>}"
  echo "  AZURE_SWA_URL                   = https://${SWA_URL:-<your-swa-url>.azurestaticapps.net}"
  [ -n "$APPINSIGHTS_CONN" ] && echo "  AZURE_APPINSIGHTS_CONNECTION_STRING = ${APPINSIGHTS_CONN}"
fi

# ── 8. Summary ────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║          ✅  Azure Setup Complete                    ║${NC}"
echo -e "${GREEN}╠══════════════════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║  Resource Group  : ${CYAN}${RESOURCE_GROUP}${GREEN}          ║${NC}"
echo -e "${GREEN}║  Location        : ${CYAN}${LOCATION}${GREEN}                ║${NC}"
echo -e "${GREEN}║  Static Web App  : ${CYAN}${SWA_NAME}${GREEN}                ║${NC}"
echo -e "${GREEN}║  URL             : ${CYAN}https://${SWA_URL:-pending}${GREEN} ║${NC}"
echo -e "${GREEN}║  App Insights    : ${CYAN}${APPINSIGHTS_NAME}${GREEN}         ║${NC}"
echo -e "${GREEN}╠══════════════════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║  Next steps:                                         ║${NC}"
echo -e "${GREEN}║  1. Copy .env.example → .env, fill Azure values     ║${NC}"
echo -e "${GREEN}║  2. git push main → triggers deploy-azure.yml       ║${NC}"
echo -e "${GREEN}║  3. Set real API keys in Azure Portal → SWA         ║${NC}"
echo -e "${GREEN}║     → Configuration → Application Settings          ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════╝${NC}"
echo ""

# ── 9. Update .env with real values ──────────────────────────────────────────
if [ -f ".env" ]; then
  info "Updating .env with Azure resource values..."
  sed -i "s|AZURE_SUBSCRIPTION_ID=.*|AZURE_SUBSCRIPTION_ID=${SUBSCRIPTION_ID}|" .env
  sed -i "s|AZURE_RESOURCE_GROUP=.*|AZURE_RESOURCE_GROUP=${RESOURCE_GROUP}|" .env
  sed -i "s|AZURE_SWA_NAME=.*|AZURE_SWA_NAME=${SWA_NAME}|" .env
  [ -n "$SWA_URL" ] && sed -i "s|AZURE_SWA_URL=.*|AZURE_SWA_URL=https://${SWA_URL}|" .env
  [ -n "$APPINSIGHTS_CONN" ] && sed -i "s|AZURE_APPINSIGHTS_CONNECTION_STRING=.*|AZURE_APPINSIGHTS_CONNECTION_STRING=${APPINSIGHTS_CONN}|" .env
  success ".env updated with Azure values"
else
  info "No .env found — copy .env.example → .env and fill in values"
fi
