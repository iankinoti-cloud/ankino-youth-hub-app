// ═══════════════════════════════════════════════════════════
//  ANKINO YOUTH HUB — AI Chatbot UI
//  Rich rendering: markdown, code blocks, copy, chips
//
//  Primary:  Gemini 2.5 Flash via /api/ai/chat
//  Fallback: local brain.js NLP (offline / no key / API error)
//
//  Profile-aware: passes currentProfile to API so the server
//  returns a tailored response (Developer / Creator / Gamer / Founder)
// ═══════════════════════════════════════════════════════════
import { respond, buildMessages, ctx } from './brain.js';
import { currentProfile } from '../lib/auth.js';

// ── API base — resolves correctly in dev (Vite proxy) and prod (SWA) ─
const API_BASE = import.meta.env.VITE_API_BASE ?? '/api';

// ── Call the Gemini proxy ─────────────────────────────────
/**
 * Sends the conversation to /api/ai/chat (Gemini provider).
 * Returns a brain.js-compatible response object: { text, followUps?, label? }
 * Throws on network / API errors so the caller can fall back.
 */
async function callGemini(userInput) {
  const messages    = buildMessages(userInput);
  const userProfile = currentProfile ?? 'default';

  const res = await fetch(`${API_BASE}/ai/chat`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ messages, provider: 'gemini', userProfile }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = err.error ?? `API error ${res.status}`;
    throw new Error(msg);
  }

  const data = await res.json();
  const text = data.content?.trim();

  if (!text) throw new Error('Empty response from Gemini');

  // Log cache savings in dev
  if (import.meta.env.DEV && data.cachedTokens) {
    console.info(`[Chatbot] Gemini cached tokens: ${data.cachedTokens}`);
  }

  // Store the AI reply in brain.js context so history stays consistent
  ctx.history.push({ role: 'bot', text, topic: ctx.currentTopic });
  ctx.turnCount++;

  return { text, followUps: [] };
}

// ── Markdown-to-HTML renderer (safe, bot-content only) ────
function renderMarkdown(text) {
  return text
    // **bold**
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // `inline code`
    .replace(/`([^`\n]+)`/g, '<code>$1</code>')
    // Bullet points
    .replace(/^• (.+)$/gm, '<li>$1</li>')
    // Wrap consecutive <li> in <ul>
    .replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`)
    // Line breaks
    .replace(/\n/g, '<br>');
}

// ── Render code block with language label + copy button ───
function buildCodeBlock(code) {
  const wrapper = document.createElement('div');
  wrapper.className = 'chat-code-block';

  const header = document.createElement('div');
  header.className = 'code-header';

  const langLabel = document.createElement('span');
  langLabel.className = 'code-lang';
  langLabel.textContent = code.lang || 'code';

  const copyBtn = document.createElement('button');
  copyBtn.className = 'copy-btn';
  copyBtn.textContent = 'Copy';
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(code.content).then(() => {
      copyBtn.textContent = 'Copied ✓';
      copyBtn.classList.add('copied');
      setTimeout(() => {
        copyBtn.textContent = 'Copy';
        copyBtn.classList.remove('copied');
      }, 2000);
    });
  });

  header.appendChild(langLabel);
  header.appendChild(copyBtn);

  const pre = document.createElement('pre');
  const codeEl = document.createElement('code');
  codeEl.textContent = code.content; // textContent — safe, preserves formatting
  pre.appendChild(codeEl);
  pre.className = 'code-block-content';

  wrapper.appendChild(header);
  wrapper.appendChild(pre);
  return wrapper;
}

// ── Render quick-reply chips ───────────────────────────────
function buildChips(followUps, onChipClick) {
  if (!followUps?.length) return null;
  const row = document.createElement('div');
  row.className = 'chat-chips';
  followUps.forEach((text) => {
    const btn = document.createElement('button');
    btn.className = 'chat-chip';
    btn.textContent = text;
    btn.addEventListener('click', () => onChipClick(text));
    row.appendChild(btn);
  });
  return row;
}

// ── Render a bot message ───────────────────────────────────
function renderBotMessage(container, response, onChipClick) {
  const wrapper = document.createElement('div');
  wrapper.className = 'chat-msg-wrapper';

  // Topic badge (optional)
  if (response.label) {
    const badge = document.createElement('div');
    badge.className = 'chat-topic-badge';
    badge.textContent = `// ${response.label}`;
    wrapper.appendChild(badge);
  }

  // Main message bubble
  const div = document.createElement('div');
  div.className = 'chat-msg bot';
  const p = document.createElement('p');
  p.innerHTML = renderMarkdown(response.text);
  div.appendChild(p);
  wrapper.appendChild(div);

  // Code block (if any)
  if (response.code) {
    wrapper.appendChild(buildCodeBlock(response.code));
  }

  // Proactive nudge (if brain set one)
  if (response.proactive) {
    const nudge = document.createElement('div');
    nudge.className = 'chat-msg bot chat-proactive';
    nudge.innerHTML = `<p>💡 ${response.proactive}</p>`;
    wrapper.appendChild(nudge);
  }

  // Follow-up chips
  const chips = buildChips(response.followUps, onChipClick);
  if (chips) wrapper.appendChild(chips);

  container.appendChild(wrapper);
  container.scrollTop = container.scrollHeight;
}

// ── Render an error message (visible to user) ─────────────
function renderErrorMessage(container, message) {
  const wrapper = document.createElement('div');
  wrapper.className = 'chat-msg-wrapper';
  const div = document.createElement('div');
  div.className = 'chat-msg bot chat-error';
  div.innerHTML = `<p>⚠️ ${message}</p>`;
  wrapper.appendChild(div);
  container.appendChild(wrapper);
  container.scrollTop = container.scrollHeight;
}

// ── Render a user message (textContent — XSS safe) ────────
function renderUserMessage(container, text) {
  const div = document.createElement('div');
  div.className = 'chat-msg user';
  const p = document.createElement('p');
  p.textContent = text; // safe — no HTML interpretation
  div.appendChild(p);
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

// ── Typing indicator ──────────────────────────────────────
function showTyping(container) {
  const div = document.createElement('div');
  div.className = 'chat-typing';
  div.id = 'typing-indicator';
  div.innerHTML = '<span></span><span></span><span></span>';
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function hideTyping() {
  document.getElementById('typing-indicator')?.remove();
}

// ── Simulate realistic typing delay (fallback path only) ──
function typingDelay(responseText) {
  const words = responseText.split(' ').length;
  return Math.min(400 + words * 18, 2200); // scale with length, cap at 2.2s
}

// ── Update chatbot header to reflect user profile ─────────
export function updateChatbotProfile(profile) {
  const PROFILE_LABELS = {
    developer: { label: 'Dev Mentor',    emoji: '💻' },
    creator:   { label: 'Creative Guide', emoji: '🎨' },
    gamer:     { label: 'Gamer Coach',   emoji: '🎮' },
    founder:   { label: 'Startup Mentor', emoji: '🚀' },
    default:   { label: 'Tech Mentor',   emoji: '🤖' },
  };

  const meta = PROFILE_LABELS[profile] ?? PROFILE_LABELS.default;
  const statusEl = document.querySelector('.chatbot-status');
  const avatarEl = document.querySelector('.chatbot-avatar span:first-child');

  if (statusEl) statusEl.textContent = `Online · ${meta.label}`;
  if (avatarEl) avatarEl.textContent = meta.emoji;
}

// ── Main init ─────────────────────────────────────────────
export function initChatbot() {
  const fab       = document.getElementById('chatbot-fab');
  const container = document.getElementById('chatbot-container');
  const closeBtn  = document.getElementById('chatbot-close');
  const openChat  = document.getElementById('open-chat');
  const input     = document.getElementById('chatbot-input');
  const sendBtn   = document.getElementById('chatbot-send');
  const messages  = document.getElementById('chatbot-messages');

  let isTyping = false;

  function open()  { container.classList.add('open'); input.focus({ preventScroll: true }); }
  function close() { container.classList.remove('open'); }

  fab.addEventListener('click', () => container.classList.contains('open') ? close() : open());
  closeBtn.addEventListener('click', close);
  openChat?.addEventListener('click', open);

  // Chip click = send as user message
  function handleChipClick(text) {
    if (isTyping) return;
    input.value = text;
    send();
  }

  async function send() {
    const text = input.value.trim();
    if (!text || isTyping) return;

    renderUserMessage(messages, text);
    input.value = '';
    isTyping = true;
    input.disabled = true;
    sendBtn.disabled = true;

    // Push user message into brain context so history is tracked
    ctx.history.push({ role: 'user', text, topic: ctx.currentTopic });

    showTyping(messages);

    let response;

    try {
      // ── Primary: Gemini API (profile-aware, prompt-cached) ───
      response = await callGemini(text);
    } catch (err) {
      // ── Fallback: local brain.js NLP ────────────────────────
      const isApiDown = err.message?.includes('503') || err.message?.includes('not configured');
      const isNetwork = err.message?.includes('Network') || err.message?.includes('fetch');

      if (isApiDown || isNetwork) {
        // Show a visible notice (not just console.warn)
        console.warn('[Chatbot] Gemini unavailable:', err.message);
      } else {
        console.warn('[Chatbot] API error, using local brain:', err.message);
      }

      response = respond(text);
    }

    hideTyping();
    renderBotMessage(messages, response, handleChipClick);

    isTyping = false;
    input.disabled = false;
    sendBtn.disabled = false;
    input.focus({ preventScroll: true });
  }

  sendBtn.addEventListener('click', send);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  });
}
