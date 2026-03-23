// ══════════════════════════════════════════════════
//  TERRA — js/db.js  v0.3.0
// ══════════════════════════════════════════════════

import { db } from './auth.js';
import {
  doc, getDoc, setDoc, updateDoc, collection,
  query, where, getDocs, serverTimestamp,
  onSnapshot, arrayUnion, arrayRemove, deleteDoc,
  orderBy, limit,
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

// ── PROFILS ──────────────────────────────────────
export async function getProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
}
export async function createProfile(uid, data) {
  await setDoc(doc(db, 'users', uid), {
    displayName: data.displayName || 'Joueur',
    email:       data.email || '',
    createdAt:   serverTimestamp(),
    worlds:      [],
    stats: { totalBuilt:0, totalDays:0, totalCycles:0 },
  });
}
export async function updateProfile(uid, data) {
  await updateDoc(doc(db, 'users', uid), data);
}
export async function addWorldToProfile(uid, worldId) {
  await updateDoc(doc(db, 'users', uid), { worlds: arrayUnion(worldId) });
}
export async function removeWorldFromProfile(uid, worldId) {
  await updateDoc(doc(db, 'users', uid), { worlds: arrayRemove(worldId) });
}

// ── MONDES ───────────────────────────────────────
function genCode() { return Math.floor(100000 + Math.random() * 900000).toString(); }

export async function createWorld(uid, displayName, worldName) {
  const code = genCode();
  const ref  = doc(collection(db, 'worlds'));
  await setDoc(ref, {
    name: worldName || `Monde de ${displayName}`,
    code, createdBy: uid, createdAt: serverTimestamp(),
    status: 'active', maxPlayers: 8,
    players: { [uid]: { name: displayName, joinedAt: serverTimestamp(), online: true } },
  });
  await addWorldToProfile(uid, ref.id);
  return { worldId: ref.id, code };
}

export async function joinWorldByCode(uid, displayName, code) {
  const q    = query(collection(db, 'worlds'), where('code', '==', code));
  const snap = await getDocs(q);
  if (snap.empty) throw new Error('Code invalide — aucun monde trouvé.');
  const wDoc  = snap.docs[0];
  const world = wDoc.data();
  if (Object.keys(world.players||{}).length >= world.maxPlayers) throw new Error('Monde complet.');
  await updateDoc(wDoc.ref, {
    [`players.${uid}`]: { name: displayName, joinedAt: serverTimestamp(), online: true },
  });
  await addWorldToProfile(uid, wDoc.id);
  return { worldId: wDoc.id, world: wDoc.data() };
}

export async function getWorld(worldId) {
  const snap = await getDoc(doc(db, 'worlds', worldId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}
export function listenWorld(worldId, cb) {
  return onSnapshot(doc(db, 'worlds', worldId), s => { if (s.exists()) cb({ id:s.id, ...s.data() }); });
}
export async function deleteWorld(worldId, uid) {
  const snap = await getDoc(doc(db, 'worlds', worldId));
  if (!snap.exists()) throw new Error('Monde introuvable.');
  if (snap.data().createdBy !== uid) throw new Error('Seul le créateur peut supprimer ce monde.');
  await deleteDoc(doc(db, 'worlds', worldId));
  await removeWorldFromProfile(uid, worldId);
}

export async function setPlayerOnline(worldId, uid, online) {
  await updateDoc(doc(db, 'worlds', worldId), { [`players.${uid}.online`]: online });
}

// ── CITÉS ────────────────────────────────────────
export async function loadCity(worldId, uid) {
  const snap = await getDoc(doc(db, 'worlds', worldId, 'cities', uid));
  return snap.exists() ? snap.data() : null;
}
export async function saveCity(worldId, uid, state) {
  const payload = {
    res:state.res, isp:state.isp, pop:state.pop, popMax:state.popMax,
    day:state.day, cycle:state.cycle, hasTH:state.hasTH,
    zones:state.zones, built:state.built, tm:state.tm,
    lastSaved: serverTimestamp(),
  };
  await setDoc(doc(db, 'worlds', worldId, 'cities', uid), payload, { merge:true });
}
export function listenCities(worldId, cb) {
  return onSnapshot(collection(db, 'worlds', worldId, 'cities'), snap => {
    const cities = {};
    snap.docs.forEach(d => { cities[d.id] = d.data(); });
    cb(cities);
  });
}
export async function syncStats(uid, state) {
  await updateDoc(doc(db, 'users', uid), {
    'stats.totalBuilt':  Object.values(state.built).reduce((a,b)=>a+b,0),
    'stats.totalDays':   state.day,
    'stats.totalCycles': state.cycle,
  });
}

// ══════════════════════════════════════════════════
//  HÔTEL DES VENTES
//  Collection : worlds/{worldId}/market/{offerId}
//  Chaque offre : { uid, playerName, give:{res,qty}, want:{res,qty}, rate, day, createdAt }
// ══════════════════════════════════════════════════

export async function postOffer(worldId, uid, playerName, give, want, rate, day) {
  const ref = doc(collection(db, 'worlds', worldId, 'market'));
  await setDoc(ref, {
    uid, playerName,
    give, want, rate, day,
    createdAt: serverTimestamp(),
    status: 'open',
  });
  return ref.id;
}

export async function cancelOffer(worldId, offerId) {
  await deleteDoc(doc(db, 'worlds', worldId, 'market', offerId));
}

export async function acceptOffer(worldId, offerId, buyerUid, buyerName) {
  await updateDoc(doc(db, 'worlds', worldId, 'market', offerId), {
    status:     'done',
    buyerUid,
    buyerName,
    closedAt:   serverTimestamp(),
  });
}

export function listenMarket(worldId, cb) {
  const q = query(
    collection(db, 'worlds', worldId, 'market'),
    where('status', '==', 'open'),
    orderBy('createdAt', 'desc'),
    limit(40)
  );
  return onSnapshot(q, snap => {
    const offers = snap.docs.map(d => ({ id:d.id, ...d.data() }));
    cb(offers);
  });
}

export async function getMyOffers(worldId, uid) {
  const q    = query(collection(db, 'worlds', worldId, 'market'), where('uid','==',uid), where('status','==','open'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id:d.id, ...d.data() }));
}
