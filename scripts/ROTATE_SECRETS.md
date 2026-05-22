# 🔐 Secret Rotation Runbook — Ankino Youth Hub

> **WHEN TO USE**: any time an API key has been pasted into chat, committed to
> Git, shared in screenshots, or you suspect it has leaked. Rotate **immediately**.

The 3 keys that were exposed in chat on 2026-05-16 **must** be rotated before
the first production traffic hits the app:

| Secret                  | Status   | Action                                                     |
| ----------------------- | -------- | ---------------------------------------------------------- |
| `ANTHROPIC_API_KEY`     | LEAKED   | Revoke in Anthropic console → generate new                 |
| `DARAJA_CONSUMER_KEY`   | LEAKED   | Regenerate in Daraja portal (sandbox app)                  |
| `DARAJA_CONSUMER_SECRET`| LEAKED   | Regenerate (paired with key — done together)               |

The Firebase Web API key was also exposed in `.env.example` (committed to Git).
Firebase Web API keys are public-by-design but **must be restricted** to your
domains to prevent abuse. See §9 below.

| Secret                   | Status   | Action                                                    |
| ------------------------ | -------- | --------------------------------------------------------- |
| `VITE_FIREBASE_API_KEY`  | EXPOSED  | Restrict key to your domains (§9) — cannot truly rotate   |

---

## 1. Anthropic Claude

1. Open https://console.anthropic.com/settings/keys
2. Find the key starting `sk-ant-api03-VN3yE2m_...` → **Revoke**
3. **Create Key** → name it `ankino-youth-hub-prod` → copy the new value once (you cannot view it again)
4. Save it to Azure (see §4 below). Do **not** paste it into chat.

## 2. Safaricom Daraja

1. Open https://developer.safaricom.co.ke → **My Apps**
2. Open your sandbox app → **Keys** tab → **Regenerate** Consumer Key & Secret
3. Copy both new values. Save them to Azure (see §4 below).

> If you ever applied for production "Go Live" keys with these same exposed
> values, you must also regenerate the production app's keys.

## 3. (If ever needed) Gemini / Africa's Talking / GitHub Token

Same pattern — revoke + regenerate. Don't reuse old values.

---

## 4. Push the rotated values to Azure

**Recommended — interactive helper** (silent prompts, no values in shell history,
no values written to disk):

```bash
./scripts/set-secrets.sh
```

The helper prompts you for each rotated secret, validates basic format, then
calls `az staticwebapp appsettings set` for you. It also (re)asserts the
non-secret Daraja config (`DARAJA_PASSKEY`, `DARAJA_SHORTCODE`, `DARAJA_ENV`,
and the three `DARAJA_*_URL` callbacks) which were missing from SWA settings.

**Manual fallback** — only if you can't run the helper:

```bash
az staticwebapp appsettings set \
  --name           ankino-youth-hub \
  --resource-group ankino-youth-hub-rg \
  --setting-names \
    ANTHROPIC_API_KEY='sk-ant-api03-NEW_VALUE' \
    GEMINI_API_KEY='AIza_NEW_VALUE' \
    DARAJA_CONSUMER_KEY='NEW_CONSUMER_KEY' \
    DARAJA_CONSUMER_SECRET='NEW_CONSUMER_SECRET' \
    DARAJA_PASSKEY='bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919' \
    DARAJA_SHORTCODE='174379' \
    DARAJA_ENV='sandbox' \
    DARAJA_CALLBACK_URL='https://<YOUR-SWA>.azurestaticapps.net/api/mpesa/callback'
```

> ⚠️ The manual form puts the secrets in your shell history. Prefer the helper.

This stores them encrypted in Azure and exposes them to the Functions runtime
as `process.env.*`. The values are **never** visible to the browser.

After setting, the next request to `/api/ai/health` will show:

```json
{ "status": "ok", "providers": { "claude": true, "gemini": false } }
```

## 5. Mirror to local `.env` (for local `func start`)

Local-only — never commit:

```bash
cp .env.example .env
$EDITOR .env   # paste the rotated values
```

Confirm `.env` is git-ignored:

```bash
git check-ignore -v .env   # should print: .gitignore:1:.env  .env
```

## 6. Verify nothing leaked into Git

```bash
# 1. Make sure the leaked values are NOT in the repo history
git log -p --all | grep -E 'sk-ant-api03|CFUAJzn4p5cdlPcVB9gnssvxXMoV62NpIN1JzKvx5YqXGgmK' && \
  echo "❌ FOUND IN HISTORY — rewrite history with git-filter-repo" || \
  echo "✅ Clean — secrets never reached Git"
```

If the leaked values are in history (they shouldn't be — this exchange happened
in chat, not in a commit), see GitHub's official guide:
https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository

## 7. Smoke-test after rotation

```bash
./scripts/smoke-test.sh https://<YOUR-SWA>.azurestaticapps.net
# Optionally include STK push (you receive a prompt on your phone):
PHONE=254712345678 AMOUNT=1 ./scripts/smoke-test.sh https://<YOUR-SWA>.azurestaticapps.net
```

---

## 8. Going forward — how to share secrets with Cline / chat

❌ **Don't** paste raw key values into chat.
✅ Instead say: *"I've set `ANTHROPIC_API_KEY` in Azure SWA settings — please continue."*

Cline only needs to know **names**, not values. The Azure Functions runtime
reads them from `process.env` at execution time.

---

## 9. Restrict the Firebase Web API Key (HTTP Referrer Lock)

Firebase Web API keys are **public by design** — they identify the project, not
authenticate a secret owner. However, an unrestricted key can be abused from any
domain to spam your Firestore collections.

**This is a one-time setup — do it now:**

### Step 1 — Open Google Cloud Console

1. Go to https://console.cloud.google.com
2. Select project **ankino-youth-hub**
3. Navigate: **APIs & Services → Credentials**
4. Find the key named **Browser key (auto created by Firebase)** and click it

### Step 2 — Add HTTP Referrer Restrictions

Under **Application restrictions**, select **HTTP referrers (websites)**.

Add these referrer patterns (one per line):

```
https://ankino-youth-hub.firebaseapp.com/*
https://ankino-youth-hub.web.app/*
https://*.azurestaticapps.net/*
http://localhost:3000/*
http://localhost:5173/*
```

> ⚠️ After you get your permanent Azure SWA URL (e.g. `lively-wave-abc123.azurestaticapps.net`),
> add it explicitly and remove the wildcard `*.azurestaticapps.net` entry for tighter restriction.

### Step 3 — Restrict API access (optional but recommended)

Under **API restrictions**, select **Restrict key** and enable only:
- Cloud Firestore API
- Identity Toolkit API (Firebase Auth)
- Token Service API (Firebase Auth)
- Firebase Installations API

### Step 4 — Save and verify

Click **Save**. The restriction takes effect within ~5 minutes.

To verify it's working, open DevTools → Network, submit the Join Hub form, and
confirm Firestore writes succeed from your domain and fail from `curl` with a
bare key and no matching referrer.

### Why you cannot truly "rotate" a Firebase Web API key

Firebase projects have a single Web API key tied to the project configuration.
Generating a new one requires creating a new Firebase project (and migrating all
data). Restriction + Firestore Security Rules (`firestore.rules`) is the correct
mitigation — the key itself is not a secret.

### Firestore Security Rules (already deployed)

The file `firestore.rules` at the repo root enforces:
- All collections **deny reads** by default (no data leakage)
- Anonymous writes to `members`, `newsletter`, `registrations`, `opportunity_clicks`
  require **field validation** (correct types, size limits, no extra fields)
- The `users` collection is **owner-only** (authenticated UID must match doc ID)

Deploy rules to Firebase:
```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules --project ankino-youth-hub
```
