// ═══════════════════════════════════════════════════════════
//  ANKINO YOUTH HUB — AI Brain (NLP Engine + Context Tracker)
//  ▸ Local NLP classifier with topic scoring
//  ▸ LRU response caching (via src/lib/cache.js)
//  ▸ Smart context window — topic-relevance pruning
//  ▸ Prompt cache format ready for Claude/Gemini migration
// ═══════════════════════════════════════════════════════════
import { SAFARICOM_KNOWLEDGE } from '../data/knowledge/safaricom.js';
import { TECH_KNOWLEDGE }       from '../data/knowledge/tech.js';
import { KENYA_KNOWLEDGE }      from '../data/knowledge/kenya.js';
import { COMMON_KNOWLEDGE }     from '../data/knowledge/common.js';
import { WHAT_IS_DICT }         from '../data/knowledge/whatisdict.js';
import { responseCache, cacheKey } from '../lib/cache.js';

// ── All knowledge entries (flat) ──────────────────────────
const ALL_ENTRIES = [
  ...SAFARICOM_KNOWLEDGE,
  ...TECH_KNOWLEDGE,
  ...KENYA_KNOWLEDGE,
  ...COMMON_KNOWLEDGE,
];

// Pre-build a topic → entry map for O(1) lookups
const TOPIC_MAP = Object.fromEntries(ALL_ENTRIES.map((e) => [e.topic, e]));

// ── Conversation context (singleton) ──────────────────────
export const ctx = {
  history:      [],   // [{ role: 'user'|'bot', text, topic? }]
  currentTopic: null, // last matched topic key
  lastEntry:    null, // last matched knowledge entry
  userType:     null, // 'dev' | 'founder' | 'creator' | 'gamer' | null
  turnCount:    0,
};

// ── Context window config ─────────────────────────────────
const CTX_CONFIG = {
  hardMax:   8,   // absolute max history turns kept
  topicBoost: 3,  // extra turns kept when topic is consistent
};

// ── Detect user archetype ──────────────────────────────────
function detectUserType(input) {
  const t = input.toLowerCase();
  if (/startup|founder|investor|raise|pitch|business plan|mvp|accelerator|funding/.test(t))             return 'founder';
  if (/game|gaming|unity|godot|gamedev|game jam|nairobi gamejam/.test(t))                                return 'gamer';
  if (/design|figma|creative|content|media|art|music|creator/.test(t))                                  return 'creator';
  if (/freelanc|upwork|fiverr|remote work|remote job|salary|internship|attachment|portfolio|hackathon|career/.test(t)) return 'dev';
  if (/code|dev|html|css|js|react|python|api|git|backend|debug|error/.test(t))                          return 'dev';
  return null;
}

// ── Scoring — longer + more matches = higher confidence ───
function scoreEntry(input, entry) {
  const lower = input.toLowerCase();
  let score = 0;

  for (const pattern of entry.patterns) {
    if (lower.includes(pattern.toLowerCase())) {
      score += pattern.split(' ').length * 3 + pattern.length;
    }
  }

  // Boost if continuing the same topic thread (only when there's already a match)
  if (ctx.currentTopic && entry.topic === ctx.currentTopic && score > 0) {
    score += 2;
  }

  // Boost if topic relates to detected user type
  const typeTopics = {
    dev:     ['javascript', 'react', 'git', 'apis', 'html_css', 'databases', 'deployment',
              'troubleshooting', 'career_guidance', 'internship_prep', 'portfolio',
              'remote_work', 'freelancing', 'hackathons_kenya'],
    founder: ['projects', 'learning_path', 'fintech', 'mpesa_integration', 'daraja',
              'startup_intel', 'startup_culture_kenya', 'networking_kenya'],
    gamer:   ['javascript', 'mobile_dev', 'ui_ux', 'hackathons_kenya'],
    creator: ['ui_ux', 'html_css', 'mobile_dev', 'portfolio', 'freelancing', 'networking_kenya'],
  };
  if (ctx.userType && typeTopics[ctx.userType]?.includes(entry.topic)) {
    score += 2;
  }

  return score;
}

// ── Classify input → best matching entry ──────────────────
export function classify(input) {
  let bestScore = 0;
  let bestEntry = null;

  for (const entry of ALL_ENTRIES) {
    const score = scoreEntry(input, entry);
    if (score > bestScore) {
      bestScore = score;
      bestEntry = entry;
    }
  }

  return bestScore >= 3 ? bestEntry : null;
}

// ── "What is X?" semantic catch-all ───────────────────────
function whatIs(input) {
  const lower = input.toLowerCase().trim();

  const patterns = [
    /what(?:'s| is) (?:a |an |the )?(.+?)[?.!]?$/,
    /explain (?:a |an |the )?(.+?)[?.!]?$/,
    /define (?:a |an |the )?(.+?)[?.!]?$/,
    /tell me about (?:a |an |the )?(.+?)[?.!]?$/,
    /how does? (?:a |an |the )?(.+?) work[?.!]?$/,
  ];

  let term = null;
  for (const re of patterns) {
    const m = lower.match(re);
    if (m) { term = m[1].trim(); break; }
  }
  if (!term) return null;

  // Direct lookup
  if (WHAT_IS_DICT[term]) return WHAT_IS_DICT[term];

  // Partial match
  for (const [key, val] of Object.entries(WHAT_IS_DICT)) {
    if (term.includes(key) || key.includes(term)) return val;
  }

  return null;
}

// ── Smart context pruning ─────────────────────────────────
/**
 * Keep the most relevant turns from history.
 * Strategy:
 *   1. Always keep the last `hardMax / 2` turns (recency)
 *   2. From the older turns, keep only those matching the current topic
 *   3. Never exceed `hardMax` total
 */
function pruneHistory(history, currentTopic) {
  const { hardMax } = CTX_CONFIG;
  if (history.length <= hardMax) return history;

  const recentCount = Math.ceil(hardMax / 2);                  // always keep these
  const recent  = history.slice(-recentCount);
  const older   = history.slice(0, -recentCount);

  // From older turns, keep topic-matching ones up to remaining budget
  const budget  = hardMax - recentCount;
  const relevant = older.filter((t) => t.topic === currentTopic).slice(-budget);

  return [...relevant, ...recent];
}

// ── Fallback responses ────────────────────────────────────
const FALLBACKS = [
  {
    text: `Hmm, sijui hiyo sana 🤔 — but I'm your **Ankino AI** tech mentor! Here's what I know deeply:\n\n• **Daraja API & M-PESA** — STK Push, C2B, B2C, OAuth, callbacks\n• **Web & mobile dev** — JavaScript, React, Flutter, HTML/CSS, Git\n• **Kenya opportunities** — Hackathons, internships, portfolio tips\n• **Career & freelancing** — Salary benchmarks, remote work, Upwork\n• **Startup ecosystem** — Funding, accelerators, Silicon Savannah intel\n• **Debugging & troubleshooting** — When your code breaks at 2am\n\nTry: *"Show me hackathons in Kenya"*, *"How do I get a freelance client?"*, or *"Teach me STK Push"* 💡`,
    followUps: ['Show me hackathons in Kenya', 'How do I integrate M-PESA?', 'Career advice for Kenyan devs'],
  },
  {
    text: `That one's a bit outside my knowledge base right now, but niko hapa! I specialise in:\n\n• **Safaricom ecosystem** — Daraja, STK Push, C2B, B2C\n• **Tech mentorship** — JS, React, Git, APIs, databases, security\n• **Kenya youth opportunities** — Hackathons, internships, remote work, freelancing\n• **Startup intelligence** — Nailab, Antler, MEST Africa, funding stages\n• **Career guidance** — Salaries, roadmaps, what Kenyan companies want\n\nWhat can I help you with?`,
    followUps: ['Tell me about Daraja API', 'Show me career paths in tech', 'How do I find a tech internship?'],
  },
];

// ── Proactive prompts after 3+ turns ──────────────────────
const PROACTIVE_PROMPTS = {
  dev:     'Unaonekana una skills nzuri — want me to show you how to turn that into freelance income or a remote job?',
  founder: 'Building something? I can walk you through Kenya\'s startup funding landscape — from pre-seed to Series A.',
  gamer:   'Into game dev? The Nairobi GameJam is a great entry point — want tips on how to prepare?',
  creator: 'Creative energy detected! Want to know how to monetise your skills through freelancing or a portfolio site?',
};

// ── Main respond function ──────────────────────────────────
export function respond(input) {
  // ── 1. Cache lookup (fast path) ──────────────────────
  const key = cacheKey(input);
  const cached = responseCache.get(key);
  if (cached) return { ...cached, _fromCache: true };

  // ── 2. Update state ───────────────────────────────────
  ctx.turnCount++;

  const detected = detectUserType(input);
  if (detected && !ctx.userType) ctx.userType = detected;

  ctx.history.push({ role: 'user', text: input, topic: ctx.currentTopic });

  // ── 3. Classify input ─────────────────────────────────
  const entry = classify(input);

  let response;

  if (entry) {
    ctx.currentTopic = entry.topic;
    ctx.lastEntry    = entry;
    response         = entry.getResponse(ctx);

    // Proactive nudge on 4th turn
    if (ctx.turnCount === 4 && ctx.userType && PROACTIVE_PROMPTS[ctx.userType]) {
      response.proactive = PROACTIVE_PROMPTS[ctx.userType];
    }

  } else {
    // ── 4. Semantic "what is X?" fallback ──────────────
    const quickDef = whatIs(input);
    if (quickDef) {
      ctx.currentTopic = quickDef.topic || null;
      const relatedEntry = TOPIC_MAP[quickDef.topic];
      response = {
        text:      quickDef.text,
        followUps: relatedEntry
          ? relatedEntry.getResponse(ctx).followUps
          : ['Teach me JavaScript', 'What is an API?', 'Show me career paths in tech'],
      };
    } else {
      // ── 5. Generic fallback ─────────────────────────
      response = FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
    }
  }

  // ── 6. Store in history + prune context ──────────────
  ctx.history.push({ role: 'bot', text: response.text, topic: ctx.currentTopic });
  ctx.history = pruneHistory(ctx.history, ctx.currentTopic);

  // ── 7. Cache the response ─────────────────────────────
  responseCache.set(key, response);

  return response;
}

// ── Diagnostics (dev console) ─────────────────────────────
export function getCacheStats()   { return responseCache.stats(); }
export function getContextState() { return { ...ctx, historyLength: ctx.history.length }; }
export function resetContext()    {
  ctx.history      = [];
  ctx.currentTopic = null;
  ctx.lastEntry    = null;
  ctx.userType     = null;
  ctx.turnCount    = 0;
  responseCache.clear();
}
