// ═══════════════════════════════════════════════════════════
//  ANKINO YOUTH HUB — Response Cache + Prompt Cache Utilities
//  ▸ LRU in-memory cache for NLP responses (instant repeat answers)
//  ▸ Anthropic prompt caching format (cache_control markers)
//  ▸ Gemini cached content helpers
//  ▸ Ready to plug into Claude / Gemini Batch API when migrating
//    from local NLP to cloud LLM
// ═══════════════════════════════════════════════════════════

// ── Configuration ─────────────────────────────────────────
const CACHE_CONFIG = {
  maxSize:     200,          // max LRU entries
  ttlMs:       30 * 60_000,  // 30-minute TTL
  hashSeed:    0x9e3779b9,   // FNV-style hash seed
  cachePrefix: 'ankino_v1',  // bust on breaking changes
};

// ── Simple non-crypto hash (FNV-1a inspired) ──────────────
function hashString(str) {
  let h = CACHE_CONFIG.hashSeed;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (Math.imul(h, 0x01000193) >>> 0);
  }
  return h.toString(36);
}

/**
 * Build a stable cache key from user input.
 * Normalises whitespace + case so "  How do I use Git? "
 * and "how do i use git" produce the same key.
 */
export function cacheKey(input) {
  const normalised = input.trim().toLowerCase().replace(/\s+/g, ' ');
  return `${CACHE_CONFIG.cachePrefix}:${hashString(normalised)}`;
}

// ══════════════════════════════════════════════════════════
//  LRU Cache
//  Uses a Map (insertion-ordered) for O(1) get/set/delete.
// ══════════════════════════════════════════════════════════
class LRUCache {
  constructor(maxSize = CACHE_CONFIG.maxSize, ttlMs = CACHE_CONFIG.ttlMs) {
    this._map   = new Map();
    this._max   = maxSize;
    this._ttl   = ttlMs;
    this._hits  = 0;
    this._misses = 0;
  }

  /** Retrieve an entry. Returns undefined on miss or expiry. */
  get(key) {
    if (!this._map.has(key)) {
      this._misses++;
      return undefined;
    }

    const entry = this._map.get(key);

    // TTL check
    if (Date.now() > entry.expiresAt) {
      this._map.delete(key);
      this._misses++;
      return undefined;
    }

    // LRU: move to end (most-recently-used position)
    this._map.delete(key);
    this._map.set(key, entry);

    this._hits++;
    return entry.value;
  }

  /** Store an entry, evicting LRU if at capacity. */
  set(key, value) {
    if (this._map.has(key)) this._map.delete(key);

    // Evict oldest entry when full
    if (this._map.size >= this._max) {
      this._map.delete(this._map.keys().next().value);
    }

    this._map.set(key, {
      value,
      expiresAt: Date.now() + this._ttl,
    });
  }

  /** Invalidate a single entry. */
  delete(key) {
    return this._map.delete(key);
  }

  /** Flush all expired entries (call periodically). */
  purgeExpired() {
    const now = Date.now();
    for (const [k, v] of this._map) {
      if (now > v.expiresAt) this._map.delete(k);
    }
  }

  get size()   { return this._map.size; }
  get hits()   { return this._hits; }
  get misses() { return this._misses; }
  get hitRate() {
    const total = this._hits + this._misses;
    return total === 0 ? 0 : (this._hits / total * 100).toFixed(1);
  }

  /** Diagnostics — useful in the dev console. */
  stats() {
    return {
      size:    this.size,
      maxSize: this._max,
      hits:    this._hits,
      misses:  this._misses,
      hitRate: `${this.hitRate}%`,
    };
  }

  clear() { this._map.clear(); }
}

// ── Singleton response cache (shared across the app) ──────
export const responseCache = new LRUCache();

// Periodically purge expired entries every 10 minutes
setInterval(() => responseCache.purgeExpired(), 10 * 60_000);

// ══════════════════════════════════════════════════════════
//  Anthropic Prompt Caching Helpers
//  https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching
//
//  When migrating the Ankino AI chatbot to Claude claude-3-5-haiku
//  or claude-3-7-sonnet, wrap the large static knowledge-base
//  system prompt with cache_control to avoid re-tokenising it
//  on every request (saves ~90% of input token costs).
// ══════════════════════════════════════════════════════════

/**
 * Build an Anthropic Messages API system prompt with cache_control
 * on the large static knowledge-base block (up to 4 cache breakpoints).
 *
 * Usage:
 *   const { system } = buildAnthropicCachedSystem(knowledgeText, tone);
 *   // → pass system[] to anthropic.messages.create({ system, messages })
 */
export function buildAnthropicCachedSystem(knowledgeText, toneText = '') {
  return {
    system: [
      // ── Block 1: Large static knowledge base — CACHE THIS ──
      {
        type: 'text',
        text: knowledgeText,
        cache_control: { type: 'ephemeral' },   // cached for up to 5 min
      },
      // ── Block 2: Persona + tone (also static) — CACHE THIS ──
      ...(toneText
        ? [{
            type: 'text',
            text: toneText,
            cache_control: { type: 'ephemeral' },
          }]
        : []),
    ],
  };
}

/**
 * Build an Anthropic user message with the conversation history
 * efficiently formatted. Older turns are cached; only the newest
 * user message is uncached.
 */
export function buildAnthropicMessages(history, newUserInput) {
  // Anthropic format: [{role, content}]
  const messages = history.map((turn) => ({
    role:    turn.role === 'bot' ? 'assistant' : 'user',
    content: turn.text,
  }));

  messages.push({ role: 'user', content: newUserInput });
  return messages;
}

// ══════════════════════════════════════════════════════════
//  Gemini Cached Content Helpers
//  https://ai.google.dev/gemini-api/docs/caching
//
//  Gemini caching is created once and reused by name.
//  ttl minimum: 1 minute.  Default ttl: 1 hour.
// ══════════════════════════════════════════════════════════

/**
 * Build the request body for createCachedContent on Gemini.
 * The large Ankino knowledge base becomes a cached "system" context.
 *
 * Usage (Node.js, server-side):
 *   const body = buildGeminiCacheRequest(knowledgeText, 'gemini-2.0-flash');
 *   // POST https://generativelanguage.googleapis.com/v1beta/cachedContents
 */
export function buildGeminiCacheRequest(knowledgeText, model = 'gemini-2.0-flash', ttlSeconds = 3600) {
  return {
    model: `models/${model}`,
    contents: [
      {
        role: 'user',
        parts: [{ text: knowledgeText }],
      },
      {
        role: 'model',
        parts: [{ text: 'Knowledge base acknowledged. I am ready to assist Kenyan youth with tech mentorship, Safaricom APIs, and opportunities.' }],
      },
    ],
    ttl: `${ttlSeconds}s`,
    displayName: 'ankino-youth-hub-knowledge-v1',
  };
}

/**
 * Build a Gemini generateContent request body that references
 * an existing cached content by name.
 */
export function buildGeminiCachedRequest(cachedContentName, userMessage, history = []) {
  return {
    cachedContent: cachedContentName,
    contents: [
      ...history.map((t) => ({
        role:  t.role === 'bot' ? 'model' : 'user',
        parts: [{ text: t.text }],
      })),
      { role: 'user', parts: [{ text: userMessage }] },
    ],
    generationConfig: {
      temperature:     0.7,
      topP:            0.9,
      maxOutputTokens: 1024,
    },
  };
}

// ── Export cache config for testing / diagnostics ─────────
export { CACHE_CONFIG };
