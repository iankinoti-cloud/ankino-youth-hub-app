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

Run this **once** (replace placeholders with the new values you just generated):

```bash
az staticwebapp appsettings set \
  --name           ankino-youth-hub \
  --resource-group ankino-youth-hub-rg \
  --setting-names \
    ANTHROPIC_API_KEY='sk-ant-api03-NEW_VALUE' \
    DARAJA_CONSUMER_KEY='NEW_CONSUMER_KEY' \
    DARAJA_CONSUMER_SECRET='NEW_CONSUMER_SECRET' \
    DARAJA_PASSKEY='bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919' \
    DARAJA_SHORTCODE='174379' \
    DARAJA_ENV='sandbox' \
    DARAJA_CALLBACK_URL='https://<YOUR-SWA>.azurestaticapps.net/api/mpesa/callback'
```

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
