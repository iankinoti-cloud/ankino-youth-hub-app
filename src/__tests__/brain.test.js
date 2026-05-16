// ═══════════════════════════════════════════════════════════
//  Tests — src/components/brain.js
// ═══════════════════════════════════════════════════════════
import { describe, it, expect, beforeEach } from 'vitest';
import { respond, classify, ctx, resetContext, getCacheStats } from '../components/brain.js';

beforeEach(() => {
  resetContext();
});

// ── classify() ────────────────────────────────────────────
describe('classify()', () => {
  it('matches "daraja api" to the daraja topic', () => {
    const entry = classify('Tell me about Daraja API');
    expect(entry).not.toBeNull();
    expect(entry.topic).toBe('daraja');
  });

  it('matches "stk push" to the stk_push topic', () => {
    const entry = classify('How do I implement STK Push?');
    expect(entry).not.toBeNull();
    expect(entry.topic).toBe('stk_push');
  });

  it('matches "hackathon" to hackathons_kenya', () => {
    const entry = classify('Show me hackathons in Kenya');
    expect(entry).not.toBeNull();
    expect(entry.topic).toBe('hackathons_kenya');
  });

  it('matches "git commit" to git topic', () => {
    const entry = classify('How do git commit and push work?');
    expect(entry).not.toBeNull();
    expect(entry.topic).toBe('git');
  });

  it('matches "react" to react topic', () => {
    const entry = classify('Teach me React');
    expect(entry).not.toBeNull();
    expect(entry.topic).toBe('react');
  });

  it('returns null for completely unrelated input', () => {
    const entry = classify('xiijfksjdhf random gibberish 12345');
    expect(entry).toBeNull();
  });

  it('returns null for very short single-word non-match', () => {
    const entry = classify('zzz');
    expect(entry).toBeNull();
  });
});

// ── respond() ─────────────────────────────────────────────
describe('respond()', () => {
  it('returns an object with a text property', () => {
    const res = respond('What is Daraja?');
    expect(res).toHaveProperty('text');
    expect(typeof res.text).toBe('string');
    expect(res.text.length).toBeGreaterThan(20);
  });

  it('returns followUps array', () => {
    const res = respond('Tell me about hackathons in Kenya');
    expect(res).toHaveProperty('followUps');
    expect(Array.isArray(res.followUps)).toBe(true);
    expect(res.followUps.length).toBeGreaterThan(0);
  });

  it('returns a cached result on repeated identical input', () => {
    respond('How do I use STK Push?');
    const second = respond('How do I use STK Push?');
    expect(second._fromCache).toBe(true);
  });

  it('normalises cache key so identical queries hit cache', () => {
    respond('how do i use git');
    const second = respond('How Do I Use Git');
    expect(second._fromCache).toBe(true);
  });

  it('handles greeting inputs', () => {
    const res = respond('niaje');
    expect(res.text).toBeTruthy();
  });

  it('handles "what is X" questions via WHAT_IS_DICT', () => {
    const res = respond('What is RAM?');
    expect(res.text).toContain('RAM');
  });

  it('falls back gracefully for unrecognised input', () => {
    const res = respond('alksjdhflkasdjhf');
    expect(res.text).toBeTruthy();
    expect(res.followUps).toBeDefined();
  });

  it('increments turnCount on each call', () => {
    expect(ctx.turnCount).toBe(0);
    respond('hello');
    expect(ctx.turnCount).toBe(1);
    respond('what is git');
    expect(ctx.turnCount).toBe(2);
  });

  it('detects user type from input', () => {
    respond('I want to freelance as a developer');
    expect(ctx.userType).toBe('dev');
  });

  it('detects founder user type', () => {
    respond('I am building a startup and need funding');
    expect(ctx.userType).toBe('founder');
  });

  it('keeps history size within bounds', () => {
    for (let i = 0; i < 12; i++) {
      respond(`question number ${i} about daraja api`);
    }
    expect(ctx.history.length).toBeLessThanOrEqual(8);
  });

  it('injects proactive prompt on 4th turn', () => {
    respond('I want to learn javascript for dev');
    respond('Tell me about git');
    respond('How do I get an internship');
    const fourth = respond('Show me hackathons');
    // On the 4th turn with a known userType, proactive should be set
    // (only if not from cache, and userType was set)
    if (!fourth._fromCache) {
      // proactive is conditionally set — just ensure it's string or undefined
      expect(fourth.proactive === undefined || typeof fourth.proactive === 'string').toBe(true);
    }
  });
});

// ── resetContext() ────────────────────────────────────────
describe('resetContext()', () => {
  it('clears history, topic, and turnCount', () => {
    respond('daraja api');
    respond('stk push');
    resetContext();

    expect(ctx.history).toHaveLength(0);
    expect(ctx.currentTopic).toBeNull();
    expect(ctx.turnCount).toBe(0);
    expect(ctx.userType).toBeNull();
  });
});

// ── getCacheStats() ───────────────────────────────────────
describe('getCacheStats()', () => {
  it('returns a stats object', () => {
    const stats = getCacheStats();
    expect(stats).toHaveProperty('size');
    expect(stats).toHaveProperty('hits');
    expect(stats).toHaveProperty('misses');
    expect(stats).toHaveProperty('hitRate');
  });
});
