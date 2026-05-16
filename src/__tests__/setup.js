// ═══════════════════════════════════════════════════════════
//  ANKINO YOUTH HUB — Vitest Global Test Setup
// ═══════════════════════════════════════════════════════════
import { vi } from 'vitest';

// ── Silence console in tests unless DEBUG=1 ───────────────
if (!process.env.DEBUG) {
  global.console = {
    ...console,
    debug: vi.fn(),
    log:   vi.fn(),
    // Keep warn/error visible for debugging failures
  };
}

// ── Mock setInterval / clearInterval (used by LRU cache) ──
vi.useFakeTimers({ shouldAdvanceTime: false });

// ── Mock import.meta.env ──────────────────────────────────
vi.stubGlobal('import', {
  meta: {
    env: { DEV: false, PROD: true },
  },
});

// ── Reset modules between test files ─────────────────────
afterEach(() => {
  vi.clearAllTimers();
});
