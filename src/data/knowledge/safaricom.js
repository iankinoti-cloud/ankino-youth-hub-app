// ═══════════════════════════════════════════════════════════
//  ANKINO YOUTH HUB — Safaricom Ecosystem Knowledge Base
//  Covers: Daraja API, M-PESA, STK Push, C2B, B2C, OAuth,
//          Safaricom Decode, Fintech Concepts, Africa's Talking
// ═══════════════════════════════════════════════════════════

export const SAFARICOM_KNOWLEDGE = [

  // ── Daraja API Overview ────────────────────────────────
  {
    topic: 'daraja',
    label: 'Daraja API',
    patterns: [
      'daraja', 'daraja api', 'safaricom api', 'safaricom apis',
      'what is daraja', 'mpesa api', 'm-pesa api', 'safaricom developer',
      'daraja gateway', 'mpesa developer', 'daraja docs',
    ],
    getResponse: () => ({
      text: `**Daraja** is Safaricom's official developer gateway — your bridge to M-PESA and 40M+ users across Kenya. 🔌\n\nHere's the full API toolkit:\n\n• **STK Push (M-PESA Express)** — Trigger a payment prompt on the user's phone\n• **C2B** — Accept customer payments to your Paybill or Till number\n• **B2C** — Disburse money to users (prizes, salaries, refunds)\n• **B2B** — Transfer funds between business accounts\n• **Account Balance** — Query your M-PESA float in real-time\n• **Transaction Status** — Verify any payment\n• **Reversal** — Reverse a completed transaction\n• **Tax Remittance** — Remit taxes to KRA via M-PESA\n\n**Get started free:** developer.safaricom.co.ke — Sandbox is completely free and simulates real M-PESA flows.`,
      followUps: [
        'How do I set up Daraja sandbox?',
        'Show me STK Push code',
        'How does Daraja OAuth work?',
        'What\'s the difference between C2B and STK Push?',
      ],
    }),
  },

  // ── Daraja Sandbox Setup ───────────────────────────────
  {
    topic: 'daraja_setup',
    label: 'Daraja Sandbox Setup',
    patterns: [
      'sandbox', 'set up daraja', 'setup daraja', 'daraja setup',
      'get started daraja', 'daraja account', 'create daraja app',
      'developer portal', 'developer.safaricom', 'test credentials',
      'consumer key', 'consumer secret', 'daraja credentials', 'register daraja',
    ],
    getResponse: () => ({
      text: `Setting up Daraja sandbox — 5 steps, 10 minutes: 🚀\n\n1. Go to **developer.safaricom.co.ke** → Sign Up (free)\n2. Create a new app → you'll get a **Consumer Key** + **Consumer Secret**\n3. Subscribe to the APIs you need (M-PESA Express, C2B, etc.)\n4. Use the sandbox shortcode **174379** and test phone **254708374149**\n5. Get your **access token** via OAuth — then you're good to call any API\n\nSandbox doesn't move real money. You can simulate payments using the test credentials.\n\n⚠️ Store your Consumer Key/Secret in **.env** files — never hardcode them or push them to GitHub!`,
      code: {
        lang: 'javascript',
        content: `// Install: npm install node-fetch dotenv
// .env file:
// DARAJA_KEY=your_consumer_key
// DARAJA_SECRET=your_consumer_secret

import 'dotenv/config';

const BASE_URL = 'https://sandbox.safaricom.co.ke';

export const getDarajaToken = async () => {
  const creds = Buffer.from(
    \`\${process.env.DARAJA_KEY}:\${process.env.DARAJA_SECRET}\`
  ).toString('base64');

  const res = await fetch(
    \`\${BASE_URL}/oauth/v1/generate?grant_type=client_credentials\`,
    { headers: { Authorization: \`Basic \${creds}\` } }
  );
  const { access_token } = await res.json();
  return access_token;
};`,
      },
      followUps: [
        'Show me the full STK Push request',
        'How do I handle a CallbackURL locally?',
        'How do I go live with Daraja?',
      ],
    }),
  },

  // ── Daraja OAuth ───────────────────────────────────────
  {
    topic: 'daraja_oauth',
    label: 'Daraja Authentication',
    patterns: [
      'oauth', 'access token daraja', 'bearer token daraja',
      'authenticate daraja', 'daraja token', 'basic auth daraja',
      'get token daraja', 'daraja auth', 'authorization daraja',
    ],
    getResponse: () => ({
      text: `Daraja uses **OAuth 2.0 Client Credentials** flow. Every API call needs a Bearer token in the header.\n\nKey facts:\n• Token is valid for **3600 seconds (1 hour)** — cache it, don't re-fetch every call\n• Use **Basic Auth** (Base64 of ConsumerKey:ConsumerSecret) to get it\n• Swap \`sandbox.safaricom.co.ke\` → \`api.safaricom.co.ke\` when going live\n• If you get a 401, your token expired — fetch a new one automatically`,
      code: {
        lang: 'javascript',
        content: `// Token manager with caching (production-ready)
let tokenCache = { token: null, expiresAt: 0 };

export const getDarajaToken = async () => {
  // Return cached token if still valid
  if (Date.now() < tokenCache.expiresAt) return tokenCache.token;

  const creds = Buffer.from(
    \`\${process.env.DARAJA_KEY}:\${process.env.DARAJA_SECRET}\`
  ).toString('base64');

  const res = await fetch(
    'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
    { headers: { Authorization: \`Basic \${creds}\` } }
  );

  if (!res.ok) throw new Error('Failed to get Daraja token');

  const { access_token, expires_in } = await res.json();
  // Refresh 60 seconds before actual expiry
  tokenCache = {
    token: access_token,
    expiresAt: Date.now() + (expires_in - 60) * 1000,
  };
  return access_token;
};`,
      },
      followUps: [
        'Now show me the STK Push request',
        'How do I store credentials securely?',
        'What happens when token expires in production?',
      ],
    }),
  },

  // ── STK Push ──────────────────────────────────────────
  {
    topic: 'stk_push',
    label: 'STK Push (M-PESA Express)',
    patterns: [
      'stk push', 'stk', 'lipa na mpesa online', 'lipa na m-pesa',
      'payment prompt', 'trigger payment', 'mpesa express', 'm-pesa express',
      'stk push code', 'stk implementation', 'stk push example',
      'customer payment phone', 'phone payment prompt',
    ],
    getResponse: () => ({
      text: `**STK Push** is the most-used Daraja feature — it sends a PIN prompt directly to the user's phone. No redirects, no card details. Just one tap. 🔥\n\nThe flow:\n\`User clicks Pay → Your backend → Daraja → User's phone popup → PIN → Daraja → Your CallbackURL\`\n\nWhat you need:\n• **BusinessShortCode** — your sandbox shortcode: \`174379\`\n• **Passkey** — from the sandbox (there's a default one)\n• **CallbackURL** — public HTTPS endpoint (use ngrok for local dev)\n• **Password** — \`Base64(BusinessShortCode + Passkey + Timestamp)\`\n• **Timestamp** — format: \`YYYYMMDDHHMMSS\`\n\nTest phone number: **254708374149** (sandbox simulator)`,
      code: {
        lang: 'javascript',
        content: `// STK Push — Full implementation (Node.js)
const SHORTCODE = '174379'; // sandbox
const PASSKEY = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';

export const stkPush = async ({ phone, amount, orderId }) => {
  const token = await getDarajaToken();

  const timestamp = new Date()
    .toISOString().replace(/[^0-9]/g, '').slice(0, 14);

  const password = Buffer.from(
    \`\${SHORTCODE}\${PASSKEY}\${timestamp}\`
  ).toString('base64');

  const res = await fetch(
    'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
    {
      method: 'POST',
      headers: {
        Authorization: \`Bearer \${token}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        BusinessShortCode: SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,            // e.g. 100
        PartyA: phone,             // 254712345678
        PartyB: SHORTCODE,
        PhoneNumber: phone,
        CallBackURL: process.env.CALLBACK_URL,
        AccountReference: orderId, // your order/reference ID
        TransactionDesc: 'Payment',
      }),
    }
  );
  return res.json();
  // Returns: { MerchantRequestID, CheckoutRequestID, ResponseCode: "0" }
};`,
      },
      followUps: [
        'How do I handle the STK callback?',
        'How do I use ngrok for my CallbackURL?',
        'How do I query STK Push transaction status?',
        'How do I go live with STK Push?',
      ],
    }),
  },

  // ── STK Callback ──────────────────────────────────────
  {
    topic: 'callback_url',
    label: 'Handling Daraja Callbacks',
    patterns: [
      'callback', 'callback url', 'callbackurl', 'webhook',
      'daraja callback', 'stk callback', 'ngrok', 'local callback',
      'tunnel', 'localhost callback', 'receive payment confirmation',
      'handle payment', 'payment result', 'mpesa result',
    ],
    getResponse: () => ({
      text: `Daraja POSTs payment results to your **CallbackURL** — it must be a public HTTPS endpoint. Your localhost isn't public during dev. Solution: **ngrok** 🚇\n\n**Setup in 3 commands:**\n\`npm install -g ngrok\`\n\`ngrok http 3000\`\n→ Copy the \`https://xxxx.ngrok.io\` URL → use as CallbackURL\n\nThe callback JSON has \`ResultCode: 0\` for success, anything else = failed/cancelled. Always respond with \`200 OK\` to Daraja or it will retry.`,
      code: {
        lang: 'javascript',
        content: `// Express callback handler
app.post('/mpesa/callback', express.json(), (req, res) => {
  const { stkCallback } = req.body.Body;

  if (stkCallback.ResultCode === 0) {
    // ✅ Payment successful
    const items = stkCallback.CallbackMetadata.Item;
    const get = (name) => items.find(i => i.Name === name)?.Value;

    const amount   = get('Amount');           // e.g. 100
    const mpesaRef = get('MpesaReceiptNumber'); // e.g. OEI2AK4D9F
    const phone    = get('PhoneNumber');       // e.g. 254712345678

    // → Update your DB, confirm order, send receipt
    console.log(\`KES \${amount} from \${phone} — Ref: \${mpesaRef}\`);
  } else {
    // ❌ Payment failed or cancelled by user
    console.log('Payment failed:', stkCallback.ResultDesc);
  }

  // IMPORTANT: always return 200 so Daraja stops retrying
  res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });
});`,
      },
      followUps: [
        'How do I save payment data to a database?',
        'What if my callback URL goes down?',
        'How do I verify a transaction manually?',
        'Show me C2B callbacks too',
      ],
    }),
  },

  // ── C2B ───────────────────────────────────────────────
  {
    topic: 'c2b',
    label: 'C2B Payments',
    patterns: [
      'c2b', 'customer to business', 'paybill payments', 'receive payment',
      'accept payment', 'register url', 'confirmation url',
      'validation url', 'c2b payment', 'c2b register', 'c2b callback',
    ],
    getResponse: () => ({
      text: `**C2B (Customer to Business)** is for receiving M-PESA payments when the customer initiates manually — sending to your Paybill or Till. 💰\n\nTwo types of numbers:\n• **Paybill** — Customer enters your business number + account reference (order ID, meter number, etc.)\n• **Till (Buy Goods)** — Customer just enters till number, no account reference\n\nC2B flow:\n1. **Register URLs** — Tell Daraja your ConfirmationURL and (optional) ValidationURL\n2. **Validation** — Safaricom asks "accept this payment?" — you respond Accept/Cancel\n3. **Confirmation** — Safaricom notifies you when payment completes\n\n💡 **STK Push vs C2B:** For apps where you know the user's phone, STK Push gives much better UX. C2B is better for walk-in customers or when users pay from their M-PESA menu directly.`,
      followUps: [
        'Show me how to register C2B URLs',
        'What\'s the C2B confirmation payload?',
        'When should I use C2B vs STK Push?',
        'Show me B2C for sending money to users',
      ],
    }),
  },

  // ── B2C ───────────────────────────────────────────────
  {
    topic: 'b2c',
    label: 'B2C Disbursements',
    patterns: [
      'b2c', 'business to customer', 'send money users', 'disburse',
      'disbursement', 'pay users', 'salary payment api',
      'b2c api', 'bulk payment', 'send prize', 'send winnings',
      'pay freelancer mpesa', 'payout mpesa',
    ],
    getResponse: () => ({
      text: `**B2C (Business to Customer)** lets you programmatically send M-PESA from your business account to any phone number. 🚀\n\nPerfect for:\n• Paying gig workers / freelancers\n• Sending game/hackathon prizes\n• Issuing refunds automatically\n• Loan disbursements (fintech apps)\n• Salary/commission payments\n\nCommand types:\n• \`SalaryPayment\` — For employee salary\n• \`BusinessPayment\` — General disbursements\n• \`PromotionPayment\` — Rewards and promotions\n\n⚠️ B2C requires **Safaricom approval** to go live — you need a registered M-PESA Org account. Test freely on sandbox first.`,
      code: {
        lang: 'javascript',
        content: `// B2C — Send money to a phone number
export const b2cPayout = async ({ phone, amount, remarks }) => {
  const token = await getDarajaToken();

  const res = await fetch(
    'https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest',
    {
      method: 'POST',
      headers: {
        Authorization: \`Bearer \${token}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        InitiatorName: process.env.INITIATOR_NAME,
        SecurityCredential: process.env.SECURITY_CREDENTIAL,
        CommandID: 'BusinessPayment',
        Amount: amount,
        PartyA: process.env.SHORTCODE,
        PartyB: phone,   // 254712345678
        Remarks: remarks || 'Payout',
        QueueTimeOutURL: process.env.TIMEOUT_URL,
        ResultURL: process.env.B2C_RESULT_URL,
        Occasion: 'Disbursement',
      }),
    }
  );
  return res.json();
};`,
      },
      followUps: [
        'What is a SecurityCredential in Daraja?',
        'How do I handle the B2C result callback?',
        'How do I apply for B2C go-live?',
      ],
    }),
  },

  // ── Going Live ─────────────────────────────────────────
  {
    topic: 'daraja_live',
    label: 'Going Live on Daraja',
    patterns: [
      'go live', 'production daraja', 'live daraja', 'daraja production',
      'sandbox to production', 'daraja live', 'real money daraja',
      'live credentials', 'daraja approval', 'get approved daraja',
    ],
    getResponse: () => ({
      text: `Going from sandbox to production — the full checklist: ✅\n\n1. **Test everything** — all flows, all edge cases, error handling\n2. **developer.safaricom.co.ke** → Your app → "Go Live" button\n3. Fill business details: M-PESA registered business, Business Reg Certificate\n4. Safaricom reviews in **3–7 business days**\n5. Once approved, swap these in your \`.env\`:\n   - Base URL: \`https://api.safaricom.co.ke\`\n   - Use your **live Consumer Key + Secret**\n   - Use your **actual Paybill/Till shortcode**\n   - Get a real **Passkey** from the portal\n\n💡 Keep your sandbox app alive for testing — **never** use live credentials in development or staging environments. Ever.`,
      followUps: [
        'What is an M-PESA Org account?',
        'How do I handle errors in production?',
        'What are Daraja rate limits?',
        'How do I monitor my payments?',
      ],
    }),
  },

  // ── M-PESA Integration General ────────────────────────
  {
    topic: 'mpesa_integration',
    label: 'Integrating M-PESA',
    patterns: [
      'integrate mpesa', 'add mpesa', 'mpesa integration', 'm-pesa integration',
      'accept mpesa payments', 'how to add mpesa', 'mpesa in my app',
      'mpesa website', 'mpesa node', 'mpesa python', 'mpesa backend',
      'mpesa for beginners', 'start mpesa integration',
    ],
    getResponse: () => ({
      text: `Adding M-PESA to your app is one of the highest-impact things you can do in Kenya. 🇰🇪\n\n**Recommended stack (2026):**\n• **Node.js + Express** — most Daraja examples use this\n• **Python + FastAPI/Django** — great alternative\n• **Frontend** → calls YOUR backend → YOUR backend calls Daraja\n\n**Never call Daraja from the frontend** — your Consumer Key/Secret would be exposed to anyone who opens DevTools.\n\n**The basic flow:**\n\`User pays → Your backend → Daraja STK Push → User's phone popup → PIN → Daraja → Your callback → Update DB\`\n\n**Useful libraries:**\n• \`mpesa-node\` (npm) — wraps Daraja cleanly\n• \`django-daraja\` (pip) — for Django projects\n• \`daraja-php\` — for PHP projects`,
      followUps: [
        'Show me STK Push code',
        'How do I set up a Node.js + Express backend?',
        'How do I handle the payment callback?',
        'How do I secure my Daraja credentials?',
      ],
    }),
  },

  // ── Safaricom Decode ───────────────────────────────────
  {
    topic: 'safaricom_decode',
    label: 'Safaricom Decode Program',
    patterns: [
      'safaricom decode', 'decode program', 'decode safaricom',
      'safaricom youth program', 'decode 2026', 'safaricom accelerator',
      'safaricom innovation', 'safaricom startup', 'safaricom developer program',
    ],
    getResponse: () => ({
      text: `**Safaricom Decode** is Safaricom's flagship tech initiative for Kenyan youth. 🌍\n\nWhat it offers:\n• **Hackathons** — Build on Safaricom APIs, win KES 500K+ prizes\n• **Internship programs** — Real engineering roles at Safaricom HQ, Nairobi\n• **Free API access** — Daraja sandbox + mentorship from Safaricom engineers\n• **Startup accelerator** — For fintech/tech startups building on Safaricom infrastructure\n• **Bootcamps** — Free technical training across Kenya\n\nEligibility: Kenyan youth 18–30, open to students and recent grads.\n\nThe **Ankino Youth Hub** connects you directly into the Decode ecosystem — opportunities, events, and community all in one place.`,
      followUps: [
        'How do I apply for Safaricom internship?',
        'What APIs can I use in the hackathon?',
        'What startups have Safaricom supported before?',
      ],
    }),
  },

  // ── Fintech Concepts ──────────────────────────────────
  {
    topic: 'fintech',
    label: 'Fintech & Mobile Money Concepts',
    patterns: [
      'fintech', 'float', 'mobile money', 'paybill vs till',
      'what is float', 'mpesa float', 'agent banking',
      'financial inclusion', 'neobank', 'digital wallet',
      'what is mobile money', 'ussd', 'kyc', 'aml',
      'transaction limits', 'mpesa limits', 'fintech startup',
    ],
    getResponse: () => ({
      text: `Fintech 101 — the African way. 🏦 These concepts matter for building on M-PESA:\n\n• **Float** — The cash/e-money an agent or business holds to process transactions. Running out of float = can't transact.\n• **Paybill** — 6-digit business number for receiving payments WITH an account reference (e.g., KPLC meter number)\n• **Till (Buy Goods)** — 6-digit number for purchases WITHOUT account reference (e.g., shop POS)\n• **USSD** — The \`*XXX#\` technology powering M-PESA menus. Works on ANY phone, no internet.\n• **KYC** — Know Your Customer — identity verification required before financial transactions. Regulatory.\n• **AML** — Anti-Money Laundering — rules that prevent illegal money flows. Your fintech must comply.\n• **API Rate Limits** — Daraja caps requests. For bulk B2C, implement a job queue (Bull/BullMQ).\n• **Chargeback** — A disputed transaction that gets reversed.\n• **Interoperability** — M-PESA can now send to Airtel Money, Equity, etc. via PesaLink/KEPSS.`,
      followUps: [
        'How do I build a USSD app?',
        'What is Africa\'s Talking USSD API?',
        'What compliance do I need for a fintech startup?',
        'How do transaction limits affect my app design?',
      ],
    }),
  },

  // ── Africa's Talking ──────────────────────────────────
  {
    topic: 'africastalking',
    label: "Africa's Talking API",
    patterns: [
      "africa's talking", 'africastalking', 'at api', 'ussd api',
      'sms api kenya', 'ussd app kenya', 'build ussd', 'at sandbox',
      'sms gateway kenya', 'airtime api', '*XXX#', 'ussd menu',
      'feature phone', 'basic phone app',
    ],
    getResponse: () => ({
      text: `**Africa's Talking (AT)** is the other essential API for Kenyan devs — it's the USSD + SMS layer for reaching feature-phone users. 📱\n\nWhat AT gives you:\n• **USSD API** — Build \`*XXX#\` menus. Works on ANY phone, no internet, no smartphone\n• **SMS API** — Send/receive SMS programmatically in Kenya\n• **Voice API** — Build IVR (press 1 for English, 2 for Swahili)\n• **Airtime API** — Send airtime programmatically (great for loyalty programs)\n\n**AT + Daraja = 100% of Kenyans reached.** Smartphones AND feature phones.\n\n**Stack tip for USSD + M-PESA:**\nUSSD collects user input → your backend → Daraja STK Push or B2C → response back via USSD\n\nSandbox: **africastalking.com** — free to test!`,
      code: {
        lang: 'javascript',
        content: `// Simple USSD app with Africa's Talking
// npm install africastalking

const AfricasTalking = require('africastalking');
const at = AfricasTalking({
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME,
});

// Express USSD handler (AT POSTs to this)
app.post('/ussd', (req, res) => {
  const { sessionId, phoneNumber, networkCode, text } = req.body;
  let response = '';

  if (text === '') {
    // First request — show main menu
    response = 'CON Welcome to Ankino Hub\\n'
             + '1. Check Opportunities\\n'
             + '2. Upcoming Events\\n'
             + '3. Contact Us';
  } else if (text === '1') {
    response = 'CON Choose type:\\n'
             + '1. Hackathons\\n'
             + '2. Internships\\n'
             + '3. Scholarships';
  } else if (text === '1*1') {
    response = 'END Next Hackathon: Safaricom API\\n'
             + 'Date: May 15-17, 2026\\n'
             + 'Prize: KES 500,000\\n'
             + 'Visit ankino.co.ke to apply';
  }
  // CON = continue (show more menus)
  // END = end session (final message)
  res.set('Content-Type', 'text/plain');
  res.send(response);
});`,
      },
      followUps: [
        'Can I combine USSD with M-PESA payments?',
        'How do I get a USSD shortcode in Kenya?',
        'What\'s the difference between AT and Daraja?',
      ],
    }),
  },

];
