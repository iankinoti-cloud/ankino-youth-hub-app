// ═══════════════════════════════════════════════════════════
//  ANKINO YOUTH HUB — Auth Modal Component
//  ▸ Step 1: Profile selection (Developer / Creator / Gamer / Founder)
//  ▸ Step 2: OAuth provider (Google / GitHub)
//  ▸ Injects modal HTML, manages state, calls auth.js
// ═══════════════════════════════════════════════════════════

import {
  signInWithGoogle,
  signInWithGitHub,
  signOut,
  onAuthStateChange,
  PROFILES,
  currentUser,
  currentProfile,
  isSignedIn,
  getUserName,
  getUserPhoto,
} from '../lib/auth.js';

// ── Inject modal HTML into body ───────────────────────────
export function injectAuthModal() {
  if (document.getElementById('auth-modal-overlay')) return; // already mounted

  const overlay = document.createElement('div');
  overlay.id = 'auth-modal-overlay';
  overlay.className = 'modal-overlay auth-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-labelledby', 'auth-modal-title');

  overlay.innerHTML = `
    <div class="modal auth-modal">
      <button class="modal-close" id="auth-modal-close" aria-label="Close">&times;</button>

      <!-- Step 1: Profile selection -->
      <div class="auth-step" id="auth-step-profile">
        <div class="modal-header">
          <span class="modal-tag">// JOIN THE HUB</span>
          <h3 id="auth-modal-title">Who are you?</h3>
          <p>Pick your profile to get a personalised experience.</p>
        </div>
        <div class="auth-profile-grid">
          ${Object.entries(PROFILES).map(([key, p]) => `
            <button class="auth-profile-card" data-profile="${key}" style="--profile-color: ${p.color}">
              <span class="auth-profile-icon">${p.icon}</span>
              <strong>${p.label}</strong>
              <span class="auth-profile-tagline">${p.tagline}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Step 2: OAuth provider -->
      <div class="auth-step hidden" id="auth-step-provider">
        <div class="modal-header">
          <button class="auth-back-btn" id="auth-back">← Back</button>
          <span class="modal-tag" id="auth-selected-profile-tag">// DEVELOPER</span>
          <h3>Sign in to continue</h3>
          <p id="auth-provider-subtitle">One click and you're in.</p>
        </div>
        <div class="auth-provider-btns">
          <button class="auth-provider-btn google" id="auth-google-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
          <button class="auth-provider-btn github" id="auth-github-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            Continue with GitHub
          </button>
        </div>
        <p class="auth-disclaimer">By signing in, you agree to our terms. Your data is stored securely via Firebase.</p>
        <div class="auth-error" id="auth-error" style="display:none"></div>
        <div class="auth-loading" id="auth-loading" style="display:none">
          <div class="auth-spinner"></div>
          <span>Signing you in...</span>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  _bindModalEvents(overlay);
}

// ── State ─────────────────────────────────────────────────
let _selectedProfile = null;
let _onSuccess = null; // optional callback after sign-in

// ── Open / Close ──────────────────────────────────────────
export function openAuthModal(onSuccess = null) {
  _onSuccess = onSuccess;
  const overlay = document.getElementById('auth-modal-overlay');
  if (!overlay) return;

  _goToStep('profile');
  overlay.setAttribute('aria-hidden', 'false');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

export function closeAuthModal() {
  const overlay = document.getElementById('auth-modal-overlay');
  if (!overlay) return;
  overlay.setAttribute('aria-hidden', 'true');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
  _selectedProfile = null;
  _clearError();
  _setLoading(false);
}

// ── Step navigation ───────────────────────────────────────
function _goToStep(step) {
  document.getElementById('auth-step-profile').classList.toggle('hidden', step !== 'profile');
  document.getElementById('auth-step-provider').classList.toggle('hidden', step !== 'provider');
}

// ── Bind all modal events ─────────────────────────────────
function _bindModalEvents(overlay) {
  // Close on backdrop click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeAuthModal();
  });

  // Close button
  document.getElementById('auth-modal-close').addEventListener('click', closeAuthModal);

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeAuthModal();
  });

  // Profile card selection
  overlay.querySelectorAll('.auth-profile-card').forEach((card) => {
    card.addEventListener('click', () => {
      _selectedProfile = card.dataset.profile;
      const meta = PROFILES[_selectedProfile];

      // Update step 2 UI
      document.getElementById('auth-selected-profile-tag').textContent = `// ${meta.label.toUpperCase()}`;
      document.getElementById('auth-provider-subtitle').textContent =
        `Joining as a ${meta.label} — ${meta.tagline}`;

      // Highlight selected card
      overlay.querySelectorAll('.auth-profile-card').forEach((c) => c.classList.remove('selected'));
      card.classList.add('selected');

      _clearError();
      _goToStep('provider');
    });
  });

  // Back button
  document.getElementById('auth-back').addEventListener('click', () => {
    _clearError();
    _setLoading(false);
    _goToStep('profile');
  });

  // Google sign-in
  document.getElementById('auth-google-btn').addEventListener('click', async () => {
    await _handleSignIn('google');
  });

  // GitHub sign-in
  document.getElementById('auth-github-btn').addEventListener('click', async () => {
    await _handleSignIn('github');
  });
}

// ── Handle OAuth sign-in ──────────────────────────────────
async function _handleSignIn(provider) {
  if (!_selectedProfile) return;
  _clearError();
  _setLoading(true);

  const result = provider === 'google'
    ? await signInWithGoogle(_selectedProfile)
    : await signInWithGitHub(_selectedProfile);

  _setLoading(false);

  if (result.error) {
    _showError(result.error);
    return;
  }

  closeAuthModal();
  if (typeof _onSuccess === 'function') _onSuccess(result.user, result.profile);
}

// ── UI helpers ────────────────────────────────────────────
function _showError(msg) {
  const el = document.getElementById('auth-error');
  if (!el) return;
  el.textContent = msg;
  el.style.display = 'block';
}

function _clearError() {
  const el = document.getElementById('auth-error');
  if (el) el.style.display = 'none';
}

function _setLoading(on) {
  const el      = document.getElementById('auth-loading');
  const googleBtn = document.getElementById('auth-google-btn');
  const githubBtn = document.getElementById('auth-github-btn');
  if (!el) return;
  el.style.display    = on ? 'flex' : 'none';
  if (googleBtn) googleBtn.disabled = on;
  if (githubBtn) githubBtn.disabled = on;
}

// ── Navbar user avatar / state ────────────────────────────
/**
 * Call once at boot.  Reactively updates the navbar whenever auth changes.
 */
export function initAuthNavbar() {
  injectAuthModal();

  const loginBtn  = document.getElementById('nav-login-btn');
  const userChip  = document.getElementById('nav-user-chip');
  const userAvatar = document.getElementById('nav-user-avatar');
  const userName  = document.getElementById('nav-user-name');
  const logoutBtn = document.getElementById('nav-logout-btn');

  function updateNavbar(user, profile) {
    if (user) {
      loginBtn?.classList.add('hidden');
      userChip?.classList.remove('hidden');

      const name  = user.displayName?.split(' ')[0] ?? user.email?.split('@')[0] ?? 'Member';
      const photo = user.photoURL;
      const meta  = PROFILES[profile];

      if (userName)  userName.textContent = name;
      if (userAvatar) {
        if (photo) {
          userAvatar.innerHTML = `<img src="${photo}" alt="${name}" class="nav-avatar-img" />`;
        } else {
          userAvatar.textContent = name[0]?.toUpperCase() ?? '?';
        }
      }

      // Update profile badge colour
      if (meta && userChip) {
        userChip.style.setProperty('--profile-color', meta.color);
        userChip.setAttribute('title', `${meta.label} · ${name}`);
      }
    } else {
      loginBtn?.classList.remove('hidden');
      userChip?.classList.add('hidden');
    }
  }

  // Initial state (Firebase restores session from localStorage)
  onAuthStateChange(updateNavbar);

  // Login button
  loginBtn?.addEventListener('click', () => openAuthModal());

  // Logout button
  logoutBtn?.addEventListener('click', async () => {
    await signOut();
  });
}

// ── Deep-link: open modal with a pre-selected persona ────────────────────────
/**
 * Called when the page is loaded with ?persona=developer|creator|gamer|founder
 * Skips profile-selection (Step 1) and lands directly on the OAuth provider step.
 */
export function openAuthModalForPersona(profile) {
  if (isSignedIn()) return;                  // already authenticated — nothing to do
  if (!PROFILES[profile]) return;            // unknown persona key — ignore

  _selectedProfile = profile;
  const meta = PROFILES[profile];

  openAuthModal();
  requestAnimationFrame(() => {
    document.getElementById('auth-selected-profile-tag').textContent = `// ${meta.label.toUpperCase()}`;
    document.getElementById('auth-provider-subtitle').textContent =
      `Joining as a ${meta.label} — ${meta.tagline}`;
    // Highlight the matching profile card
    document.querySelectorAll('.auth-profile-card').forEach((c) => {
      c.classList.toggle('selected', c.dataset.profile === profile);
    });
    _goToStep('provider');
  });
}

// ── Audience node clicks → open auth modal with pre-selected profile ─────────
export function initAudienceNodeAuth() {
  const typeMap = {
    dev:     'developer',
    creator: 'creator',
    gamer:   'gamer',
    founder: 'founder',
  };

  document.querySelectorAll('.audience-node').forEach((node) => {
    node.style.cursor = 'pointer';
    node.addEventListener('click', () => {
      const profile = typeMap[node.dataset.type] ?? 'developer';

      if (isSignedIn()) return; // already in — do nothing (or open dashboard later)

      // Pre-select profile and skip to step 2
      _selectedProfile = profile;
      const meta = PROFILES[profile];

      openAuthModal();
      // Jump straight to provider step
      requestAnimationFrame(() => {
        document.getElementById('auth-selected-profile-tag').textContent = `// ${meta.label.toUpperCase()}`;
        document.getElementById('auth-provider-subtitle').textContent =
          `Joining as a ${meta.label} — ${meta.tagline}`;
        // Highlight card
        document.querySelectorAll('.auth-profile-card').forEach((c) => {
          c.classList.toggle('selected', c.dataset.profile === profile);
        });
        _goToStep('provider');
      });
    });
  });
}
