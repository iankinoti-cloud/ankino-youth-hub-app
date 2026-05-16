// ── Daraja M-PESA Callback Handler ─────────────────────────────────────────
// Handles STK Push results, C2B confirmations, and B2C results from Safaricom.
// Azure Function v4 programming model (HTTP trigger).
//
// Endpoints exposed via Azure Static Web Apps:
//   POST /api/mpesa/callback      → STK Push result
//   POST /api/mpesa/b2c/result    → B2C payment result
//   POST /api/mpesa/b2c/timeout   → B2C timeout
// ───────────────────────────────────────────────────────────────────────────

import { app } from '@azure/functions';

// ── Shared response helpers ─────────────────────────────────────────────────
const jsonOk  = (data)    => ({ status: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
const jsonErr = (msg, s)  => ({ status: s ?? 400, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: msg }) });

// ── STK Push callback ───────────────────────────────────────────────────────
app.http('mpesa-stk-callback', {
  methods:   ['POST'],
  authLevel: 'anonymous',
  route:     'mpesa/callback',
  handler:   async (request, context) => {
    context.log('M-PESA STK callback received');

    let body;
    try {
      body = await request.json();
    } catch {
      return jsonErr('Invalid JSON payload', 400);
    }

    const stkCallback = body?.Body?.stkCallback;
    if (!stkCallback) return jsonErr('Missing stkCallback in payload', 400);

    const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = stkCallback;

    context.log('STK result', { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc });

    if (ResultCode === 0) {
      // ── Success — extract metadata ──────────────────────────────────────
      const items = CallbackMetadata?.Item ?? [];
      const meta  = Object.fromEntries(items.map(i => [i.Name, i.Value]));

      context.log('Payment successful', {
        amount:      meta.Amount,
        receipt:     meta.MpesaReceiptNumber,
        phone:       meta.PhoneNumber,
        transDate:   meta.TransactionDate,
      });

      // TODO: persist to Azure Cosmos DB or Table Storage when added
      return jsonOk({ ResultCode: 0, ResultDesc: 'Success' });
    }

    // ── Failed / cancelled ─────────────────────────────────────────────────
    context.warn('STK push failed', { ResultCode, ResultDesc });
    return jsonOk({ ResultCode, ResultDesc });
  },
});

// ── B2C Result callback ─────────────────────────────────────────────────────
app.http('mpesa-b2c-result', {
  methods:   ['POST'],
  authLevel: 'anonymous',
  route:     'mpesa/b2c/result',
  handler:   async (request, context) => {
    context.log('M-PESA B2C result received');

    let body;
    try {
      body = await request.json();
    } catch {
      return jsonErr('Invalid JSON payload', 400);
    }

    const result = body?.Result;
    if (!result) return jsonErr('Missing Result in payload', 400);

    context.log('B2C result', {
      TransactionID:   result.TransactionID,
      ResultCode:      result.ResultCode,
      ResultDesc:      result.ResultDesc,
      OriginatorConversationID: result.OriginatorConversationID,
    });

    return jsonOk({ ResultCode: 0, ResultDesc: 'Success' });
  },
});

// ── B2C Timeout callback ────────────────────────────────────────────────────
app.http('mpesa-b2c-timeout', {
  methods:   ['POST'],
  authLevel: 'anonymous',
  route:     'mpesa/b2c/timeout',
  handler:   async (request, context) => {
    context.warn('M-PESA B2C timeout received', await request.text());
    return jsonOk({ ResultCode: 0, ResultDesc: 'Timeout acknowledged' });
  },
});
