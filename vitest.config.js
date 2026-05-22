import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // ── Environment ──────────────────────────────────────
    environment: 'jsdom',   // DOM APIs available (window, document, localStorage)
    globals:     true,      // describe / it / expect / vi available globally

    // ── Test discovery ───────────────────────────────────
    include: [
      'src/**/*.{test,spec}.{js,mjs}',
      'src/__tests__/**/*.{js,mjs}',
    ],
    exclude: ['node_modules', 'dist', 'public', 'src/__tests__/setup.js'],

    // ── Coverage ─────────────────────────────────────────
    coverage: {
      provider:  'v8',
      reporter:  ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/**',
        'dist/**',
        'src/__tests__/**',
        'vitest.config.js',
        'vite.config.js',
        'eslint.config.js',
        'sketch.js',
        // Azure Functions — Node runtime, tested via integration / smoke-test
        'api/**',
        // Canvas engine — visual/render, not unit-testable
        'src/canvas/**',
        // App boot — DOM-heavy, covered by E2E (future)
        'src/main.js',
        // Auth modal — pure DOM rendering, covered by E2E (future)
        'src/components/auth-modal.js',
        // Chat UI — pure DOM rendering, covered by E2E (future)
        'src/components/chatbot.js',
        // Static data arrays — no logic to test
        'src/data/content.js',
        // Firebase wrappers — require live Firebase, tested via integration
        'src/lib/auth.js',
        'src/lib/firebase.js',
        // Batch queue — infrastructure layer, covered when backend is added
        'src/lib/batch.js',
      ],
      // Scaffold-phase thresholds — raise to 70% by v1.1 as E2E tests are added.
      // KB getResponse() functions are integration-tested via brain.js but not
      // all 40+ topics are explicitly invoked in unit tests yet.
      thresholds: {
        lines:      55,
        functions:  40,   // bump to 65% once topic-specific tests are added
        branches:   35,
        statements: 55,
      },
    },

    // ── Setup files ──────────────────────────────────────
    setupFiles: ['./src/__tests__/setup.js'],

    // ── Aliases (match vite.config.js) ───────────────────
    alias: {
      '@': '/src',
    },

    // ── Timeouts ─────────────────────────────────────────
    testTimeout:  10_000,
    hookTimeout:  10_000,

    // ── Reporter ─────────────────────────────────────────
    reporter: process.env.CI ? ['verbose', 'junit'] : ['verbose'],
    outputFile: {
      junit: './test-results/junit.xml',
    },
  },
});
