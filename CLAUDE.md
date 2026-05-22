# ANKINO YOUTH HUB — Project Intelligence

> This file is read by Cline / Claude at the start of every session.
> It contains project context, conventions, and CI/CD runbook so the AI
> never needs to re-explore the codebase from scratch.

---

## 🌍 What This Is

**Ankino Youth Hub** is a premium single-page application for Kenya's youth tech ecosystem.
- **Founded by**: Ian Kinoti
- **Powered by**: Safaricom
- **Mission**: Connect young Kenyan Developers, Creators, Gamers & Founders to hackathons, internships, scholarships, startup resources, and the Safaricom/M-PESA ecosystem.

---

## 🗂️ Project Structure

```
ankino-youth-hub/
├── index.html                    # Single HTML entry point
├── staticwebapp.config.json      # Azure SWA routing, headers, CSP
├── firestore.rules               # Firestore Security Rules (deploy via Firebase CLI)
├── src/
│   ├── main.js                   # App boot — inits all sections
│   ├── style.css                 # Global styles (dark theme, Orbitron font)
│   ├── canvas/
│   │   └── ecosystem.js          # Hero canvas (particles, data streams, M-PESA arcs)
│   ├── components/
│   │   ├── brain.js              # NLP engine — classify, respond, caching, context pruning
│   │   └── chatbot.js            # Chat UI — markdown, code blocks, chips, typing indicator
│   ├── data/
│   │   ├── content.js            # Opportunities, Startups, Events data
│   │   └── knowledge/
│   │       ├── safaricom.js      # Daraja, STK Push, C2B, B2C, OAuth, Africa's Talking
│   │       ├── tech.js           # HTML/CSS, JS, React, Git, APIs, Databases, AI/ML
│   │       ├── kenya.js          # Hackathons, internships, freelancing, startup intel
│   │       ├── common.js         # Programming basics, web concepts, DevOps
│   │       └── whatisdict.js     # "What is X?" semantic dictionary (extracted from brain.js)
│   └── lib/
│       ├── firebase.js           # Firestore data helpers (members, newsletter, registrations)
│       ├── auth.js               # Firebase Auth — Google/GitHub OAuth, profile state
│       ├── cache.js              # LRU response cache + Anthropic/Gemini prompt cache utils
│       └── batch.js              # Batch API queue, prewarm, analytics sink
├── api/                          # Azure Functions (v4 model) — deployed with SWA
│   ├── package.json              # @azure/functions ^4.5.0
│   ├── host.json                 # Functions runtime config
│   └── src/functions/
│       ├── mpesa-stk-push.js     # POST /api/mpesa/stk-push  (STK Push initiator)
│       ├── mpesa-callback.js     # POST /api/mpesa/callback|b2c/result|b2c/timeout
│       └── ai-proxy.js           # POST /api/ai/chat  GET /api/ai/health
├── scripts/
│   ├── azure-setup.sh            # One-shot Azure provisioning script
│   ├── azure-finish.sh           # Post-provision: inject SWA URL into env + secrets
│   ├── set-secrets.sh            # Interactive: push rotated secrets to Azure SWA
│   ├── smoke-test.sh             # Post-deploy health check (site + API + optional STK)
│   └── ROTATE_SECRETS.md         # Secret rotation + Firebase key restriction runbook
├── .mcp.json                     # MCP server config (GitHub, filesystem, memory, sequential-thinking)
├── .github/
│   └── workflows/
│       ├── ci.yml                # CI gate: lint → test → build (all branches/PRs) ← ACTIVE
│       ├── deploy-azure.yml      # CD: lint→test→build→Azure SWA deploy (main only) ← ACTIVE
│       └── deploy.yml.disabled   # Legacy GitHub Pages deploy (kept for reference)
├── vitest.config.js              # Test config (jsdom, coverage thresholds, reporters)
├── eslint.config.js              # ESLint flat config (v9+)
├── vite.config.js                # Vite config (port 3000, dist output)
├── .env.example                  # Env var TEMPLATES only — no real values (git-committed)
├── .env                          # Real local values — NEVER commit (git-ignored)
└── CLAUDE.md                     # This file
```

---

## 🛠️ Tech Stack

| Layer         | Technology                              |
|---------------|-----------------------------------------|
| Build         | Vite 8 (ES Modules)                     |
| Animation     | GSAP 3 + ScrollTrigger                  |
| Canvas        | Vanilla Canvas API (no library)         |
| AI Brain      | Custom local NLP (no external API)      |
| AI Cloud      | Azure Functions proxy → Claude / Gemini |
| Caching       | LRU (src/lib/cache.js) — 200 entries    |
| Batch Queue   | src/lib/batch.js — priority queue       |
| Testing       | Vitest + jsdom                          |
| Linting       | ESLint 9 flat config                    |
| CI/CD         | GitHub Actions → Azure SWA              |
| Deploy        | Azure Static Web Apps (Free tier)       |
| API           | Azure Functions v4 (integrated w/ SWA)  |
| Monitoring    | Azure Application Insights              |
| Fonts         | Orbitron, Space Grotesk, JetBrains Mono |

---

## ☁️ Azure Architecture

```
GitHub main push
  → deploy-azure.yml
      ├── Job 1: CI (lint · test · build)
      └── Job 2: Azure Static Web Apps deploy
            ├── dist/          → CDN edge nodes (global)
            └── api/           → Azure Functions (consumption plan)
                    ├── POST /api/mpesa/stk-push      ← initiate STK Push payment
                    ├── POST /api/mpesa/callback       ← Daraja payment result webhook
                    ├── POST /api/mpesa/b2c/result
                    ├── POST /api/mpesa/b2c/timeout
                    ├── POST /api/ai/chat
                    └── GET  /api/ai/health

PR opened → staging URL auto-created (preview environment)
PR closed → staging URL auto-destroyed
```

### Azure Resources

| Resource                     | Name                        | Cost/mo  | Purpose                          |
|------------------------------|-----------------------------|----------|----------------------------------|
| Resource Group               | ankino-youth-hub-rg         | $0       | Container for all resources      |
| Static Web App (Free)        | ankino-youth-hub            | $0       | SPA hosting + CDN + SSL          |
| Azure Functions (Consumption)| Integrated w/ SWA           | ~$0      | API routes (Daraja, AI proxy)    |
| Application Insights         | ankino-youth-hub-insights   | $0*      | Monitoring, traces, metrics      |
| Log Analytics Workspace      | ankino-youth-hub-insights-law | $0*    | Backing store for App Insights   |

> *Free up to 5 GB/month ingestion. Well within dev usage.
> **Total estimated cost: < $5/month** — leaving $195+ for AI API credits.

### Budget Allocation Guide ($200 / 30 days)

| Item                          | Budget    | Notes                                          |
|-------------------------------|-----------|------------------------------------------------|
| Azure infrastructure          | ~$5       | SWA free, Functions consumption, App Insights  |
| Anthropic Claude Haiku        | up to $80 | ~$0.80/M input tokens — very cost-effective    |
| Google Gemini Flash Lite      | up to $30 | Free tier generous; paid very cheap            |
| Reserve                       | $85       | Buffer for traffic spikes, storage if needed   |

---

## 🤖 AI Chatbot Architecture

The chatbot is **fully local NLP** — no API calls, no tokens, works offline.

```
User input
  → brain.js: respond()
      1. LRU cache lookup (cacheKey normalises case+whitespace)
      2. detectUserType() → sets ctx.userType (dev/founder/gamer/creator)
      3. classify() → scores every ALL_ENTRIES against input
      4. whatIs() → semantic "what is X?" fallback
      5. FALLBACKS → generic fallback
      6. pruneHistory() → smart context window (topic-relevance)
      7. responseCache.set() → cache for next call
  → chatbot.js: renderBotMessage()
      renderMarkdown() → HTML
      buildCodeBlock() → syntax-highlighted pre/code
      buildChips() → follow-up suggestion buttons
```

### Cloud AI Upgrade Path
When local NLP isn't enough, call the Azure Functions proxy:
```js
// Frontend — POST /api/ai/chat
const res = await fetch('/api/ai/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    provider: 'claude',   // or 'gemini'
    messages: [{ role: 'user', content: userInput }],
  }),
});
const { content } = await res.json();
```

### Prompt Caching Format (for Claude/Gemini migration)
`src/lib/cache.js` exports:
- `buildAnthropicCachedSystem(kb, tone)` — wraps large KB in `cache_control: {type:"ephemeral"}`
- `buildGeminiCacheRequest(kb)` — creates Gemini `cachedContent` object
- `buildAnthropicMessages(history, input)` — formats conversation history

### Batch API (for future scale)
`src/lib/batch.js` exports:
- `batchQueue.enqueue(input, ctx, priority)` — returns Promise<response>
- `buildAnthropicBatch(items)` — Anthropic `/v1/messages/batches` format
- `buildGeminiBatchJSONL(items)` — Gemini batch JSONL format
- `prewarmCache()` — pre-computes top-10 popular queries on boot

---

## 🔧 Development Commands

```bash
npm run dev          # Start dev server at localhost:3000
npm run build        # Production build → dist/
npm run preview      # Preview production build locally

npm run test         # Run tests in watch mode
npm run test:ci      # Run tests once with coverage (used in CI)
npm run test:ui      # Vitest UI (browser-based test explorer)

npm run lint         # Check for lint errors
npm run lint:fix     # Auto-fix lint errors
```

---

## 📦 CI/CD Pipeline

### Active: Azure Deployment (deploy-azure.yml)
Triggers on: `push` to `main`, `PR` to `main`, `workflow_dispatch`

```
push/PR to main
  ├── Job 1: CI
  │     lint → test:ci (coverage) → build → bundle-size-report
  └── Job 2: Deploy → Azure SWA
        Azure/static-web-apps-deploy@v1
          app_location:    /
          api_location:    api      ← Azure Functions auto-deployed
          output_location: dist
  └── Job 3: Health Check
        curl site URL → HTTP 200
        curl /api/ai/health → HTTP 200

PR opened  → preview URL created automatically
PR closed  → preview URL destroyed automatically
```

### Legacy: GitHub Pages (deploy.yml)
Kept for reference — not active when `deploy-azure.yml` is present.
To re-enable GitHub Pages, delete `deploy-azure.yml`.

### Continuous Integration (ci.yml)
Still runs on `push` to `main/develop/feature/*/fix/*` and `PR` to `main/develop`.
Separate from the deploy pipeline — acts as a gate.

---

## 🔐 Secrets & Environment

### GitHub Secrets (Settings → Secrets → Actions)

| Secret Name                          | Source                              | Used by                    |
|--------------------------------------|-------------------------------------|----------------------------|
| `AZURE_STATIC_WEB_APPS_API_TOKEN`    | `az staticwebapp secrets list`      | deploy-azure.yml           |
| `AZURE_SWA_URL`                      | SWA hostname after creation         | deploy-azure.yml health    |
| `AZURE_APPINSIGHTS_CONNECTION_STRING`| App Insights → Overview             | deploy-azure.yml           |
| `GITHUB_TOKEN`                       | Auto-provided by Actions            | SWA deploy action          |

### Azure SWA App Settings (Portal → SWA → Configuration)
These are server-side only — never exposed to the browser:

| Setting Name                | Value                     |
|-----------------------------|---------------------------|
| `ANTHROPIC_API_KEY`         | sk-ant-...                |
| `GEMINI_API_KEY`            | AIza...                   |
| `DARAJA_CONSUMER_KEY`       | from developer.safaricom  |
| `DARAJA_CONSUMER_SECRET`    | from developer.safaricom  |
| `DARAJA_ENV`                | sandbox / production      |
| `DARAJA_SHORTCODE`          | 174379 (sandbox)          |
| `APPINSIGHTS_CONNECTION_STRING` | InstrumentationKey=... |

Copy `.env.example` → `.env` and fill in values. Never commit `.env`.

---

## 🚀 Azure Setup Runbook

### First-time setup (run once)
```bash
# 1. Install Azure CLI (already done)
# 2. Login
az login

# 3. Run setup script (provisions all resources)
chmod +x scripts/azure-setup.sh
./scripts/azure-setup.sh

# 4. The script will:
#    - Create resource group (southafricanorth)
#    - Create Application Insights
#    - Create Static Web App (Free tier, eastus2 management)
#    - Auto-configure GitHub Actions via --login-with-github
#    - Add AZURE_STATIC_WEB_APPS_API_TOKEN to GitHub Secrets (if gh CLI present)
#    - Inject Azure values into .env
```

### Manual secret injection (if gh CLI not available)
```bash
# Get the deployment token
az staticwebapp secrets list \
  --name ankino-youth-hub \
  --resource-group ankino-youth-hub-rg \
  --query "properties.apiKey" -o tsv

# Then add to GitHub: Settings → Secrets → Actions → New repository secret
# Name: AZURE_STATIC_WEB_APPS_API_TOKEN
# Value: <token from above>
```

### Deploy
```bash
git push origin main   # triggers deploy-azure.yml automatically
```

### Teardown (if needed)
```bash
# Delete everything at once — no charges after this
az group delete --name ankino-youth-hub-rg --yes --no-wait
```

---

## 🖥️ MCP Servers (`.mcp.json`)

| Server               | Package                                      | Purpose                                     |
|----------------------|----------------------------------------------|---------------------------------------------|
| `github`             | `@modelcontextprotocol/server-github`        | PR/issue/release/Actions management         |
| `filesystem`         | `@modelcontextprotocol/server-filesystem`    | Read/write project files                    |
| `memory`             | `@modelcontextprotocol/server-memory`        | Persist arch decisions across sessions      |
| `sequential-thinking`| `@modelcontextprotocol/server-sequential-thinking` | Multi-step debugging & planning       |

**To activate**: Set `GITHUB_TOKEN` env var, then reload Cline/Claude Desktop.
All servers use `npx -y` and auto-install on first run.

---

## 📐 Code Conventions

- **ES Modules** everywhere (`import/export`) — no CommonJS
- **`prefer-const`** enforced — use `const` by default
- **No `var`** — ESLint error
- **No `console.log`** in production code — use `console.debug` or `console.warn`
- **Async/await** over raw Promises
- **Inline comments** use `// ──` header style (matches existing codebase)
- **`_` prefix** for private class methods/vars (`_resize`, `_loop`)
- Knowledge base entries always export as named arrays: `export const X_KNOWLEDGE = [...]`
- Each KB entry: `{ topic, label, patterns[], getResponse(ctx) → {text, followUps[], code?} }`
- Azure Functions use **v4 programming model** (`app.http(...)`)
- API functions return `{ status, headers, body }` plain objects

---

## 🎨 Colour Palette

```js
{ green: '#00B140', neon: '#00FF66', gold: '#FFD700',
  orange: '#FF6B35', red: '#E31837', dark: '#050d05' }
```

---

## 🚀 Next CI/CD Updates (Awaiting)

When the user provides CI/CD update instructions, apply them in this order:
1. Add/modify GitHub Actions workflows in `.github/workflows/`
2. Update `package.json` scripts if needed
3. Update `vitest.config.js` coverage thresholds as coverage improves
4. Add new knowledge entries to the appropriate KB file (not brain.js)
5. Test locally with `npm run test:ci` before pushing
6. The `build` job's "Check bundle size" step will flag any size regressions
