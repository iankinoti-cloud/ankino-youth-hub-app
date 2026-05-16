// ═══════════════════════════════════════════════════════════════════════════
//  Daraja M-PESA STK Push — Initiator (server-side)
//  POST /api/mpesa/stk-push
//
//  Hardened endpoint that initiates a Lipa-Na-M-PESA Online (STK Push) request.
//  All credentials live in Azure SWA Application Settings — NEVER in client code.
//
//  Body (JSON):
//    {
//      "phone":            "0712345678" | "254712345678" | "+254712345678",
//      "amount":           1,                          // KES (integer, 1..70000 sandbox)
//      "accountReference": "AnkinoYouthHub",           // optional, alphanumeric, ≤12 chars
//      "description":      "Membership"                // optional, ≤13 chars
//    }
//
//  Success response (200):
//    { ok: true, checkoutRequestId, merchantRequestId, customerMessage }
//
//  Error responses use safe, non-leaking messages. Detailed errors only in logs.
//
//  Env (SWA Application Settings):
//    DARAJA_ENV               sandbox | production           (default: sandbox)
//    DARAJA_CONSUMER_KEY      Daraja app consumer key
//    DARAJA_CONSUMER_SECRET   Daraja app consumer secret
//    DARAJA_SHORTCODE         Paybill / Till (sandbox: 174379)
//    DARAJA_PASSKEY           LNM passkey (sandbox default in .env.example)
//    DARAJA_CALLBACK_URL      Full https URL to /api/mpesa/callback
//                             (set by scripts/azure-finish.sh once SWA URL known)
// ═══════════════════════════════════════════════════════════════════════════

import { app } from '@azure/functions';

// ── Config ──────────────────────────────────────────────────────────────────
const DARAJA_BASE = {
  sandbox:    'https://sandbox.safaricom.co.ke',
  production: 'https://api.safaricom.co.ke',
};

// Sandbox limits: 1..70000 KES. Production paybill limits vary — keep conservative default.
const MIN_AMOUNT = 1;
const MAX_AMOUNT = 70_000;

// Per-IP rate limit for STK push (more aggressive than AI proxy: payments are sensitive)
const RATE_LIMIT  = 5;          // 5 STK pushes...
const RATE_WINDOW = 60_000;     // ... per minute per IP
const rateLimitMap = new Map();

// ── OAuth token cache (module-scoped — safe across warm invocations) ────────
let cachedToken = { value: null, expiresAt: 0 };

// ── Helpers ─────────────────────────────────────────────────────────────────
const jsonOk  = (data)   => ({ status: 200,        headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
const jsonErr = (msg, s) => ({ status: s ?? 400,   headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: false, error: msg }) });

/** Normalise Kenyan phone numbers to Daraja MSISDN format (2547XXXXXXXX or 2541XXXXXXXX). */
function normalisePhone(input) {
  if (typeof input !== 'string') return null;
  const digits = input.replace(/[\s+\-()]/g, '');

  // Accept: 0712345678, 712345678, 254712345678
  let msisdn;
  if (/^0[17]\d{8}$/.test(digits))       msisdn = '254' + digits.slice(1);
  else if (/^[17]\d{8}$/.test(digits))   msisdn = '254' + digits;
  else if (/^254[17]\d{8}$/.test(digits)) msisdn = digits;
  else return null;

  return msisdn;
}

function checkRateLimit(ip) {
  const now = Date.now();
  const rec = rateLimitMap.get(ip) ?? { count: 0, start: now };
  if (now - rec.start > RATE_WINDOW) {
    rateLimitMap.set(ip, { count: 1, start: now });
    return true;
  }
  rec.count += 1;
  rateLimitMap.set(ip, rec);
  return rec.count <= RATE_LIMIT;
}

/** Generate Daraja timestamp: YYYYMMDDHHmmss in EAT-ish local time (Daraja accepts UTC too). */
function darajaTimestamp(d = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return (
    d.getUTCFullYear().toString()
    + pad(d.getUTCMonth() + 1)
    + pad(d.getUTCDate())
    + pad(d.getUTCHours())
    + pad(d.getUTCMinutes())
    + pad(d.getUTCSeconds())
  );
}

/** Acquire OAuth token (cached until 60s before expiry). */
async function getAccessToken(env, context) {
  const now = Date.now();
  if (cachedToken.value && cachedToken.expiresAt - 60_000 > now) {
    return cachedToken.value;
  }

  const key    = process.env.DARAJA_CONSUMER_KEY;
  const secret = process.env.DARAJA_CONSUMER_SECRET;
  if (!key || !secret) throw new Error('DARAJA credentials not configured');

  const base = DARAJA_BASE[env] ?? DARAJA_BASE.sandbox;
  const auth = Buffer.from(`${key}:${secret}`).toString('base64');

  const resp = await fetch(`${base}/oauth/v1/generate?grant_type=client_credentials`, {
    method:  'GET',
    headers: { Authorization: `Basic ${auth}` },
  });

  if (!resp.ok) {
    context.error('Daraja OAuth failed', resp.status, await resp.text().catch(() => ''));
    throw new Error('Daraja authentication failed');
  }

  const data = await resp.json();
  cachedToken = {
    value:     data.access_token,
    expiresAt: now + (Number(data.expires_in ?? 3599) * 1000),
  };
  return cachedToken.value;
}

// ── Endpoint ────────────────────────────────────────────────────────────────
app.http('mpesa-stk-push', {
  methods:   ['POST'],
  authLevel: 'anonymous',
  route:     'mpesa/stk-push',
  handler:   async (request, context) => {
    // ── 1. Rate limit ───────────────────────────────────────────────────────
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
    if (!checkRateLimit(ip)) {
      return jsonErr('Too many requests — please wait 60 seconds', 429);
    }

    // ── 2. Parse + validate body ────────────────────────────────────────────
    let body;
    try {
      body = await request.json();
    } catch {
      return jsonErr('Invalid JSON body', 400);
    }

    const phone  = normalisePhone(body?.phone);
    const amount = Number(body?.amount);

    if (!phone) {
      return jsonErr('Invalid phone — use Kenyan format e.g. 0712345678', 400);
    }
    if (!Number.isInteger(amount) || amount < MIN_AMOUNT || amount > MAX_AMOUNT) {
      return jsonErr(`Amount must be an integer between ${MIN_AMOUNT} and ${MAX_AMOUNT} KES`, 400);
    }

    // Sanitise free-text fields — Daraja rejects long / special-char values
    const accountRef = String(body?.accountReference ?? 'AnkinoYouthHub')
      .replace(/[^A-Za-z0-9]/g, '')
      .slice(0, 12) || 'AnkinoHub';

    const description = String(body?.description ?? 'Payment')
      .replace(/[^A-Za-z0-9 ]/g, '')
      .slice(0, 13) || 'Payment';

    // ── 3. Read config from SWA App Settings ────────────────────────────────
    const env       = (process.env.DARAJA_ENV ?? 'sandbox').toLowerCase();
    const shortcode = process.env.DARAJA_SHORTCODE;
    const passkey   = process.env.DARAJA_PASSKEY;
    const callback  = process.env.DARAJA_CALLBACK_URL;

    if (!shortcode || !passkey) {
      context.error('Missing DARAJA_SHORTCODE or DARAJA_PASSKEY in environment');
      return jsonErr('Payments not configured — contact support', 503);
    }
    if (!callback || !/^https:\/\//.test(callback)) {
      context.error('DARAJA_CALLBACK_URL must be a public https URL', { callback });
      return jsonErr('Payments not configured — contact support', 503);
    }

    // ── 4. OAuth → Build STK push payload ───────────────────────────────────
    let token;
    try {
      token = await getAccessToken(env, context);
    } catch (err) {
      context.error('Token fetch error', err?.message ?? err);
      return jsonErr('Payment gateway unavailable — try again', 502);
    }

    const timestamp = darajaTimestamp();
    const password  = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

    const payload = {
      BusinessShortCode: shortcode,
      Password:          password,
      Timestamp:         timestamp,
      TransactionType:   'CustomerPayBillOnline',
      Amount:            amount,
      PartyA:            phone,
      PartyB:            shortcode,
      PhoneNumber:       phone,
      CallBackURL:       callback,
      AccountReference:  accountRef,
      TransactionDesc:   description,
    };

    // ── 5. POST to Daraja ───────────────────────────────────────────────────
    const base = DARAJA_BASE[env] ?? DARAJA_BASE.sandbox;
    let resp;
    try {
      resp = await fetch(`${base}/mpesa/stkpush/v1/processrequest`, {
        method:  'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization:  `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      context.error('Daraja network error', err?.message ?? err);
      return jsonErr('Payment gateway unreachable — try again', 502);
    }

    const raw = await resp.text();
    let data;
    try { data = JSON.parse(raw); } catch { data = { raw }; }

    if (!resp.ok || data.ResponseCode !== '0') {
      // Log full detail server-side but return safe message to client
      context.warn('Daraja STK push rejected', {
        status:        resp.status,
        ResponseCode:  data.ResponseCode,
        errorCode:     data.errorCode,
        errorMessage:  data.errorMessage,
        ResponseDesc:  data.ResponseDescription,
      });
      const safeMsg = data.errorMessage || data.ResponseDescription || 'Payment request rejected';
      return jsonErr(String(safeMsg).slice(0, 200), 400);
    }

    context.log('STK push initiated', {
      MerchantRequestID: data.MerchantRequestID,
      CheckoutRequestID: data.CheckoutRequestID,
      phone:             phone.replace(/^(\d{6})\d{4}(\d{2})$/, '$1****$2'),
      amount,
    });

    return jsonOk({
      ok:                true,
      merchantRequestId: data.MerchantRequestID,
      checkoutRequestId: data.CheckoutRequestID,
      customerMessage:   data.CustomerMessage ?? 'Check your phone to complete the payment',
    });
  },
});
