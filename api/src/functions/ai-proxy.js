// ── AI API Proxy ─────────────────────────────────────────────────────────────
// Secure server-side proxy for Anthropic Claude and Google Gemini.
// Keeps API keys off the frontend. Rate-limits per IP using a simple in-memory
// counter (replace with Azure Cache for Redis at scale).
//
// Endpoints:
//   POST /api/ai/chat       → route to Claude or Gemini based on ?provider=
//   GET  /api/ai/health     → liveness probe
// ────────────────────────────────────────────────────────────────────────────

import { app } from '@azure/functions';

// ── Simple in-memory rate limiter (per invocation — good for low traffic) ────
const rateLimitMap = new Map();
const RATE_LIMIT   = 20;   // max requests per window
const RATE_WINDOW  = 60_000; // 1 minute

function checkRateLimit(ip) {
  const now    = Date.now();
  const record = rateLimitMap.get(ip) ?? { count: 0, start: now };

  if (now - record.start > RATE_WINDOW) {
    rateLimitMap.set(ip, { count: 1, start: now });
    return true;
  }

  record.count += 1;
  rateLimitMap.set(ip, record);
  return record.count <= RATE_LIMIT;
}

// ── Response helpers ─────────────────────────────────────────────────────────
const jsonOk  = (data)   => ({ status: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
const jsonErr = (msg, s) => ({ status: s ?? 400, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: msg }) });

// ── Health probe ─────────────────────────────────────────────────────────────
app.http('ai-health', {
  methods:   ['GET'],
  authLevel: 'anonymous',
  route:     'ai/health',
  handler:   async (_req, context) => {
    context.log('AI proxy health check');
    return jsonOk({
      status:    'ok',
      timestamp: new Date().toISOString(),
      providers: {
        claude: !!process.env.ANTHROPIC_API_KEY,
        gemini: !!process.env.GEMINI_API_KEY,
      },
    });
  },
});

// ── Chat endpoint ─────────────────────────────────────────────────────────────
app.http('ai-chat', {
  methods:   ['POST'],
  authLevel: 'anonymous',
  route:     'ai/chat',
  handler:   async (request, context) => {
    // ── Rate limit ───────────────────────────────────────────────────────────
    const clientIp = request.headers.get('x-forwarded-for') ?? 'unknown';
    if (!checkRateLimit(clientIp)) {
      return jsonErr('Rate limit exceeded — try again in 60 seconds', 429);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return jsonErr('Invalid JSON body', 400);
    }

    const { messages, provider = 'claude', system } = body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return jsonErr('messages[] array is required', 400);
    }

    context.log(`AI chat request — provider: ${provider}, messages: ${messages.length}`);

    // ── Route to provider ────────────────────────────────────────────────────
    if (provider === 'claude') return callClaude(messages, system, context);
    if (provider === 'gemini') return callGemini(messages, system, context);

    return jsonErr(`Unknown provider "${provider}". Use "claude" or "gemini"`, 400);
  },
});

// ── Anthropic Claude call ────────────────────────────────────────────────────
async function callClaude(messages, system, context) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return jsonErr('Anthropic API key not configured', 503);

  const SYSTEM_DEFAULT = `You are the Ankino Youth Hub AI — a knowledgeable assistant for
Kenya's youth tech ecosystem. You help developers, founders, gamers, and creators with
Safaricom Daraja/M-PESA integration, hackathons, internships, and tech careers in Kenya.
Be concise, practical, and encouraging.`;

  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method:  'POST',
    headers: {
      'Content-Type':      'application/json',
      'x-api-key':         key,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model:      'claude-3-5-haiku-20241022',  // cheapest capable model
      max_tokens: 1024,
      system:     system ?? SYSTEM_DEFAULT,
      messages,
    }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    context.error('Claude API error', err);
    return jsonErr(`Claude API error: ${resp.status}`, 502);
  }

  const data = await resp.json();
  return jsonOk({
    provider: 'claude',
    content:  data.content?.[0]?.text ?? '',
    usage:    data.usage,
  });
}

// ── Google Gemini call ───────────────────────────────────────────────────────
async function callGemini(messages, system, context) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return jsonErr('Gemini API key not configured', 503);

  const SYSTEM_DEFAULT = `You are the Ankino Youth Hub AI — a knowledgeable assistant for
Kenya's youth tech ecosystem. Help with Daraja/M-PESA, hackathons, internships, and tech careers.`;

  // Convert OpenAI-style messages to Gemini format
  const contents = messages.map(m => ({
    role:  m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const model = 'gemini-2.0-flash-lite';  // cheapest Gemini model
  const url   = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

  const resp = await fetch(url, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system ?? SYSTEM_DEFAULT }] },
      contents,
      generationConfig:  { maxOutputTokens: 1024 },
    }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    context.error('Gemini API error', err);
    return jsonErr(`Gemini API error: ${resp.status}`, 502);
  }

  const data = await resp.json();
  return jsonOk({
    provider: 'gemini',
    content:  data.candidates?.[0]?.content?.parts?.[0]?.text ?? '',
    usage:    data.usageMetadata,
  });
}
