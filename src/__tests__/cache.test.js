// ═══════════════════════════════════════════════════════════
//  Tests — src/lib/cache.js
// ═══════════════════════════════════════════════════════════
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  cacheKey,
  responseCache,
  buildAnthropicCachedSystem,
  buildAnthropicMessages,
  buildGeminiCacheRequest,
  buildGeminiCachedRequest,
  CACHE_CONFIG,
} from '../lib/cache.js';

// ── cacheKey ──────────────────────────────────────────────
describe('cacheKey()', () => {
  it('normalises case', () => {
    expect(cacheKey('How do I use Git?')).toBe(cacheKey('how do i use git?'));
  });

  it('normalises whitespace', () => {
    expect(cacheKey('  hello  world  ')).toBe(cacheKey('hello world'));
  });

  it('produces different keys for different inputs', () => {
    expect(cacheKey('daraja api')).not.toBe(cacheKey('stk push'));
  });

  it('includes the prefix', () => {
    expect(cacheKey('test')).toMatch(new RegExp(`^${CACHE_CONFIG.cachePrefix}:`));
  });
});

// ── responseCache (LRU) ───────────────────────────────────
describe('responseCache', () => {
  beforeEach(() => responseCache.clear());

  it('returns undefined for a miss', () => {
    expect(responseCache.get('no-such-key')).toBeUndefined();
  });

  it('stores and retrieves a value', () => {
    responseCache.set('k1', { text: 'hello' });
    expect(responseCache.get('k1')).toEqual({ text: 'hello' });
  });

  it('tracks hits and misses', () => {
    responseCache.set('k2', { text: 'world' });
    responseCache.get('k2');           // hit
    responseCache.get('k2');           // hit
    responseCache.get('miss-key');     // miss

    expect(responseCache.hits).toBeGreaterThanOrEqual(2);
    expect(responseCache.misses).toBeGreaterThanOrEqual(1);
  });

  it('evicts LRU entry when at capacity', () => {
    // Create a tiny cache
    const { LRUCache } = (() => {
      // Inline mini-cache for isolation
      const map = new Map();
      const max = 3;
      const set = (k, v) => {
        if (map.has(k)) map.delete(k);
        if (map.size >= max) map.delete(map.keys().next().value);
        map.set(k, v);
      };
      const get = (k) => map.get(k);
      return { LRUCache: { set, get, size: () => map.size } };
    })();

    LRUCache.set('a', 1);
    LRUCache.set('b', 2);
    LRUCache.set('c', 3);
    LRUCache.set('d', 4); // 'a' should be evicted

    expect(LRUCache.get('a')).toBeUndefined();
    expect(LRUCache.get('d')).toBe(4);
    expect(LRUCache.size()).toBe(3);
  });

  it('returns expired entries as undefined', () => {
    // Fast-forward timer to expire entry
    vi.setSystemTime(Date.now());
    responseCache.set('expiring', { text: 'soon gone' });

    // Advance time past TTL
    vi.setSystemTime(Date.now() + CACHE_CONFIG.ttlMs + 1000);

    expect(responseCache.get('expiring')).toBeUndefined();
  });

  it('reports stats correctly', () => {
    responseCache.clear();
    responseCache.set('s1', { text: 'a' });
    responseCache.get('s1');

    const stats = responseCache.stats();
    expect(stats).toHaveProperty('size');
    expect(stats).toHaveProperty('hits');
    expect(stats).toHaveProperty('misses');
    expect(stats).toHaveProperty('hitRate');
  });
});

// ── Anthropic format helpers ──────────────────────────────
describe('buildAnthropicCachedSystem()', () => {
  it('returns a system array with cache_control', () => {
    const { system } = buildAnthropicCachedSystem('Knowledge text here');
    expect(Array.isArray(system)).toBe(true);
    expect(system[0].cache_control).toEqual({ type: 'ephemeral' });
    expect(system[0].text).toBe('Knowledge text here');
  });

  it('includes tone block when provided', () => {
    const { system } = buildAnthropicCachedSystem('kb', 'Be friendly');
    expect(system).toHaveLength(2);
    expect(system[1].text).toBe('Be friendly');
  });

  it('omits tone block when empty', () => {
    const { system } = buildAnthropicCachedSystem('kb');
    expect(system).toHaveLength(1);
  });
});

describe('buildAnthropicMessages()', () => {
  it('maps history and appends the new user message', () => {
    const history = [
      { role: 'user', text: 'Hello' },
      { role: 'bot',  text: 'Niaje!' },
    ];
    const msgs = buildAnthropicMessages(history, 'How do I use Git?');
    expect(msgs).toHaveLength(3);
    expect(msgs[0]).toEqual({ role: 'user', content: 'Hello' });
    expect(msgs[1]).toEqual({ role: 'assistant', content: 'Niaje!' });
    expect(msgs[2]).toEqual({ role: 'user', content: 'How do I use Git?' });
  });
});

// ── Gemini format helpers ─────────────────────────────────
describe('buildGeminiCacheRequest()', () => {
  it('builds a valid Gemini cached content request', () => {
    const req = buildGeminiCacheRequest('KB text', 'gemini-2.0-flash', 1800);
    expect(req.model).toBe('models/gemini-2.0-flash');
    expect(req.ttl).toBe('1800s');
    expect(req.displayName).toBe('ankino-youth-hub-knowledge-v1');
    expect(req.contents).toHaveLength(2);
  });
});

describe('buildGeminiCachedRequest()', () => {
  it('builds a request referencing a cached content name', () => {
    const req = buildGeminiCachedRequest('cachedContents/abc123', 'What is STK Push?');
    expect(req.cachedContent).toBe('cachedContents/abc123');
    expect(req.contents[0].role).toBe('user');
    expect(req.generationConfig.temperature).toBe(0.7);
  });
});
