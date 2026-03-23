// ══════════════════════════════════════════════════
//  TERRA — js/auth.js
//  Firebase Auth + gestion du profil utilisateur
// ══════════════════════════════════════════════════

import { initializeApp }          from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword,
         signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged,
         updateProfile }           from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { getFirestore }            from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

// ── Init Firebase ──
export const app  = initializeApp(window.FIREBASE_CONFIG);
export const auth = getAuth(app);
export const db   = getFirestore(app);

const provider = new GoogleAuthProvider();

// ── Auth actions ──
export async function loginEmail(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function registerEmail(email, password, displayName) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName });
  return cred;
}

export async function loginGoogle() {
  return signInWithPopup(auth, provider);
}

export async function logout() {
  return signOut(auth);
}

// ── Observer ──
export function onAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

// ── Helpers ──
export function currentUser() {
  return auth.currentUser;
}

export function getInitials(name = '') {
  return name.trim().split(' ').map(w => w[0]?.toUpperCase() || '').join('').slice(0, 2) || '?';
}

// Couleurs d'avatar déterministes basées sur l'uid
const AVATAR_COLORS = [
  ['#22d3ee','#0891b2'], ['#34d399','#059669'],
  ['#f59e0b','#b45309'], ['#a78bfa','#6d28d9'],
  ['#f87171','#b91c1c'], ['#fb923c','#c2410c'],
];
export function avatarColor(uid = '') {
  const idx = uid.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}
