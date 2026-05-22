// ═══════════════════════════════════════════════════════════
//  ANKINO YOUTH HUB — Firebase / Firestore Service
//  ▸ Initialises Firebase using VITE_ public config vars
//  ▸ Exports data helpers for: members, registrations,
//    newsletter subscribers, and opportunity interest tracking
//  ▸ All writes are fire-and-forget with graceful error handling
//    so UI never blocks on a failed DB call
// ═══════════════════════════════════════════════════════════

import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';

// ── Firebase project config (public — safe to expose in browser) ──
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// ── Singleton init — safe to call from both firebase.js and auth.js ──
// Uses getApps() guard so Firebase is only initialised once per page load,
// regardless of module evaluation order.
function getFirebaseApp() {
  return getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
}

// ── Initialise once (module singleton) ───────────────────
let db;

function getDB() {
  if (!db) {
    db = getFirestore(getFirebaseApp());
  }
  return db;
}

// ── Internal write helper ─────────────────────────────────
/**
 * Write a document to a Firestore collection.
 * Returns { ok: true, id } on success, { ok: false, error } on failure.
 * Never throws — UI callers can optionally check the result.
 */
async function write(collectionName, data) {
  try {
    const ref  = collection(getDB(), collectionName);
    const doc  = await addDoc(ref, { ...data, createdAt: serverTimestamp() });
    return { ok: true, id: doc.id };
  } catch (err) {
    console.warn(`[firebase] write to "${collectionName}" failed:`, err?.message ?? err);
    return { ok: false, error: err?.message ?? 'unknown' };
  }
}

// ── Public API ────────────────────────────────────────────

/**
 * Save a new Hub member registration.
 * Collection: members
 * @param {{ name: string, email: string, role: string, county: string }} data
 */
export function joinHub({ name, email, role, county }) {
  return write('members', {
    name:   String(name).trim(),
    email:  String(email).trim().toLowerCase(),
    role:   String(role).trim(),
    county: String(county).trim(),
  });
}

/**
 * Save an opportunity interest registration (Apply Now form).
 * Collection: registrations
 * @param {{ name: string, email: string, phone: string, opportunity: string, type: string }} data
 */
export function registerInterest({ name, email, phone, opportunity, type }) {
  return write('registrations', {
    name:        String(name).trim(),
    email:       String(email).trim().toLowerCase(),
    phone:       String(phone).trim(),
    opportunity: String(opportunity).trim(),
    type:        String(type).trim(),
  });
}

/**
 * Save a newsletter subscription email.
 * Collection: newsletter
 * @param {string} email
 */
export function subscribeNewsletter(email) {
  return write('newsletter', {
    email: String(email).trim().toLowerCase(),
  });
}

/**
 * Track an opportunity card click (used for data-driven insights).
 * Collection: opportunity_clicks
 * @param {string} title  - Opportunity title
 * @param {string} type   - 'hackathon' | 'internship' | 'scholarship'
 */
export function trackOpportunityClick(title, type) {
  return write('opportunity_clicks', {
    opportunity: String(title).trim(),
    type:        String(type).trim(),
  });
}
