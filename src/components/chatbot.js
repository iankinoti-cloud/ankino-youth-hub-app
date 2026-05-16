// ═══════════════════════════════════════════════════════════
//  ANKINO YOUTH HUB — AI Chatbot UI
//  Rich rendering: markdown, code blocks, copy, chips
// ═══════════════════════════════════════════════════════════
import { respond } from './brain.js';

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

// ── Simulate realistic typing delay ───────────────────────
function typingDelay(responseText) {
  const words = responseText.split(' ').length;
  return Math.min(400 + words * 18, 2200); // scale with length, cap at 2.2s
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

  function send() {
    const text = input.value.trim();
    if (!text || isTyping) return;

    renderUserMessage(messages, text);
    input.value = '';
    isTyping = true;
    input.disabled = true;
    sendBtn.disabled = true;

    showTyping(messages);

    const response = respond(text);
    const delay = typingDelay(response.text);

    setTimeout(() => {
      hideTyping();
      renderBotMessage(messages, response, handleChipClick);
      isTyping = false;
      input.disabled = false;
      sendBtn.disabled = false;
      input.focus({ preventScroll: true });
    }, delay);
  }

  sendBtn.addEventListener('click', send);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  });
}
