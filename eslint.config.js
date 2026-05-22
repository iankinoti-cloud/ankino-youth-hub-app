// ═══════════════════════════════════════════════════════════
//  ANKINO YOUTH HUB — ESLint Flat Config (ESLint v9+)
// ═══════════════════════════════════════════════════════════
import js from '@eslint/js';

export default [
  // ── Global ignores ──────────────────────────────────────
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
      'test-results/**',
      'public/**',
      'sketch.js',         // canvas-sketch experiment — not linted
    ],
  },

  // ── Base JS recommended rules ───────────────────────────
  js.configs.recommended,

  // ── Project-wide config ─────────────────────────────────
  {
    files: ['src/**/*.js', 'vite.config.js', 'vitest.config.js'],

    languageOptions: {
      ecmaVersion: 2024,
      sourceType:  'module',
      globals: {
        // Browser globals
        window:      'readonly',
        document:    'readonly',
        navigator:   'readonly',
        console:     'readonly',
        setTimeout:  'readonly',
        clearTimeout:'readonly',
        setInterval: 'readonly',
        clearInterval:'readonly',
        fetch:       'readonly',
        URL:         'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame:  'readonly',
        URLSearchParams:       'readonly',
        history:               'readonly',
        // Vite globals
        'import.meta': 'readonly',
        // Node / config-file globals
        process:     'readonly',
      },
    },

    rules: {
      // ── Errors ─────────────────────────────────────────
      'no-unused-vars':           ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-undef':                  'error',
      'no-console':               ['warn', { allow: ['warn', 'error', 'debug'] }],

      // ── Style — stay consistent with existing codebase ─
      'prefer-const':              'error',
      'no-var':                    'error',
      'eqeqeq':                   ['error', 'always', { null: 'ignore' }],
      'curly':                    ['error', 'multi-line'],

      // ── ES Modern patterns ──────────────────────────────
      'prefer-arrow-callback':     'warn',
      'prefer-template':           'warn',
      'object-shorthand':          'warn',
      'no-duplicate-imports':      'error',

      // ── Security ────────────────────────────────────────
      'no-eval':                   'error',
      'no-implied-eval':           'error',
      'no-new-func':               'error',

      // ── Async / Promise ─────────────────────────────────
      'no-async-promise-executor': 'error',
      'no-return-await':           'warn',
      'require-await':             'warn',

      // ── Relaxed for this codebase ───────────────────────
      'no-prototype-builtins':     'warn',
    },
  },

  // ── Test files — extra globals ──────────────────────────
  {
    files: ['src/__tests__/**/*.js', '**/*.test.js', '**/*.spec.js'],
    languageOptions: {
      globals: {
        describe:   'readonly',
        it:         'readonly',
        test:       'readonly',
        expect:     'readonly',
        beforeEach: 'readonly',
        afterEach:  'readonly',
        beforeAll:  'readonly',
        afterAll:   'readonly',
        vi:         'readonly',
        // Node globals used in setup files
        global:     'readonly',
        process:    'readonly',
      },
    },
    rules: {
      'no-console': 'off',
    },
  },
];
