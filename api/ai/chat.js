// ── AI Chat Proxy — Vercel Edge Function ─────────────────────────────────────
// Ported from api/src/functions/ai-proxy.js (Azure Functions v4 → Vercel Edge).
// Same request/response contract as the Azure version, so the frontend
// (src/components/chatbot.js) needs no changes.
//
// Route: POST /api/ai/chat
// ────────────────────────────────────────────────────────────────────────────

export const config = { runtime: 'edge' };

// ── Simple in-memory rate limiter (per edge instance — good for low traffic) ─
const rateLimitMap = new Map();
const RATE_LIMIT = 20;
const RATE_WINDOW = 60_000;

function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip) ?? { count: 0, start: now };

  if (now - record.start > RATE_WINDOW) {
    rateLimitMap.set(ip, { count: 1, start: now });
    return true;
  }

  record.count += 1;
  rateLimitMap.set(ip, record);
  return record.count <= RATE_LIMIT;
}

const jsonOk = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
const jsonErr = (msg, status = 400) =>
  new Response(JSON.stringify({ error: msg }), { status, headers: { 'Content-Type': 'application/json' } });

// ── Profile-aware system prompts ─────────────────────────────────────────────
const PROFILE_PROMPTS = {
  developer: `You are Ankino AI — a senior developer mentor for Kenyan youth aged 18–30.
Your user is a DEVELOPER. Focus on:
- Safaricom Daraja API: STK Push, C2B, B2C, OAuth 2.0, webhooks, sandbox testing
- Full-stack web: JavaScript (ES2024), TypeScript, React 18, Node.js, REST & GraphQL APIs
- Mobile: Flutter, React Native, Kotlin basics
- DevOps: Git, GitHub Actions, Docker, Azure Static Web Apps, Vercel, Railway
- Databases: Firebase Firestore, PostgreSQL, MongoDB Atlas
- Security: CORS, JWT, HTTPS, environment secrets management
- Career: Kenyan salary benchmarks, remote work, portfolio building, Upwork/Fiverr

Tone: Technical, precise, uses code examples (always runnable). Swahili-aware ("Niaje!", "Poa", "Fanya").
Founded by ANKINO DEVELOPERS · Powered by Safaricom.`,

  creator: `You are Ankino AI — a creative mentor for Kenyan youth aged 18–30.
Your user is a CREATOR (designer, content creator, digital artist, media professional). Focus on:
- UI/UX design: Figma, Adobe XD, design systems, colour theory, typography
- Content creation: YouTube, TikTok, Instagram growth strategies for Kenyan audiences
- Digital tools: Canva Pro, Adobe Premiere, DaVinci Resolve, CapCut
- Monetisation: Brand deals, sponsored content, digital products, Patreon, Ko-fi
- Portfolio: Building an online presence, personal branding, Behance, Dribbble
- Kenya creative scene: Opportunities, collectives, events, Nairobi Art Week
- Freelancing: How to price creative work in KES and USD, contracts, client management

Tone: Encouraging, aesthetic, culturally relevant. Swahili-aware.
Founded by ANKINO DEVELOPERS · Powered by Safaricom.`,

  gamer: `You are Ankino AI — a gaming & esports mentor for Kenyan youth aged 18–30.
Your user is a GAMER. Focus on:
- Esports: Kenyan gaming tournaments, KEPSA, Nairobi GameJam, Africa Cup
- Game development: Unity (C#), Godot (GDScript), Pygame, game jam participation
- Streaming: OBS Studio setup, Twitch/YouTube Gaming, building an audience
- PC/mobile gaming: Hardware recommendations on a Kenya budget, internet optimisation
- Game monetisation: In-app purchases, Patreon, sponsorships, prize pools
- Tech crossover: How gaming skills translate to programming, UI/UX, 3D modelling
- Community: Finding Kenya gaming communities, Discord servers, LAN events Nairobi

Tone: Energetic, uses gaming language naturally. Swahili-aware. Hype but accurate.
Founded by ANKINO DEVELOPERS · Powered by Safaricom.`,

  founder: `You are Ankino AI — a startup & entrepreneurship mentor for Kenyan youth aged 18–30.
Your user is a FOUNDER. Focus on:
- Kenya startup ecosystem: Silicon Savannah, iHub, Nailab, Antler EA, MEST Africa
- Funding stages: Pre-seed grants (GSMA, Safaricom Spark), seed, Series A in Africa context
- M-PESA business integration: STK Push for payments, B2C for payouts, Daraja sandbox
- Legal: Business registration in Kenya (eCitizen), IP basics, co-founder agreements
- Product: MVP strategy, customer discovery in Kenya, solving real Kenyan problems
- Pitch: Deck structure, investor networks (DOB Equity, TLcom, Founders Factory Africa)
- Operations: Team building, equity splits, remote-first teams, hiring on a budget

Tone: Strategic, business-minded, uses real Kenya market data. Swahili-aware.
Founded by ANKINO DEVELOPERS · Powered by Safaricom.`,

  default: `You are Ankino AI — a tech mentor and Safaricom ecosystem guide for Kenyan youth aged 18–30.
You help developers, founders, gamers, and creators with:
- Safaricom Daraja/M-PESA integration, hackathons, internships, and tech careers in Kenya.
Be concise, practical, and encouraging. Swahili-aware ("Niaje!", "Poa").
Founded by ANKINO DEVELOPERS · Powered by Safaricom.`,
};

function getSystemPrompt(userProfile) {
  return PROFILE_PROMPTS[userProfile] ?? PROFILE_PROMPTS.default;
}

// ── Anthropic Claude call — WITH prompt caching ──────────────────────────────
async function callClaude(messages, system, userProfile) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return jsonErr('Anthropic API key not configured', 503);

  const systemText = system ?? getSystemPrompt(userProfile);
  const systemBlocks = [{ type: 'text', text: systemText, cache_control: { type: 'ephemeral' } }];

  let resp;
  try {
    resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'prompt-caching-2024-07-31',
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 1024,
        system: systemBlocks,
        messages,
      }),
    });
  } catch {
    return jsonErr('Network error reaching Claude API', 502);
  }

  if (!resp.ok) return jsonErr(`Claude API error: ${resp.status}`, 502);

  const data = await resp.json();
  return jsonOk({
    provider: 'claude',
    content: data.content?.[0]?.text ?? '',
    usage: data.usage,
    cache: {
      cacheCreationInputTokens: data.usage?.cache_creation_input_tokens ?? 0,
      cacheReadInputTokens: data.usage?.cache_read_input_tokens ?? 0,
    },
  });
}

// ── Google Gemini call — WITH cached content support ─────────────────────────
async function callGemini(messages, system, userProfile) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return jsonErr('Gemini API key not configured', 503);

  const systemText = system ?? getSystemPrompt(userProfile);
  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const model = 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

  const reqBody = {
    contents,
    generationConfig: { maxOutputTokens: 1024, temperature: 0.7, topP: 0.9 },
  };

  const geminiCacheName = process.env.GEMINI_CACHE_NAME;
  if (geminiCacheName) {
    reqBody.cachedContent = geminiCacheName;
  } else {
    reqBody.systemInstruction = { parts: [{ text: systemText }] };
  }

  let resp;
  try {
    resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqBody),
    });
  } catch {
    return jsonErr('Network error reaching Gemini API', 502);
  }

  if (!resp.ok) return jsonErr(`Gemini API error: ${resp.status}`, 502);

  const data = await resp.json();
  const usageMeta = data.usageMetadata ?? {};
  return jsonOk({
    provider: 'gemini',
    content: data.candidates?.[0]?.content?.parts?.[0]?.text ?? '',
    usage: usageMeta,
    cachedTokens: usageMeta.cachedContentTokenCount ?? 0,
  });
}

export default async function handler(request) {
  if (request.method !== 'POST') return jsonErr('Method not allowed', 405);

  const clientIp = request.headers.get('x-forwarded-for') ?? 'unknown';
  if (!checkRateLimit(clientIp)) return jsonErr('Rate limit exceeded — try again in 60 seconds', 429);

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonErr('Invalid JSON body', 400);
  }

  const { messages, provider = 'gemini', system, userProfile = 'default' } = body;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return jsonErr('messages[] array is required', 400);
  }

  if (provider === 'claude') return callClaude(messages, system, userProfile);
  if (provider === 'gemini') return callGemini(messages, system, userProfile);

  return jsonErr(`Unknown provider "${provider}". Use "claude" or "gemini"`, 400);
}
