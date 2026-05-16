// ═══════════════════════════════════════════════════════════
//  ANKINO YOUTH HUB — Batch API Queue
//  ▸ Message queue with priority + auto-flush
//  ▸ Anthropic Messages Batch API compatible format
//  ▸ Google Gemini Batch Prediction compatible format
//  ▸ Pre-warm cache with known popular queries
//  ▸ Analytics / telemetry batch sink
// ═══════════════════════════════════════════════════════════

import { cacheKey, responseCache } from './cache.js';

// ── Batch Config ──────────────────────────────────────────
export const BATCH_CONFIG = {
  maxBatchSize:  25,          // Anthropic batch max is 10K; we keep it small
  flushIntervalMs: 5_000,    // auto-flush every 5s if queue not empty
  maxRetries:    3,
  retryDelayMs:  1_000,
  prewarmEnabled: true,
};

// ── Priority levels ───────────────────────────────────────
export const Priority = Object.freeze({
  HIGH:   0,
  NORMAL: 1,
  LOW:    2,
});

// ══════════════════════════════════════════════════════════
//  Message Batch Queue
// ══════════════════════════════════════════════════════════
class BatchQueue {
  constructor(config = BATCH_CONFIG) {
    this._cfg      = config;
    this._queues   = [[], [], []];  // HIGH / NORMAL / LOW
    this._pending  = new Map();     // requestId → { resolve, reject, meta }
    this._flushing = false;
    this._timer    = null;
    this._stats    = { submitted: 0, completed: 0, failed: 0, cacheHits: 0 };
    this._startFlushTimer();
  }

  // ── Enqueue a chat message ─────────────────────────────
  /**
   * Add a message to the batch queue.
   * Returns a Promise that resolves with the bot response.
   *
   * @param {string}  input    - User message text
   * @param {object}  context  - { history, userType }
   * @param {number}  priority - Priority.HIGH | NORMAL | LOW
   */
  enqueue(input, context = {}, priority = Priority.NORMAL) {
    // Fast path: LRU cache hit — skip queue entirely
    const key = cacheKey(input);
    const cached = responseCache.get(key);
    if (cached) {
      this._stats.cacheHits++;
      return Promise.resolve({ ...cached, _fromCache: true });
    }

    const requestId = `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    return new Promise((resolve, reject) => {
      this._pending.set(requestId, { resolve, reject, input, context, meta: { retries: 0 } });
      this._queues[priority].push(requestId);
      this._stats.submitted++;

      // If HIGH priority, flush immediately
      if (priority === Priority.HIGH) this.flush();
    });
  }

  // ── Flush — process all queued messages ───────────────
  async flush() {
    if (this._flushing || this._totalQueued() === 0) return;
    this._flushing = true;

    const batch = this._dequeue(this._cfg.maxBatchSize);
    if (!batch.length) { this._flushing = false; return; }

    try {
      await this._processBatch(batch);
    } finally {
      this._flushing = false;
      // Continue flushing if more items remain
      if (this._totalQueued() > 0) this.flush();
    }
  }

  // ── Internal: process one batch using local NLP ────────
  // When migrating to Claude/Gemini, replace this with an API call.
  async _processBatch(requestIds) {
    // Import lazily to avoid circular dep at module load time
    const { respond } = await import('../components/brain.js');

    for (const requestId of requestIds) {
      const item = this._pending.get(requestId);
      if (!item) continue;

      try {
        const response = respond(item.input, item.context);
        const key = cacheKey(item.input);
        responseCache.set(key, response);

        item.resolve(response);
        this._stats.completed++;
      } catch (err) {
        if (item.meta.retries < this._cfg.maxRetries) {
          item.meta.retries++;
          // Re-queue at same priority (retry)
          this._queues[Priority.HIGH].unshift(requestId);
          continue;
        }
        item.reject(err);
        this._stats.failed++;
      } finally {
        this._pending.delete(requestId);
      }
    }
  }

  // ── Dequeue up to `n` request IDs (HIGH first) ────────
  _dequeue(n) {
    const result = [];
    for (let p = 0; p < 3 && result.length < n; p++) {
      while (this._queues[p].length && result.length < n) {
        result.push(this._queues[p].shift());
      }
    }
    return result;
  }

  _totalQueued() {
    return this._queues.reduce((s, q) => s + q.length, 0);
  }

  _startFlushTimer() {
    this._timer = setInterval(() => this.flush(), this._cfg.flushIntervalMs);
  }

  stats() { return { ...this._stats, queued: this._totalQueued() }; }

  destroy() {
    clearInterval(this._timer);
    this._pending.clear();
    this._queues = [[], [], []];
  }
}

// ── Singleton batch queue ──────────────────────────────────
export const batchQueue = new BatchQueue();

// ══════════════════════════════════════════════════════════
//  Anthropic Messages Batch API Format Builders
//  https://docs.anthropic.com/en/api/creating-message-batches
// ══════════════════════════════════════════════════════════

/**
 * Build an Anthropic-compatible batch request body.
 *
 * @param {Array<{id, userMessage, systemPrompt, history}>} items
 * @returns {object}  — POST to /v1/messages/batches
 */
export function buildAnthropicBatch(items, model = 'claude-3-5-haiku-20241022') {
  return {
    requests: items.map((item) => ({
      custom_id: item.id,
      params: {
        model,
        max_tokens: 1024,
        system: [
          {
            type: 'text',
            text: item.systemPrompt || buildAnkinoSystemPrompt(),
            cache_control: { type: 'ephemeral' },
          },
        ],
        messages: [
          ...( item.history || []).map((t) => ({
            role:    t.role === 'bot' ? 'assistant' : 'user',
            content: t.text,
          })),
          { role: 'user', content: item.userMessage },
        ],
      },
    })),
  };
}

/**
 * Parse an Anthropic batch results JSONL stream into a Map
 * of { custom_id → responseText }.
 */
export function parseAnthropicBatchResults(jsonlText) {
  const results = new Map();
  for (const line of jsonlText.split('\n').filter(Boolean)) {
    try {
      const obj = JSON.parse(line);
      if (obj.result?.type === 'succeeded') {
        const text = obj.result.message.content[0]?.text ?? '';
        results.set(obj.custom_id, text);
      } else {
        results.set(obj.custom_id, null);
      }
    } catch { /* skip malformed lines */ }
  }
  return results;
}

// ══════════════════════════════════════════════════════════
//  Gemini Batch Prediction Format Builders
//  https://ai.google.dev/gemini-api/docs/batch
// ══════════════════════════════════════════════════════════

/**
 * Build a Gemini Batch Prediction input for JSONL-based batch jobs.
 * Each line = one prediction request.
 */
export function buildGeminiBatchJSONL(items, model = 'gemini-2.0-flash') {
  return items.map((item) => JSON.stringify({
    key: item.id,
    request: {
      model: `models/${model}`,
      contents: [
        { role: 'user',  parts: [{ text: item.userMessage }] },
      ],
      systemInstruction: {
        parts: [{ text: item.systemPrompt || buildAnkinoSystemPrompt() }],
      },
      generationConfig: { temperature: 0.7, maxOutputTokens: 512 },
    },
  })).join('\n');
}

// ══════════════════════════════════════════════════════════
//  Cache Pre-warming
//  Pre-compute responses for the most popular queries so
//  first-time users get instant answers.
// ══════════════════════════════════════════════════════════

const PREWARM_QUERIES = [
  'How do I integrate M-PESA?',
  'Show me hackathons in Kenya',
  'Tell me about Daraja API',
  'Career paths in tech Kenya',
  'Freelancing tips for devs',
  'What is STK Push?',
  'How do I learn React?',
  'Tell me about internships',
  'What is Git?',
  'How do I deploy my app?',
];

/**
 * Pre-warm the LRU cache with popular queries.
 * Called once at app boot (non-blocking — uses setTimeout 0).
 */
export async function prewarmCache() {
  if (!BATCH_CONFIG.prewarmEnabled) return;

  // Defer so it doesn't block initial render
  await new Promise((r) => setTimeout(r, 0));

  const { respond } = await import('../components/brain.js');

  for (const q of PREWARM_QUERIES) {
    const key = cacheKey(q);
    if (!responseCache.get(key)) {
      try {
        const response = respond(q);
        responseCache.set(key, response);
      } catch { /* non-fatal */ }
    }
  }
}

// ══════════════════════════════════════════════════════════
//  Analytics Batch Sink
//  Accumulate chat events and flush in bulk (privacy-safe).
// ══════════════════════════════════════════════════════════

const analyticsBuffer = [];
const ANALYTICS_FLUSH_SIZE = 20;

/**
 * Record an analytics event.
 * Events are batched and flushed when the buffer fills.
 */
export function trackEvent(type, data = {}) {
  analyticsBuffer.push({
    type,
    ts:   Date.now(),
    data: sanitiseAnalytics(data),
  });

  if (analyticsBuffer.length >= ANALYTICS_FLUSH_SIZE) {
    flushAnalytics();
  }
}

/** Strip PII before logging. */
function sanitiseAnalytics(data) {
  const safe = { ...data };
  delete safe.phone;
  delete safe.email;
  delete safe.name;
  // Truncate long text fields
  for (const k of Object.keys(safe)) {
    if (typeof safe[k] === 'string' && safe[k].length > 120) {
      safe[k] = `${safe[k].slice(0, 120)}…`;
    }
  }
  return safe;
}

/**
 * Flush analytics buffer.
 * In production, replace `console.debug` with a fetch to your analytics endpoint.
 */
export function flushAnalytics() {
  if (!analyticsBuffer.length) return;
  const events = analyticsBuffer.splice(0);
  // TODO: replace with POST to /api/analytics in production
  if (import.meta.env?.DEV) {
    console.debug('[Ankino Analytics]', events);
  }
}

// Flush on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushAnalytics();
  });
}

// ── Ankino system prompt (for API migration) ──────────────
export function buildAnkinoSystemPrompt() {
  return `You are Ankino AI — a tech mentor and Safaricom ecosystem guide for Kenyan youth aged 18–30.

You help with:
- Safaricom Daraja API: STK Push, C2B, B2C, OAuth, callbacks
- Web & mobile development: JavaScript, React, Flutter, HTML/CSS, Git
- Kenya opportunities: Hackathons, internships, scholarships, portfolio advice
- Career & freelancing: Salary benchmarks, remote work, Upwork/Fiverr
- Startup ecosystem: Funding, accelerators (Nailab, Antler, MEST Africa)
- Debugging & troubleshooting: Common errors, CORS, async/await

Tone: Enthusiastic, Swahili-aware (use "Niaje!", "Poa", "Fanya"), practical, encouraging.
Always provide working code examples where relevant.
Founded by Ian Kinoti · Powered by Safaricom.`;
}
