// ── AI Health Probe — Vercel Edge Function ──────────────────────────────────
// Ported from api/src/functions/ai-proxy.js (Azure). Same response shape.
// Route: GET /api/ai/health

export const config = { runtime: 'edge' };

export default async function handler() {
  return new Response(
    JSON.stringify({
      status: 'ok',
      timestamp: new Date().toISOString(),
      providers: {
        claude: !!process.env.ANTHROPIC_API_KEY,
        gemini: !!process.env.GEMINI_API_KEY,
        geminiCacheName: process.env.GEMINI_CACHE_NAME ?? null,
      },
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}
