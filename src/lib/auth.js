// ═══════════════════════════════════════════════════════════
//  ANKINO YOUTH HUB — Firebase Authentication
//  ▸ Google OAuth + GitHub OAuth
//  ▸ Profile-based login (Developer, Creator, Gamer, Founder)
//  ▸ Persists { uid, email, profile, provider } to Firestore
//  ▸ Exposes reactive auth state via onAuthStateChange callback
// ═══════════════════════════════════════════════════════════

import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';

// ── Firebase config (public — safe in browser) ────────────
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// ── Singleton init (share with firebase.js if already started) ────
function getFirebaseApp() {
  return getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
}

const _app = getFirebaseApp();
const auth  = getAuth(_app);
const db    = getFirestore(_app);

// ── Providers ─────────────────────────────────────────────
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');

const githubProvider = new GithubAuthProvider();
githubProvider.addScope('read:user');
githubProvider.addScope('user:email');

// ── Current session state (module-level reactive store) ───
export let currentUser = null;  // Firebase User object or null
export let currentProfile = null; // 'developer' | 'creator' | 'gamer' | 'founder'

// ── Profile metadata ──────────────────────────────────────
export const PROFILES = {
  developer: {
    label:   'Developer',
    icon:    '</>', 
    tagline: 'Build · Ship · Scale',
    color:   '#00d4ff',
    emoji:   '💻',
  },
  creator: {
    label:   'Creator',
    icon:    '✦',
    tagline: 'Design · Express · Impact',
    color:   '#ff6b9d',
    emoji:   '🎨',
  },
  gamer: {
    label:   'Gamer',
    icon:    '⬡',
    tagline: 'Play · Compete · Win',
    color:   '#a855f7',
    emoji:   '🎮',
  },
  founder: {
    label:   'Founder',
    icon:    '◎',
    tagline: 'Ideate · Fund · Launch',
    color:   '#f59e0b',
    emoji:   '🚀',
  },
};

// ── Auth state listeners (multiple subscribers allowed) ───
const _listeners = new Set();

export function onAuthStateChange(callback) {
  _listeners.add(callback);
  // Return unsubscribe
  return () => _listeners.delete(callback);
}

function _notify(user, profile) {
  for (const cb of _listeners) {
    try { cb(user, profile); } catch (e) { console.warn('[auth] listener error', e); }
  }
}

// ── Bootstrap Firebase Auth listener ─────────────────────
onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    // Load profile from Firestore
    try {
      const snap = await getDoc(doc(db, 'users', user.uid));
      currentProfile = snap.exists() ? (snap.data().profile ?? null) : null;
    } catch {
      currentProfile = null;
    }
    _notify(user, currentProfile);
  } else {
    currentUser    = null;
    currentProfile = null;
    _notify(null, null);
  }
});

// ── Sign in with Google ───────────────────────────────────
/**
 * @param {string} profile  - 'developer' | 'creator' | 'gamer' | 'founder'
 * @returns {{ user, profile } | { error }}
 */
export async function signInWithGoogle(profile) {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    await _saveUserProfile(result.user, profile, 'google');
    currentProfile = profile;
    _notify(result.user, profile);
    return { user: result.user, profile };
  } catch (err) {
    console.error('[auth] Google sign-in failed:', err.code, err.message);
    return { error: _friendlyError(err.code) };
  }
}

// ── Sign in with GitHub ───────────────────────────────────
/**
 * @param {string} profile  - 'developer' | 'creator' | 'gamer' | 'founder'
 * @returns {{ user, profile } | { error }}
 */
export async function signInWithGitHub(profile) {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    await _saveUserProfile(result.user, profile, 'github');
    currentProfile = profile;
    _notify(result.user, profile);
    return { user: result.user, profile };
  } catch (err) {
    console.error('[auth] GitHub sign-in failed:', err.code, err.message);
    return { error: _friendlyError(err.code) };
  }
}

// ── Sign out ──────────────────────────────────────────────
export async function signOut() {
  try {
    await firebaseSignOut(auth);
    currentUser    = null;
    currentProfile = null;
    _notify(null, null);
    return { ok: true };
  } catch (err) {
    console.error('[auth] Sign out failed:', err.message);
    return { error: err.message };
  }
}

// ── Update profile (for already-signed-in users) ─────────
export async function updateProfile(newProfile) {
  if (!currentUser) return { error: 'Not signed in' };
  try {
    await _saveUserProfile(currentUser, newProfile, null);
    currentProfile = newProfile;
    _notify(currentUser, newProfile);
    return { ok: true };
  } catch (err) {
    return { error: err.message };
  }
}

// ── Internal: persist user doc to Firestore ───────────────
async function _saveUserProfile(user, profile, provider) {
  try {
    const ref  = doc(db, 'users', user.uid);
    const snap = await getDoc(ref);
    const existing = snap.exists() ? snap.data() : {};

    await setDoc(ref, {
      uid:          user.uid,
      email:        user.email ?? existing.email ?? null,
      displayName:  user.displayName ?? existing.displayName ?? null,
      photoURL:     user.photoURL ?? existing.photoURL ?? null,
      // Only update profile if explicitly provided
      profile:      profile ?? existing.profile ?? null,
      // Only update provider on first sign-in
      provider:     provider ?? existing.provider ?? 'unknown',
      updatedAt:    serverTimestamp(),
      // Preserve createdAt on first write
      ...(!snap.exists() ? { createdAt: serverTimestamp() } : {}),
    }, { merge: true });
  } catch (err) {
    console.warn('[auth] Firestore write failed:', err.message);
    // Non-fatal — user is still authenticated
  }
}

// ── Human-readable error messages ─────────────────────────
function _friendlyError(code) {
  const map = {
    'auth/popup-closed-by-user':    'Sign-in cancelled. Close the popup?',
    'auth/popup-blocked':           'Popup was blocked. Please allow popups for this site.',
    'auth/account-exists-with-different-credential':
                                    'An account with this email already exists. Try signing in with Google instead.',
    'auth/cancelled-popup-request': 'Another sign-in is in progress.',
    'auth/network-request-failed':  'Network error. Check your connection and try again.',
    'auth/too-many-requests':       'Too many attempts. Please wait a moment.',
  };
  return map[code] ?? `Sign-in failed (${code ?? 'unknown'}). Please try again.`;
}

// ── Helpers ───────────────────────────────────────────────
export function isSignedIn()     { return !!currentUser; }
export function getUserName()    { return currentUser?.displayName ?? currentUser?.email ?? null; }
export function getUserPhoto()   { return currentUser?.photoURL ?? null; }
export function getUserEmail()   { return currentUser?.email ?? null; }
export function getProfileMeta() { return PROFILES[currentProfile] ?? null; }
